from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = 'users'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    
    username: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(default=False)
    balance: Mapped[float] = mapped_column(default=0.0)
    

    