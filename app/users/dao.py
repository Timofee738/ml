import numpy as np
from sqlalchemy import select, and_
from app.dao.base import BaseDAO
from app.database import async_session
from app.posts.models import Post
from app.likes.models import Likes
from app.users.models import User

class UserDAO(BaseDAO):
    model = User

    @classmethod
    async def get_user_interests_vector(cls, user_id: int):
        try:
            async with async_session() as session:
                query = (
                    select(Post.embedding)
                    .join(Likes, Post.id == Likes.post_id)
                    .filter(Likes.user_id == user_id)
                )
                result = await session.execute(query)
                embeddings = result.scalars().all()
                if not embeddings or len(embeddings) == 0:
                    return None
                # 2. Усредняем векторы
                # Каждый эмбеддинг — это list[float], numpy превратит их в матрицу
                matrix = np.array(embeddings)
                mean_vector = np.mean(matrix, axis=0)
                return mean_vector.tolist()
        except Exception as e:
            return None
