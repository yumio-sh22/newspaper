from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .auth import decode_token

def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id: raise ValueError
    except: raise HTTPException(status_code=401, detail="Неверный токен")
    user = db.query(User).filter(User.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user