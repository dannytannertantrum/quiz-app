# Import all the models, so that Base has them before being imported by Alembic
from app.database import Base
from .question import Question
from .quiz_session import QuizSession
from .quiz_session_questions import QuizSessionQuestions
from .topic import Topic
from .user import User
