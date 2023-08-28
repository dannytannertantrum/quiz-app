from pydantic import BaseModel


class Token(BaseModel):
    isAuthorized: bool


class TokenData(BaseModel):
    email: str | None = None
