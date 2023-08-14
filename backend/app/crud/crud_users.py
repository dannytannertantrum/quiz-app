from typing import Optional
from uuid import uuid4

from pydantic import EmailStr, UUID4
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserInDB, UserUpdate
from app.security import get_password_hash, verify_password


def get_user_by_id(
    db: Session, user_id: UUID4, check_for_deleted_users: Optional[bool] = False
) -> UserInDB:
    """
    Returns id, email and hashed password of user or None if no record found
    """
    if check_for_deleted_users:
        return db.execute(
            select(User.id, User.email, User.hashed_password).where(User.id == user_id)
        ).first()
    else:
        return db.execute(
            select(User.id, User.email, User.hashed_password).where(
                User.id == user_id, User.is_deleted == False
            )
        ).first()


def get_user_by_email(db: Session, email: EmailStr) -> UserInDB:
    """
    Returns user id, email and hashed password if user is active or None if no record found
    """
    return db.execute(
        select(User.id, User.email, User.hashed_password).where(
            User.email == email, User.is_deleted == False
        )
    ).first()


def create_user_in_db(db: Session, user_input: UserCreate) -> User:
    """
    Creates and returns a new user record
    """
    new_user_id = uuid4()
    new_user = User(
        id=new_user_id,
        email=user_input.username,
        hashed_password=get_password_hash(user_input.password),
        is_deleted=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def delete_user_in_db(db: Session, user_id: UUID4, is_hard_delete: bool) -> None:
    """
    Performs a record deletion if is_hard_delete is set to true.
    Otherwise, a soft delete is performed where the is_deleted field is updated to True
    Does not return anything
    """
    if is_hard_delete:
        db.execute(delete(User).where(User.id == user_id))
    else:
        db.execute(update(User).where(User.id == user_id).values(is_deleted=True))
    db.commit()


def update_user_in_db(db: Session, user_id: UUID4, user_input: UserUpdate) -> UserInDB:
    """
    For right now, a user on the front-end can only update their password
    Updates and returns a the users id, email and hashed password
    """
    user = get_user_by_id(db, user_id)

    if not verify_password(user_input.current_password, user.hashed_password):
        return False
    if not user_input.new_password == user_input.confirm_new_password:
        return False
    new_hashed_password = get_password_hash(user_input.new_password)

    updated_user_in_db = db.execute(
        update(User)
        .where(User.id == user_id)
        .values(hashed_password=new_hashed_password)
        .returning(User.id, User.email, User.hashed_password)
    ).first()

    db.commit()
    return updated_user_in_db


def authenticate_user(db: Session, email: EmailStr, password: str):
    """
    Verifies a user has the correct password
    """
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
