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
    # ✅ Создаём сразу как published, чтобы статья появлялась в ленте
    obj = Article(title=a.title, slug=slug, content=a.content, status="published", author_id=user.id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("/", response_model=List[ArticleOut])
async def list_articles(status: str = "published", skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    # Если нужно видеть и черновики, фронтенд будет передавать ?status=draft или ?status=all
    if status == "all":
        query = select(Article).order_by(Article.created_at.desc()).offset(skip).limit(limit)
    else:
        query = select(Article).where(Article.status == status).order_by(Article.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{aid}", response_model=ArticleOut)
async def get(aid: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Article).where(Article.id == aid))
    a = result.scalar_one_or_none()
    if not a:
        raise HTTPException(404, "Не найдено")
    return a

# ✅ ИСПРАВЛЕНО: Явно сохраняем статус при обновлении
@router.put("/{aid}", response_model=ArticleOut)
async def update(aid: int, a: ArticleCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Article).where(Article.id == aid))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Статья не найдена")
    
    # Простая проверка прав (автор или админ)
    if obj.author_id != user.id and user.role != "admin":
        raise HTTPException(403, "Нет прав на редактирование")

    print(f"📝 Статья ID {aid}:")
    print(f"  Старый статус: {obj.status}")
    print(f"  Заголовок: {a.title}")
    
    current_status = obj.status

    obj.title = a.title
    obj.slug = make_slug(a.title)
    obj.content = a.content
    obj.status = current_status
    
    print(f"  Новый статус: {obj.status}")
    
    await db.commit()
    await db.refresh(obj)
    return obj

@router.delete("/{aid}")
async def delete(aid: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(Article).where(Article.id == aid))
    a = result.scalar_one_or_none()
    if not a:
        raise HTTPException(404, "Не найдено")
        
    if a.author_id != user.id and user.role != "admin":
        raise HTTPException(403, "Нет прав на удаление")
        
    await db.delete(a)
    await db.commit()
    return {"msg": "Удалено"}