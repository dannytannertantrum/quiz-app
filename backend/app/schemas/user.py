from pydantic import BaseModel, EmailStr, Field, UUID4


class UserBase(BaseModel):
    id: UUID4
    email: EmailStr


class UserCreate(BaseModel):
    username: EmailStr
    password: str = Field(default=None, min_length=8)


class UserUpdate(BaseModel):
    current_password: str = Field(default=None, min_length=8)
    email: EmailStr
    new_password: str = Field(default=None, min_length=8)
    confirm_new_password: str = Field(default=None, min_length=8)


class UserInDB(UserBase):
    hashed_password: str


class UserDelete(UserBase):
    message: str
