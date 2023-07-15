from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_users
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.user import UserBase, UserCreate


router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={400: {"description": "User already exists"}},
)


@router.post("/")
def create_user(user_input: UserCreate, db: Session = Depends(get_db)) -> None:
    """
    Create new user.
    """
    user = crud_users.get_user_by_email(db, user_input.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists in the system.",
        )
    crud_users.create_user(db, obj_in=user_input)


@router.get("/me")
def read_users_me(current_user: Annotated[UserBase, Depends(get_current_user)]):
    return current_user
