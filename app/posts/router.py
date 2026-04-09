import os
import uuid

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.posts.dao import PostDAO
from app.users.dependencies import get_current_user
from app.users.models import User
from app.likes.dao import LikesDao




posts_router = APIRouter(
    prefix='/posts',
    tags=['/posts']
)


@posts_router.post('/create')
async def create_post(
    content: str = Form(..., min_length=1, max_length=5000),
    image: UploadFile | None = File(None),
    user: User = Depends(get_current_user),
):
    image_url = None

    if image and image.filename:
        if not image.content_type or not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="file must be an image")

        file_ext = os.path.splitext(image.filename)[1].lower()
        if not file_ext:
            file_ext = ".jpg"

        file_name = f"{uuid.uuid4().hex}{file_ext}"
        upload_dir = os.path.join("media", "posts")
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file_name)

        async with aiofiles.open(file_path, "wb") as out_file:
            content_bytes = await image.read()
            await out_file.write(content_bytes)

        image_url = f"/media/posts/{file_name}"

    await PostDAO.add(
        user_id=user.id,
        content=content,
        image_url=image_url,
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


@posts_router.get('/{post_id}')
async def get_post(post_id: int):
    post = await PostDAO.find_one_with_author(post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail='post not found')
    return post

# @posts_router.delete('/{post_id}')
# async def delete_post(post_id: int, user: User = Depends(get_current_user)):
#     existing_post = await PostDAO.find_one_or_none(id=post_id, user_id=user.id)
#     if not existing_post:
#         raise HTTPException(status_code=404, detail='post not found or access denied')
#
#     await PostDAO.delete(id=post_id, user_id=user.id)
#     return {'message': 'post deleted'}


@posts_router.post('/{post_id}/like')
async def like_post(post_id: int, user: User = Depends(get_current_user)):
    existing_like = await LikesDao.liked_by_me(post_id=post_id, user_id=user.id)
    if existing_like:
        return None
    result = await LikesDao.like(post_id=post_id, user_id=user.id)
    if not result:
        raise HTTPException(status_code=404, detail='post not found')

    return result


@posts_router.post('/{post_id}/unlike')
async def unlike_post(post_id: int, user: User = Depends(get_current_user)):
    existing_like = await LikesDao.liked_by_me(post_id=post_id, user_id=user.id)
    if not existing_like:
        return None

    result = await LikesDao.delete_like(post_id=post_id, user_id=user.id)
    if not result:
        raise HTTPException(status_code=404, detail='post not found')
    return result



        


