import asyncio
import os

import httpx
from ollama import AsyncClient


BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
POSTS_URL = f"{BASE_URL}/posts/create"
TOKEN = os.getenv(
    "ACCESS_TOKEN",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc2MjI5NTcwfQ.9wQTl3Va5p4SORBVtlZlfTKioZ3lVgidaeb3r3uXOf4",
)
MODEL_NAME = os.getenv("OLLAMA_MODEL", "qwen2.5-coder:7b")
EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
TOTAL_POSTS = int(os.getenv("TOTAL_POSTS", "100"))

TOPICS = [
    "Программирование на Python и FastAPI",
    "Космические технологии и SpaceX",
    "Психология саморазвития",
    "Рецепты молекулярной кухни",
    "История древнего Рима",
    "Спорт и биохакинг",
    "ИИ и локальные модели типа Ollama",
]


async def generate_content(ollama_client: AsyncClient, topic: str) -> str:
    prompt = (
        f"Напиши короткий пост для соцсети на тему: {topic}. "
        "Только текст, 2-3 предложения."
    )
    result = await ollama_client.generate(model=MODEL_NAME, prompt=prompt)
    return result["response"].strip()


async def generate_embedding(ollama_client: AsyncClient, text: str) -> list[float]:
    # Для совместимости с разными версиями клиента Ollama.
    if hasattr(ollama_client, "embeddings"):
        response = await ollama_client.embeddings(model=EMBEDDING_MODEL, prompt=text)
        return response["embedding"]

    response = await ollama_client.embed(model=EMBEDDING_MODEL, input=text)
    return response["embeddings"][0]


async def create_post(http_client: httpx.AsyncClient, token: str, title: str, content: str) -> httpx.Response:
    form_data = {
        "title": title,
        "content": content,
    }
    # В текущем проекте токен берется из cookie user_access_token.
    cookies = {"user_access_token": token}
    return await http_client.post(POSTS_URL, data=form_data, cookies=cookies)


async def main() -> None:
    if not TOKEN:
        print("ACCESS_TOKEN не задан. Укажи токен через переменную окружения.")
        return

    print(
        f"Старт: генерирую {TOTAL_POSTS} постов через {MODEL_NAME}, "
        f"embeddings через {EMBEDDING_MODEL}"
    )

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        ollama_client = AsyncClient()
        consecutive_failures = 0

        for i in range(TOTAL_POSTS):
            topic = TOPICS[i % len(TOPICS)]
            index = i + 1

            try:
                content = await generate_content(ollama_client, topic)
                full_text = f"AI Post {index}. {content}"
                embedding = await generate_embedding(ollama_client, full_text)

                response = await create_post(
                    http_client=http_client,
                    token=TOKEN,
                    title=f"AI Post {index}",
                    content=content,
                )

                if response.status_code in (200, 201):
                    print(f"[{index}/{TOTAL_POSTS}] OK ({response.status_code}), embedding_dim={len(embedding)}")
                    consecutive_failures = 0
                elif response.status_code == 401:
                    print(f"[{index}/{TOTAL_POSTS}] Ошибка 401: токен невалиден/истек. Останавливаюсь.")
                    break
                elif response.status_code == 422:
                    print(f"[{index}/{TOTAL_POSTS}] Ошибка 422: {response.text}")
                    break
                else:
                    consecutive_failures += 1
                    print(f"[{index}/{TOTAL_POSTS}] Ошибка {response.status_code}: {response.text}")

            except Exception as error:
                consecutive_failures += 1
                print(f"[{index}/{TOTAL_POSTS}] Исключение: {error}")

            # Не продолжаем бесконечно при массовых проблемах.
            if consecutive_failures >= 5:
                print("Слишком много ошибок подряд (5). Останавливаюсь.")
                break

            await asyncio.sleep(0.5)


if __name__ == "__main__":
    asyncio.run(main())
