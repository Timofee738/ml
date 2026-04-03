from app.dao.base import BaseDAO
from app.posts.models import Post

class PostDAO(BaseDAO):
    model = Post
