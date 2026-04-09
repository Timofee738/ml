from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint, func
from datetime import datetime

class Likes(Base):
    __tablename__ = 'likes'

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'), ondelete='CASCADE')
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), ondelete='CASCADE')
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', name='uq_likes_user_post'),
    )