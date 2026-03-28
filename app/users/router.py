from fastapi import APIRouter, HTTPException, status, Response
from app.users.schemas import RegUser, AuthUser
from app.users.dao import UserDAO
from app.auth import get_password_hash, authenticate_user
import uuid
from app.users.auth import create_access_token, create_refresh_token

users_router = APIRouter(prefix='/users', tags=['users'])

@users_router.post('/register')
async def regiser_user(user_data: RegUser):
    existing_user = await UserDAO.find_one_or_none(user_data.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='User with this email is already registered')
    
    hashed_password = get_password_hash(user_data.password)
    
    await UserDAO.add(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    return {'message': 'You successfully registered'}

@users_router.post('/login')
async def login_user(response: Response, user_data: AuthUser):
    user = await UserDAO.find_one_or_none(email=user_data.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Wrong email')
    
    access_token = create_access_token({'sub': str(user.id)})
    refresh_token = create_refresh_token({'sub': str(user.id)})
    
    response.set_cookie('user_access_token',access_token)
    response.set_cookie('user_refresh_token', refresh_token)
    
    return {'access_token': access_token, 'refresh_token': refresh_token}

