from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pw(pw: str) -> str: return pwd_ctx.hash(pw)
def verify_pw(plain: str, hashed: str) -> bool: return pwd_ctx.verify(plain, hashed)

def create_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])