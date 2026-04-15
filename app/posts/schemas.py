import os

from fastapi import UploadFile, File, Form
from pydantic import BaseModel, Field


class PostCreate(BaseModel):

    title: str
    content: str = Form(..., min_length=1, max_length=5000, description='Post')
    image: UploadFile | None = File(None, description='Upload your image')


class PostResponse(BaseModel):
    id: int

    title: str
    content: str
    image_url: str | None = None
    likes_count: int

    class Config:
        from_attributes = True
