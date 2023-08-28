from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import get_settings
from app.crud import crud_users
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.token import Token
from app.schemas.user import UserCurrent
from app.security import create_access_token


settings = get_settings()
db = get_db()

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={401: {"description": "User unauthorized"}},
)


@router.post("/token", response_model=Token)
# OAuth2PasswordRequestForm is a class dependency that declares a form body
# with "username" and "password" and the spec requires us to use those names exactly
def login_for_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    user = crud_users.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    response = JSONResponse({"isAuthorized": True})
    response.set_cookie(
        key="access_token",
        value=access_token,
        secure=False,
        httponly=True,
        samesite="lax",
    )

    return response


@router.post("/sign-out", response_model=Token)
def delete_access_token_cookie(
    response: Response,
    current_user: UserCurrent = Depends(get_current_user),
):
    response = JSONResponse({"isAuthorized": False})
    response.delete_cookie(key="access_token")

    return response
