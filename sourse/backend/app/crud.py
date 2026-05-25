from sqlalchemy.orm import Session
from typing import List, Optional, Type, TypeVar
from .models import User, Article, Category

ModelType = TypeVar("ModelType")

class CRUDBase:
    """Базовый класс для CRUD операций"""
    
    def __init__(self, model: Type[ModelType]):
        self.model = model
    
    def get(self, db: Session, id: int) -> Optional[ModelType]:
        """Получить объект по ID"""
        return db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Получить множество объектов с пагинацией"""
        return db.query(self.model).offset(skip).limit(limit).all()
    
    def create(self, db: Session, obj_in: dict) -> ModelType:
        """Создать новый объект"""
        obj_in_db = self.model(**obj_in)
        db.add(obj_in_db)
        db.commit()
        db.refresh(obj_in_db)
        return obj_in_db
    
    def update(self, db: Session, db_obj: ModelType, obj_in: dict) -> ModelType:
        """Обновить существующий объект"""
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def remove(self, db: Session, id: int) -> Optional[ModelType]:
        """Удалить объект по ID"""
        obj = db.query(self.model).filter(self.model.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj


class CRUDUser(CRUDBase):
    """CRUD операции для пользователей"""
    
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Получить пользователя по email"""
        return db.query(User).filter(User.email == email).first()
    
    def create_user(self, db: Session, email: str, password_hash: str, full_name: str, role: str = "reader") -> User:
        """Создать нового пользователя"""
        user = User(
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            role=role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


class CRUDArticle(CRUDBase):
    """CRUD операции для статей"""
    
    def get_by_slug(self, db: Session, slug: str) -> Optional[Article]:
        """Получить статью по slug"""
        return db.query(Article).filter(Article.slug == slug).first()
    
    def get_by_author(self, db: Session, author_id: int, skip: int = 0, limit: int = 100) -> List[Article]:
        """Получить статьи автора"""
        return db.query(Article).filter(
            Article.author_id == author_id
        ).offset(skip).limit(limit).all()
    
    def get_published(self, db: Session, skip: int = 0, limit: int = 100) -> List[Article]:
        """Получить опубликованные статьи"""
        return db.query(Article).filter(
            Article.status == "published"
        ).order_by(Article.published_at.desc()).offset(skip).limit(limit).all()
    
    def create_article(self, db: Session, title: str, content: str, author_id: int, status: str = "draft") -> Article:
        """Создать новую статью"""
        import re
        slug = re.sub(r'[^\w\s-]', '', title.lower()).strip().replace(' ', '-')
        
        # Проверка уникальности slug
        existing = self.get_by_slug(db, slug)
        if existing:
            slug = f"{slug}-{author_id}"
        
        article = Article(
            title=title,
            slug=slug,
            content=content,
            author_id=author_id,
            status=status
        )
        db.add(article)
        db.commit()
        db.refresh(article)
        return article
    
    def publish_article(self, db: Session, article_id: int) -> Optional[Article]:
        """Опубликовать статью"""
        article = self.get(db, article_id)
        if article and article.status == "draft":
            from datetime import datetime
            article.status = "published"
            article.published_at = datetime.utcnow()
            db.commit()
            db.refresh(article)
        return article


class CRUDCategory(CRUDBase):
    """CRUD операции для категорий"""
    
    def get_by_name(self, db: Session, name: str) -> Optional[Category]:
        """Получить категорию по имени"""
        return db.query(Category).filter(Category.name == name).first()


# Экземпляры CRUD классов
crud_user = CRUDUser(User)
crud_article = CRUDArticle(Article)
crud_category = CRUDCategory(Category)