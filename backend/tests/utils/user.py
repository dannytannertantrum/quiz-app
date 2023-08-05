from pydantic import EmailStr, UUID4
from typing import Optional
from uuid import uuid4

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models.user import User
from app.security import get_password_hash


def create_test_user(
    db: Session,
    email: EmailStr,
    password: str,
    id: Optional[UUID4] = None,
    is_deleted: Optional[bool] = False,
) -> User:
    if not id:
        id = uuid4()

    hashed_password = get_password_hash(password)

    new_user = User(
        id=id,
        email=email,
        hashed_password=hashed_password,
        is_deleted=is_deleted,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def delete_test_users(db: Session) -> None:
    db.execute(delete(User))
    db.commit()
