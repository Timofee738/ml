from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Text, String, func
from typing import Optional, TYPE_CHECKING
from datetime import datetime


if TYPE_CHECKING:
    from app.users.models import User

class Post(Base):
    __tablename__ = 'posts'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    
    author: Mapped['User'] = relationship(back_populates='posts')
    
    