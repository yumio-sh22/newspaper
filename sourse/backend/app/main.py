from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, articles

# ❌ НЕ ИМПОРТИРУЕМ и НЕ ВЫЗЫВАЕМ create_all!
# Таблицы уже созданы через Docker init-скрипты

app = FastAPI(title="Newspaper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(articles.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "API работает"}

@app.get("/health")
def health():
    return {"status": "ok"}