from fastapi import FastAPI
from app.users.router import users_router
from fastapi.middleware.cors import CORSMiddleware
from app.posts.router import posts_router
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # "http://109.196.101.18:3000",
    # "http://109.196.101.18",
    # "http://109.196.101.18:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)



os.makedirs("media/posts", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")


@app.get('/')
async def root():
    return {'status': 'ok'}




app.include_router(users_router)
app.include_router(posts_router)
