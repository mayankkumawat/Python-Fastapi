from sqlalchemy.orm import Session
from .models.todo import User
from .schemas import UserCreate

def get_user_by_email(db:Session, email:str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(email=user.email, hashed_password=user.hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user