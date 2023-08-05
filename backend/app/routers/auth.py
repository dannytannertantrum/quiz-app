from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import get_settings
from app.crud import crud_users
from app.database import get_db
from app.schemas.token import Token
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
    # Be sure to use these actual JSON keys (it's by spec)
    # It's the only thing we really need to remember on our own - FastAPI handles the rest
    return {"access_token": access_token, "token_type": "bearer"}
