# Import all the models, so that Base has them before being imported by Alembic
from app.database import Base
from .question import Question
from .topic import Topic
from .user import User
