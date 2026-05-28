from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, Token
from ..auth import hash_pw, verify_pw, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut)
async def register(u: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == u.email))
    if result.scalar_one_or_none():
        raise HTTPException(400, "Email занят")
    user = User(email=u.email, password_hash=hash_pw(u.password), full_name=u.full_name, role=u.role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(email: str, password: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_pw(password, user.password_hash):
        raise HTTPException(401, "Неверные данные")
    return Token(access_token=create_token({"sub": str(user.id)}), user=UserOut.model_validate(user))