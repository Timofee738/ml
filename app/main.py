from fastapi import FastAPI
from app.users.router import users_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(users_router)

@app.get('/')
async def root():
    return {'status': 'ok'}


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # React/Vue разработка
        "http://localhost:8080",      # Vue разработка
        "http://localhost",           # Локальный фронтенд
        "http://127.0.0.1:3000",
        # Для разработки - раскомментируйте для всех origin:
        # "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)