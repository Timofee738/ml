from pydantic import BaseModel, Field


class PostCreate(BaseModel):
    
    content: str = Field(..., min_length=1, max_length=5000, description='Post')
    image_url: str | None = Field(None, description='Image')
    