from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "reader"

class UserOut(BaseModel):
    id: int; email: str; full_name: str; role: str
    class Config: from_attributes = True

class ArticleCreate(BaseModel):
    title: str
    content: str

class ArticleOut(BaseModel):
    id: int; title: str; slug: str; content: str; status: str
    author_id: int; published_at: Optional[datetime]
    created_at: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str; token_type: str = "bearer"; user: UserOut