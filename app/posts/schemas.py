import os

from fastapi import UploadFile, File, Form
from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    
    content: str = Form(..., min_length=1, max_length=5000, description='Post')
    image: UploadFile | None = File(None, description='Upload your image')
    