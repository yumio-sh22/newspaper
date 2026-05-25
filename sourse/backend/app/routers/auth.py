from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserOut, Token
from ..auth import hash_pw, verify_pw, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut)
def register(u: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == u.email).first():
        raise HTTPException(400, "Email занят")
    user = User(email=u.email, password_hash=hash_pw(u.password), full_name=u.full_name, role=u.role)
    db.add(user); db.commit(); db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_pw(password, user.password_hash):
        raise HTTPException(401, "Неверные данные")
    return Token(access_token=create_token({"sub": user.id}), user=UserOut.model_validate(user))