# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import MetaData, text
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from app.database import get_db, engine, Base
from .crud import get_user_by_email, create_user
from .schemas import UserCreate, UserResponse
from .models import todo

metadata = MetaData()
todo.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    try:
        result = db.execute(text('SHOW TABLES'))  
        tables = [row[0] for row in result.fetchall()]
        return {"tables": tables}
    except Exception as e:
        return {"error": str(e)}

@app.post("/users",response_model=UserResponse)
def create_user_endpoint(user:UserCreate,db:Session=Depends(get_db)):
    db_user = get_user_by_email(db, email = user.email) 
    if(db_user):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db = db, user = user)
    