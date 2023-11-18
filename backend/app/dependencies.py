from typing import Annotated, Optional

from fastapi import Cookie, Depends, HTTPException, Request, status
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import get_settings
from app.crud import crud_users
from app.schemas.token import TokenData
from app.schemas.user import UserCurrent


class OAuth2PasswordBearerWithCookie(OAuth2):
    """
    Post by https://www.fastapitutorial.com/blog/fastapi-jwt-httponly-cookie/

    Taken directly from:
    https://github.com/tiangolo/fastapi/blob/22528373bba6a654323de416ad5c867cbadb81bb/fastapi/security/oauth2.py#L139

    We only change two things: 1. the authorization to use the access_token in an HttpOnly Cookie
    This is safer than localStorage
    2. Removing part of the HTTPException about the WWW-Authenticate header
    """

    def __init__(
        self,
        tokenUrl: str,
        scheme_name: Optional[str] = None,
        scopes: Optional[dict[str, str]] = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.cookies.get("access_token")  # Changed
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                )
            else:
                return None
        return param


settings = get_settings()
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_current_user(
    db: Session = Depends(get_db),
    access_token: Annotated[str | None, Cookie()] = None,
) -> UserCurrent:
    """
    Info on the spec and what is and is not explicitly required:
    https://datatracker.ietf.org/doc/html/rfc6749#section-5.2

    E.g. if we were using the Authorization header and not a cookie, we would
    need the "WWW-Authenticate" response header field matching the authentication scheme used by the client.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
    )
    if not access_token:
        raise credentials_exception
    try:
        payload = jwt.decode(
            access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_email: str = payload.get("sub")
        if user_email is None:
            raise credentials_exception
        token_data = TokenData(email=user_email)
    except JWTError:
        raise credentials_exception
    user = crud_users.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return {"id": user.id, "email": user.email, "created_at": user.created_at}
