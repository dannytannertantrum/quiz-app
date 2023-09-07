from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    isAuthorized: bool


class TokenSignIn(Token):
    email: EmailStr
    id: str


class TokenData(BaseModel):
    email: str | None = None
