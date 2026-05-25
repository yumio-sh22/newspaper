from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="reader")
    created_at = Column(DateTime, default=datetime.utcnow)
    articles = relationship("Article", back_populates="author")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), default="draft")
    author_id = Column(Integer, ForeignKey("users.id"))
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    author = relationship("User", back_populates="articles")
    __table_args__ = (CheckConstraint("status IN ('draft', 'published', 'archived')"),)