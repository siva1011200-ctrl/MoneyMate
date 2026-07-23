import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")

# Also try loading from app directory if parent .env doesn't exist
if not os.getenv("JWT_SECRET_KEY"):
    load_dotenv(Path(__file__).resolve().parent / ".env")


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{(BASE_DIR / 'moneymate.db').as_posix()}",
)


SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY must be set in environment variables")


ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        (
            "http://localhost:5173,"
            "http://127.0.0.1:5173,"
            "https://moneymate-frontend-xd3o.onrender.com"
        ),
    ).split(",")
    if origin.strip()
]


ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "production"
)