import numpy as np
from sqlalchemy import select

from app.dao.base import BaseDAO
from app.database import async_session
from app.likes.models import Likes
from app.posts.models import Post
from app.users.models import User


class UserDAO(BaseDAO):
    model = User

    @classmethod
    async def get_user_interests_vector(cls, user_id: int):
        async with async_session() as session:
            query = (
                select(Post.embedding, Likes.created_at)
                .join(Likes, Post.id == Likes.post_id)
                .filter(Likes.user_id == user_id, Post.embedding.is_not(None))
                .order_by(Likes.created_at.desc())
                .limit(30)
            )
            result = await session.execute(query)
            rows = result.all()
            if not rows:
                return None

            embeddings = [row[0] for row in rows]
            matrix = np.array(embeddings, dtype=float)

            # Recency-weighted profile: newest likes dominate, older likes still contribute.
            decay = 0.35
            weights = np.array([np.exp(-decay * idx) for idx in range(len(rows))], dtype=float)
            weights = weights / weights.sum()
            weighted_vector = np.average(matrix, axis=0, weights=weights)
            return weighted_vector.tolist()
