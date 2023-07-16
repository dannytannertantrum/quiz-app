from pydantic import BaseModel, EmailStr, UUID4


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    current_password: str
    new_password: str
    confirm_new_password: str


class UserInDB(BaseModel):
    id: UUID4
    hashed_password: str


class UserCurrent(UserBase):
    id: UUID4


class UserDelete(UserBase):
    message: str
