"""
User model for database.
"""
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    """User model."""
    
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    github_id = Column(String, unique=True, nullable=True, index=True)
    google_id = Column(String, unique=True, nullable=True, index=True)
    github_token = Column(String, nullable=True)  # Encrypted
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
