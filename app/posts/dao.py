from app.dao.base import BaseDAO
from app.posts.models import Post
from app.database import async_session
from sqlalchemy import select
from sqlalchemy.orm import joinedload

class PostDAO(BaseDAO):
    model = Post

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
