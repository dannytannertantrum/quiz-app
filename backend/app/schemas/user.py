from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, UUID4


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(BaseModel):
    username: EmailStr
    password: str = Field(default=None, min_length=8)


class UserUpdate(UserBase):
    current_password: str = Field(default=None, min_length=8)
    new_password: str = Field(default=None, min_length=8)
    confirm_new_password: str = Field(default=None, min_length=8)


class UserInDB(UserBase):
    id: UUID4
    hashed_password: str


class UserCurrent(UserBase):
    id: UUID4
    created_at: datetime


class UserByEmail(UserInDB):
    created_at: datetime


class UserDelete(UserBase):
    message: str
