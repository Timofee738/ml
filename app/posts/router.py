from fastapi import APIRouter, Depends, HTTPException
from app.posts.schemas import PostCreate
from app.posts.dao import PostDAO
from app.users.dependencies import get_current_user
from app.users.models import User




posts_router = APIRouter(
    prefix='/posts',
    tags=['/posts']
)


@posts_router.post('/create')
async def create_post(post_data: PostCreate, user: User = Depends(get_current_user)):

    
    await PostDAO.add(
        user_id=user.id,
        content=post_data.content,
        image_url=post_data.image_url
    )
    
    return {'message': 'Post added'}

@posts_router.get('/all')
async def all_post():
    posts = await PostDAO.find_all()
    return posts

@posts_router.get('/user_posts')
async def get_user_posts(user: User = Depends(get_current_user)):
    posts = await PostDAO.find_smth_from(user_id=user.id)
    return posts

@posts_router.post('/delete')
async def delete_post(post_id: int, user: User = Depends(get_current_user)):
    existing_post = PostDAO.find_smth_from(post_id=post_id, user_id=user.id)
    if not existing_post:
        raise HTTPException(status_code=404, detail='Post not found')
    await PostDAO.delete(post_id=post_id, user_id=user.id)
        


