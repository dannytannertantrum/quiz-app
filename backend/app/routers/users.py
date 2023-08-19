from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_users
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.user import UserCreate, UserBase, UserDelete, UserInDB, UserUpdate


router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={400: {"description": "User already exists"}},
)


@router.post("/", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
def create_user(user_input: UserCreate, db: Session = Depends(get_db)) -> UserInDB:
    user = crud_users.get_user_by_email(db, user_input.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists in the system.",
        )
    new_user = crud_users.create_user_in_db(db, user_input=user_input)
    return new_user


@router.get("/", response_model=list[UserBase], status_code=status.HTTP_200_OK)
def read_all_users(db: Session = Depends(get_db)) -> list[UserBase]:
    return crud_users.get_all_users(db)


@router.get("/me", response_model=UserBase, status_code=status.HTTP_200_OK)
def read_users_me(
    current_user: Annotated[UserBase, Depends(get_current_user)]
) -> UserBase:
    return current_user


@router.put("/{user_id}", response_model=UserInDB, status_code=status.HTTP_200_OK)
def update_user(
    user_input: UserUpdate,
    user_id: UUID4,
    current_user: Annotated[UserBase, Depends(get_current_user)],
    db: Session = Depends(get_db),
) -> UserInDB:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    successfully_updated_user = crud_users.update_user_in_db(db, user_id, user_input)
    if not successfully_updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There was a problem with the request. Please try again",
        )
    return successfully_updated_user


@router.delete("/{user_id}", response_model=UserDelete, status_code=status.HTTP_200_OK)
def delete_user(
    user_id: UUID4,
    current_user: Annotated[UserBase, Depends(get_current_user)],
    db: Session = Depends(get_db),
    is_hard_delete: Annotated[bool | None, Query()] = None,
) -> UserDelete:
    """
    If no query params are passed in or if "is_hard_delete" query param is false,
    then update the record to have is_deleted=True
    Otherwise, if "is_hard_delete" query param is True, fully delete the user
    """
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    crud_users.delete_user_in_db(db, user_id, is_hard_delete)
    message = (
        f"Account with email {current_user['email']} has been fully dropped from our database records"
        if is_hard_delete
        else f"Account with email {current_user['email']} has been deactivated"
    )
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "message": message,
    }
