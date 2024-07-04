from pydantic import BaseModel

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    hashed_password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True