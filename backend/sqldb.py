from sqlalchemy.orm import sessionmaker
#ORM
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from models import Base

engine = create_engine("sqlite:///music.db", echo=False)

LocalSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db():
    Base.metadata.create_all(engine)
    
#Handles sessions and creates our db