from pydantic import BaseModel, EmailStr, Field


class RegUser(BaseModel):
    
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    
class AuthUser(BaseModel):
    
    email: EmailStr
    password: str = Field(..., min_length=6)