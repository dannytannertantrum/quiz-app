import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")


engine = create_engine(SQLALCHEMY_DATABASE_URL)

# We name it SessionLocal to distinguish it from the Session we are importing from SQLAlchemy.
# Each instance of the SessionLocal class will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
