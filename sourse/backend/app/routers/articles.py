from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Article, User
from ..schemas import ArticleCreate, ArticleOut
from ..dependencies import get_current_user
import re

router = APIRouter(prefix="/articles", tags=["Articles"])

def make_slug(title: str) -> str: return re.sub(r'[^\w\s-]', '', title.lower()).strip().replace(' ', '-')

@router.post("/", response_model=ArticleOut, status_code=201)
def create(a: ArticleCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    slug = make_slug(a.title)
    if db.query(Article).filter(Article.slug == slug).first(): slug += f"-{user.id}"
    obj = Article(title=a.title, slug=slug, content=a.content, status="draft", author_id=user.id)
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.get("/", response_model=List[ArticleOut])
def list_articles(status: str = "published", skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(Article).filter(Article.status == status).order_by(Article.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{aid}", response_model=ArticleOut)
def get(aid: int, db: Session = Depends(get_db)):
    a = db.query(Article).filter(Article.id == aid).first()
    if not a: raise HTTPException(404, "Не найдено")
    return a

@router.delete("/{aid}")
def delete(aid: int, db: Session = Depends(get_db), user: User = Depends(lambda: None)): # Упрощено для курсовой
    a = db.query(Article).filter(Article.id == aid).first()
    if not a: raise HTTPException(404, "Не найдено")
    db.delete(a); db.commit()
    return {"msg": "Удалено"}