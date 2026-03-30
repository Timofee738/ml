from fastapi import APIRouter, HTTPException, status, Response, Depends, Request
from app.users.schemas import RegUser, AuthUser
from app.users.dao import UserDAO
from app.auth import get_password_hash, authenticate_user
import random
import string
from app.users.auth import create_access_token, create_refresh_token
from app.users.dependencies import get_current_user
from app.users.models import User
from jose import jwt, JWTError
from app.config import settings
from redis import asyncio as aioredis
from app.tasks.tasks import send_confirmation_email






users_router = APIRouter(prefix='/users', tags=['users'])

redis_client = aioredis.from_url(
    f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}", 
    decode_responses=True
)



@users_router.post('/register')
async def regiser_user(user_data: RegUser):
    existing_user = await UserDAO.find_one_or_none(email=user_data.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='User with this email is already registered')
    
    hashed_password = get_password_hash(user_data.password)
    
    
    
    await UserDAO.add(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
    )
    
    
    
    token = ''.join(random.choices(string.digits, k=6))
    
    await redis_client.set(f'confirm:{token}', user_data.email, ex=86400)
    
    send_confirmation_email.delay(user_data.email, token)
    
    return {'message': 'You successfully registered. Please check your email to verify account'}


#####EMAIL
@users_router.get('/confirm')
async def confirm_email(token: str):
    email = await redis_client.get(f'confirm:{token}')
    if not email:
        raise HTTPException(status_code=400, detail='Token is invalid or expired')
    
    user = await UserDAO.find_one_or_none(email=email)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    await UserDAO.update(model_id=user.id, is_active=True)
    await redis_client.delete(f'confirm:{token}')
    
    return {'messge': 'Email verified'}


@users_router.post('/resend-confirmation')
async def resend_confirmation(email: str):
    user = await UserDAO.find_one_or_none(email=email)
    
    if not user:
        raise HTTPException(status_code=404)
    
    if user.is_active:
        return {'message': 'You already confirmed'}
    
    new_token = ''.join(random.choices(string.digits, k=6))
    
    await redis_client.set(f'confirm:{new_token}', email, ex=86400)
    
    send_confirmation_email.delay(email, new_token)
    
    return {'message': 'Email sended'}





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

@users_router.get('/profile')
async def get_user(user: User = Depends(get_current_user)):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_active': user.is_active,
        'balance': user.balance
    }
    
@users_router.post('/logout')
async def logout(response: Response):
    response.delete_cookie('user_access_token')
    response.delete_cookie('user_refresh_token')
    return {'message': 'You successfully logged out'}


@users_router.post('/refresh')
async def refresh_token(response: Response, request: Request):
    refresh_token = request.cookies.get('user_refresh_token')
    if not refresh_token:
        raise HTTPException(status_code=401, detail='Refresh token missing')
    
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(status_code=401)
        
        new_access_token = create_access_token({'sub': user_id})
        response.set_cookie(
            'user_access_token',
            new_access_token,
            httponly=True
        )
        return {'message': 'Token updated'}
    
    except JWTError:
        raise HTTPException(status_code=401, detail='Refresh token is invalid')




@users_router.post('/delete')
async def delete_user(user_id: int):
    user = await UserDAO.find_one_or_none(id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    await UserDAO.delete(id=user_id)
    return {'message': f'User with {user.email} deleted successfully'}