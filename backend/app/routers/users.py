from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth import create_access_token, hash_password, verify_password
from ..database import get_db
from ..dependencies import get_current_user, serialize_user
from ..models import User
from ..schemas import (
    LoginResponse,
    PasswordChange,
    RegisterResponse,
    SettingsResponse,
    SettingsUpdate,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from ..services.notifications import create_notification

router = APIRouter(prefix="/users", tags=["Users"])


def _to_user_response(user: User) -> UserResponse:
    return UserResponse(**serialize_user(user))


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name.strip(),
        email=user.email.lower(),
        password=hash_password(user.password),
        user_type=user.type,
    )

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered") from exc
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration failed") from exc

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})

    return RegisterResponse(
        message="User registered successfully",
        access_token=token,
        user=_to_user_response(new_user),
    )


@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email.lower()).first()

    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(existing_user.id), "email": existing_user.email})

    return LoginResponse(
        access_token=token,
        user=_to_user_response(existing_user),
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return _to_user_response(current_user)


@router.put("/me", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.name is not None:
        current_user.name = payload.name.strip()

    if payload.email is not None:
        email = payload.email.lower()
        duplicate = (
            db.query(User)
            .filter(User.email == email, User.id != current_user.id)
            .first()
        )
        if duplicate:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = email

    if payload.type is not None:
        current_user.user_type = payload.type

    try:
        db.commit()
        db.refresh(current_user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already in use") from exc

    return _to_user_response(current_user)


@router.post("/change-password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.password = hash_password(payload.new_password)
    db.commit()

    create_notification(
        db,
        current_user,
        title="Password Updated",
        message="Your account password was changed successfully.",
        notification_type="security",
    )
    db.commit()

    return {"message": "Password updated successfully"}


@router.get("/settings", response_model=SettingsResponse)
def get_settings(current_user: User = Depends(get_current_user)):
    return SettingsResponse(
        dark_mode=current_user.dark_mode,
        email_notifications=current_user.email_notifications,
    )


@router.put("/settings", response_model=SettingsResponse)
def update_settings(
    payload: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.dark_mode is not None:
        current_user.dark_mode = payload.dark_mode
    if payload.email_notifications is not None:
        current_user.email_notifications = payload.email_notifications

    db.commit()
    db.refresh(current_user)

    return SettingsResponse(
        dark_mode=current_user.dark_mode,
        email_notifications=current_user.email_notifications,
    )
