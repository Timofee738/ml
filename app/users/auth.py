from jose import jwt
from app.config import settings
from datetime import datetime, timedelta

def create_access_token(data:dict) -> str:
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({'exp': expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt

def create_refresh_token(data:dict) -> str:
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({'exp': expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt
    