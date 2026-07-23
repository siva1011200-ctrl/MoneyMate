from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings



# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)



def hash_password(password: str):

    return pwd_context.hash(password)



def verify_password(
    password: str,
    hashed_password: str
):

    return pwd_context.verify(
        password,
        hashed_password
    )



# Create Access Token

def create_access_token(data: dict):

    payload = data.copy()


    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )


    payload.update(
        {
            "exp": expire,
            "type": "access"
        }
    )


    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )



# Create Refresh Token

def create_refresh_token(data: dict):

    payload = data.copy()


    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )


    payload.update(
        {
            "exp": expire,
            "type": "refresh"
        }
    )


    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )



# Decode Token (NEW)

def decode_token(token: str):

    try:

        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[
                settings.JWT_ALGORITHM
            ]
        )


        return payload


    except JWTError:

        return None