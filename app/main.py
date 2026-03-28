from fastapi import FastAPI
from app.users.router import users_router

app = FastAPI()

app.include_router(users_router)

@app.get('/')
async def root():
    return {'status': 'ok'}