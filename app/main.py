from fastapi import FastAPI
from app.users.router import users_router
from fastapi.middleware.cors import CORSMiddleware
from app.posts.router import posts_router

app = FastAPI()

app.include_router(users_router)
app.include_router(posts_router)


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