from fastapi import APIRouter, Depends
from app.posts.schemas import PostCreate
from app.posts.dao import PostDAO
from app.users.dependencies import get_current_user
from app.users.models import User



from app.ml.classifier import predict_spam, predict_spam_score

posts_router = APIRouter(
    prefix='/posts',
    tags=['/posts']
)


@posts_router.post('/create')
async def create_post(post_data: PostCreate, user: User = Depends(get_current_user)):


    spam_score = predict_spam_score(post_data.content)
    is_spam = predict_spam(post_data.content)
    
    await PostDAO.add(
        user_id=user.id,
        content=post_data.content,
        image_url=post_data.image_url,
        spam_score=spam_score,
        is_spam=is_spam
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

