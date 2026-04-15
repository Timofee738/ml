import os

from ollama import AsyncClient


def _ollama_hosts() -> list[str]:
    raw_hosts = os.getenv(
        "OLLAMA_HOSTS",
        "http://localhost:11434,http://host.docker.internal:11434",
    )
    return [h.strip() for h in raw_hosts.split(",") if h.strip()]


async def get_embedding(text: str) -> list[float]:
    model = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
    last_error: Exception | None = None

    for host in _ollama_hosts():
        client = AsyncClient(host=host)
        try:
            if hasattr(client, "embeddings"):
                response = await client.embeddings(model=model, prompt=text)
                return response["embedding"]

            response = await client.embed(model=model, input=text)
            return response["embeddings"][0]
        except Exception as error:  # noqa: BLE001
            last_error = error
            continue

    if last_error is not None:
        raise last_error
    raise RuntimeError("No Ollama hosts configured for embeddings")
