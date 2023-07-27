from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.quiz import Quiz
from app.schemas.quiz import QuizId


def get_quiz_by_id(db: Session, quiz_id: UUID4) -> Quiz:
    """
    Returns a full Quiz record or None if no record found
    """
    return db.execute(select(Quiz).where(Quiz.id == quiz_id)).scalars().first()


def create_quiz_in_db(db: Session, user_id: UUID4) -> QuizId:
    """
    Creates a new Quiz record in the database and returns its id
    """
    new_quiz_id = uuid4()
    new_quiz = Quiz(id=new_quiz_id, user_id=user_id)

    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return new_quiz_id
