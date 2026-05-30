from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from jose import JWTError, jwt

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, Token
from ..auth import hash_pw, verify_pw, create_token
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=UserOut)
async def register(u: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == u.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email занят")
        
    user = User(
        email=u.email,
        password_hash=hash_pw(u.password),
        full_name=u.full_name,
        role=u.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_pw(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверные данные")
        
    return Token(
        access_token=create_token({"sub": str(user.id)}),
        user=UserOut.model_validate(user)
    )

# ✅ ИСПРАВЛЕНО: добавлено async
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: AsyncSession = Depends(get_db)
):
    try:
        payload = jwt.decode(
            credentials.credentials, 
            settings.JWT_SECRET, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Неверные данные для аутентификации")
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверные данные для аутентификации")
        
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user