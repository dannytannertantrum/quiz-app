from uuid import uuid4

from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserInDB
from app.security import get_password_hash, verify_password


def get_user_by_email(db: Session, email: EmailStr) -> UserInDB:
    """
    Returns user email and hashed password if user is active
    """
    return db.execute(
        select(User.email, User.hashed_password).filter(
            User.email == email, User.is_deleted == False
        )
    ).first()


def create_user(db: Session, obj_in: UserCreate) -> User:
    new_user_id = uuid4()
    new_user = User(
        id=new_user_id,
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        is_deleted=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, email: EmailStr, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
