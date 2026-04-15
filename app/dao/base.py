from app.database import async_session
from sqlalchemy import insert, select, update, delete
from sqlalchemy.orm import joinedload

class BaseDAO:
    model = None
    
    @classmethod
    async def find_one_or_none(cls, **filter_by):
        async with async_session() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().one_or_none()
        
        
    @classmethod
    async def find_all(cls, limit: int = 20):
        async with async_session() as session:
            query = (select(cls.model).options(joinedload(cls.model.author)).order_by(cls.model.created_at.desc()).limit(limit))
            
            result = await session.execute(query)
            return result.scalars().all()
            
            
    @classmethod
    async def add(cls, **data):
        async with async_session() as session:
            query = insert(cls.model).values(**data)
            await session.execute(query)
            await session.commit()
            
            
    @classmethod
    async def update(cls, model_id: int, **data):
        if not data:
            return None
            
        async with async_session() as session:
            query = (
                update(cls.model)
                .where(cls.model.id == model_id)
                .values(**data)
            )
            await session.execute(query)
            await session.commit()
            
            
    @classmethod
    async def delete(cls, **filter_by):
        async with async_session() as session:
            query = delete(cls.model).filter_by(**filter_by)
            await session.execute(query)
            await session.commit()
            
    @classmethod
    async def find_smth_from(cls, **filter_by):
        async with async_session() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().all()