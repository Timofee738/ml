from fastapi import Request, HTTPException, Depends, status
from jose import jwt, JWTError
from app.config import settings
from app.users.dao import UserDAO

async def get_token(request: Request):
    token = request.cookies.get('user_access_token')
    if not token:
        raise HTTPException(status_code=401, detail='Invalid token')
    return token

async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id = payload.get('sub')
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        user = await UserDAO.find_one_or_none(id=int(user_id))
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')