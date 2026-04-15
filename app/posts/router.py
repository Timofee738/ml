import os
import uuid

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form

from app.posts.dao import PostDAO
from app.users.dao import UserDAO
from app.users.dependencies import get_current_user
from app.users.models import User
from app.likes.dao import LikesDao
from app.posts.schemas import PostResponse, SPost

from app.posts.utils import get_embedding

posts_router = APIRouter(
    prefix='/posts',
    tags=['/posts']
)


@posts_router.post('/create')
async def create_post(
    title: str | None = Form(None),
    content: str = Form(...),
    image: UploadFile = File(None),
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
    
    full_text = f'{title}. {content}'
    vector = await get_embedding(full_text)

    normalized_content = content.strip()
    if not normalized_content:
        raise HTTPException(status_code=400, detail="content cannot be empty")

    generated_title = (normalized_content[:80] + "...") if len(normalized_content) > 80 else normalized_content
    final_title = (title or "").strip() or generated_title

    await PostDAO.add(
        title=final_title,
        user_id=user.id,
        content=normalized_content,
        image_url=image_url,
        embedding=vector,
    )
    
    return {'message': 'Post added'}




@posts_router.get('/recommendations', response_model=list[SPost])
async def get_recommendations(user: User = Depends(get_current_user)):

    user_vector = await UserDAO.get_user_interests_vector(user_id=user.id)

    if user_vector is None:
        return await PostDAO.find_all(limit=10)


    recommendations = await PostDAO.get_recommendations(
        user_id=user.id,
        user_vector=user_vector,
    )

    return recommendations



        
@posts_router.get('/user_posts')
async def get_user_posts(user: User = Depends(get_current_user)):
    posts = await PostDAO.find_smth_from(user_id=user.id)
    end_posts: list[PostResponse] = []
    for post in posts:
        likes_count = await LikesDao.count_likes(post_id=post.id)
        liked_by_me = await LikesDao.liked_by_me(post_id=post.id, user_id=user.id)
        end_post = PostResponse(
            id=post.id,
            user_id=post.user_id,
            title=post.title,
            content=post.content,
            image_url=post.image_url,
            created_at=post.created_at,
            likes_count=likes_count,
            liked_by_me=liked_by_me,
        )
        end_posts.append(end_post)
            
    return end_posts


@posts_router.get('/{post_id}')
async def get_post(post_id: int):
    post = await PostDAO.find_one_with_author(post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail='post not found')
    likes_count = await LikesDao.count_likes(post_id=post.id)
    post_response = PostResponse(
        id=post.id,
        user_id=post.user_id,
        title=post.title,
        content=post.content,
        image_url=post.image_url,
        created_at=post.created_at,
        likes_count=likes_count,
    )
    return post_response

@posts_router.delete('/{post_id}')
async def delete_post(post_id: int, user: User = Depends(get_current_user)):
    existing_post = await PostDAO.find_one_or_none(id=post_id, user_id=user.id)
    if not existing_post:
        raise HTTPException(status_code=404, detail='post not found or access denied')

    await PostDAO.delete(id=post_id, user_id=user.id)
    return {'message': 'post deleted'}


@posts_router.post('/{post_id}/like')
async def like_post(post_id: int, user: User = Depends(get_current_user)):
    post = await PostDAO.find_one_or_none(id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail='post not found')

    existing_like = await LikesDao.liked_by_me(post_id=post_id, user_id=user.id)
    if existing_like:
        likes_count = await LikesDao.count_likes(post_id=post_id)
        return {'message': 'Post already liked', 'liked_by_me': True, 'likes_count': likes_count}
    await LikesDao.like(post_id=post_id, user_id=user.id)
    likes_count = await LikesDao.count_likes(post_id=post_id)
    return {'message': 'Post liked', 'liked_by_me': True, 'likes_count': likes_count}


@posts_router.post('/{post_id}/unlike')
async def unlike_post(post_id: int, user: User = Depends(get_current_user)):
    post = await PostDAO.find_one_or_none(id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail='post not found')

    existing_like = await LikesDao.liked_by_me(post_id=post_id, user_id=user.id)
    if not existing_like:
        likes_count = await LikesDao.count_likes(post_id=post_id)
        return {'message': 'Post not liked', 'liked_by_me': False, 'likes_count': likes_count}

    result = await LikesDao.delete_like(post_id=post_id, user_id=user.id)
    if not result:
        raise HTTPException(status_code=400, detail='like was not deleted')
    likes_count = await LikesDao.count_likes(post_id=post_id)
    return {'message': 'Post unliked', 'liked_by_me': False, 'likes_count': likes_count}



        
