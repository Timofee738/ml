from app.dao.base import BaseDAO
from app.likes.models import Likes
from app.posts.models import Post
from app.database import async_session
from sqlalchemy import select, insert
from sqlalchemy.orm import joinedload

class PostDAO(BaseDAO):
    model = Post

    @classmethod
    async def add_and_get_id(cls, **data) -> int:
        async with async_session() as session:
            query = insert(cls.model).values(**data).returning(cls.model.id)
            result = await session.execute(query)
            await session.commit()
            return result.scalar_one()

    @classmethod
    async def find_one_with_author(cls, post_id: int):
        async with async_session() as session:
            query = (
                select(cls.model)
                .options(joinedload(cls.model.author))
                .where(cls.model.id == post_id)
            )
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def get_recommendations(cls, user_id: int, user_vector: list[float], limit: int = 10):
        async with async_session() as session:
            liked_posts_query = select(Likes.post_id).where(Likes.user_id == user_id)

            query = (
                select(Post)
                .filter(~Post.id.in_(liked_posts_query), Post.embedding.is_not(None))
                .order_by(Post.embedding.cosine_distance(user_vector).asc())
                .limit(limit)
            )
            result = await session.execute(query)
            return result.scalars().all()
