from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Только ASCII символы!
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "newspaper_user"
    DB_PASSWORD: str = "test123"
    DB_NAME: str = "newspaper_db"
    JWT_SECRET: str = "supersecretjwtkey32charslong"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Возвращаем параметры подключения как dict (не URL!)
    @property
    def DB_PARAMS(self) -> dict:
        return {
            "host": self.DB_HOST,
            "port": self.DB_PORT,
            "user": self.DB_USER,
            "password": self.DB_PASSWORD,
            "dbname": self.DB_NAME,
            "options": "-c client_encoding=UTF8",
            "sslmode": "disable",
        }

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()