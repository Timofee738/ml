import bcrypt
from app.users.dao import UserDAO

def get_password_hash(password: str) -> str:
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

async def authenticate_user(email, password):
    user = await UserDAO.find_one_or_none(email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

    