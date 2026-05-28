from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from ..database import get_db
from ..models import Article, User
from ..schemas import ArticleCreate, ArticleOut
from ..dependencies import get_current_user
import re

router = APIRouter(prefix="/articles", tags=["Articles"])

def make_slug(title: str) -> str:
    return re.sub(r'[^\w\s-]', '', title.lower()).strip().replace(' ', '-')

@router.post("/", response_model=ArticleOut, status_code=201)
async def create(a: ArticleCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    slug = make_slug(a.title)
    result = await db.execute(select(Article).where(Article.slug == slug))
    if result.scalar_one_or_none():
        slug += f"-{user.id}"
    obj = Article(title=a.title, slug=slug, content=a.content, status="draft", author_id=user.id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/", response_model=List[ArticleOut])
async def list_articles(status: str = "published", skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Article).where(Article.status == status).order_by(Article.created_at.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()

@router.get("/{aid}", response_model=ArticleOut)
async def get(aid: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == aid))
    a = result.scalar_one_or_none()
    if not a:
        raise HTTPException(404, "Не найдено")
    return a

@router.delete("/{aid}")
async def delete(aid: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == aid))
    a = result.scalar_one_or_none()
    if not a:
        raise HTTPException(404, "Не найдено")
    await db.delete(a)
    await db.commit()
    return {"msg": "Удалено"}