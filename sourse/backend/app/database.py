from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔥 Жестко прописанные параметры (только ASCII!)
DATABASE_URL = "postgresql://newspaper_user:simple123@127.0.0.1:5432/newspaper_db"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True для отладки
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        