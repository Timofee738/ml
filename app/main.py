from fastapi import FastAPI
from app.users.router import users_router
from fastapi.middleware.cors import CORSMiddleware
from app.posts.router import posts_router
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

app.include_router(users_router)
app.include_router(posts_router)

os.makedirs("media/posts", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")


@app.get('/')
async def root():
    return {'status': 'ok'}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Адрес твоего Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
