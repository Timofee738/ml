from app.dao.base import BaseDAO
from app.likes.models import Likes
from app.database import async_session
from sqlalchemy import select, insert, delete, func

class LikesDao(BaseDAO):
    model = Likes

    @classmethod
    async def find_like(cls, post_id: int, user_id: int):
        async with async_session() as session:
            query = select(Likes).where(Likes.post_id == post_id, Likes.user_id == user_id)
            result = await session.execute(query)
            return result.scalars().first()

    @classmethod
    async def like(cls, post_id: int, user_id: int):
        async with async_session() as session:
            query = insert(Likes).values(Likes.post_id == post_id, Likes.user_id == user_id)
            await session.execute(query)
            await session.commit()

    @classmethod
    async def delete_like(cls, post_id: int, user_id: int):
        async with async_session() as session:
            query = delete(Likes).filter_by(Likes.post_id == post_id, Likes.user_id == user_id)
            await session.execute(query)
            await session.commit()

    @classmethod
    async def count_likes(cls, post_id: int) -> int:
        async with async_session() as session:
            query = select(func.count(Likes.id)).where(Likes.post_id == post_id)
            result = await session.execute(query)
            return int(result.scalar() or 0)

    @classmethod
    async def liked_by_me(cls, user_id: int, post_id: int):
        async with async_session() as session:
            query = select(Likes.id).where(
                Likes.user_id == user_id,
                Likes.post_id == post_id,
            )
            result = await session.execute(query)
            return result.scalar_one_or_none() is not None