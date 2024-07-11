# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import MetaData, text
from sqlalchemy.orm import Session
from app.database import get_db, engine
from .crud import create_item, get_user_by_email, create_user
from .schemas import ItemCreate, ItemResponse, ItemUpdate, UserCreate, UserResponse
from .models import todo
from fastapi.middleware.cors import CORSMiddleware

metadata = MetaData()
todo.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    try:
        result = db.execute(text('SHOW TABLES'))  
        tables = [row[0] for row in result.fetchall()]
        return {"tables": tables}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/users", response_model=list[UserResponse])
def read_all_users(db:Session=Depends(get_db)):
    db_user = db.query(todo.User).all()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users",response_model=UserResponse)
def create_user_endpoint(user:UserCreate,db:Session=Depends(get_db)):
    db_user = get_user_by_email(db, email = user.email) 
    if(db_user):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db = db, user = user)
    
@app.get("/users/{user_id}",response_model= UserResponse)
def read_user(user_id:int, db:Session=Depends(get_db)):
    db_user = db.query(todo.User).filter(todo.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/items", response_model=ItemResponse)
def create_item_endpoint(item: ItemCreate, user_id: int, db: Session = Depends(get_db)):
    if item.title == "": 
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    return create_item(db=db, item=item, user_id=user_id)

@app.get("/items/{user_id}", response_model=list[ItemResponse])
def all_items(user_id:int, db:Session=Depends(get_db)):
    db_items = db.query(todo.Item).filter(todo.Item.owner_id == user_id).all()
    if db_items is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_items

@app.delete("/items/{user_id}/{item_id}")
def delete_item(item_id:int, user_id:int, db:Session=Depends(get_db)):
    db_item = db.query(todo.Item).filter(todo.Item.id == item_id,todo.User.id == user_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item
    
@app.put("/items/{user_id}/{item_id}", response_model=ItemResponse)
def update_item(item_id:int, user_id:int, item: ItemUpdate, db:Session=Depends(get_db)):
    db_item = db.query(todo.Item).filter(todo.Item.id == item_id, todo.User.id == user_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    for key, value in item.model_dump().items():
        setattr(db_item, key, value)

        db.commit()
        db.refresh(db_item)
    return db_item