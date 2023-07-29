from datetime import datetime
from typing import Optional
from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import select, update
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


def update_quiz_in_db(
    db: Session,
    quiz_id: UUID4,
    last_modified_at: datetime,
    completed_at: Optional[datetime] = None,
    score: Optional[int] = None,
):
    """
    Updates a Quiz record in the following scenarios:
    1. Every time a user submits an answer on a quiz, a quiz question
    record is updated and therefore, we need to update last_modified_at
    2. When the user submits the last question, a score is calculated and
    last_modified_at, completed_at and score get upserted
    """
    quiz_model: Quiz = (
        db.execute(select(Quiz).where(Quiz.id == quiz_id)).scalars().first()
    )
    quiz_model.last_modified_at = last_modified_at
    quiz_model.completed_at = completed_at
    quiz_model.score = score

    db.add(quiz_model)
    db.commit()
    db.refresh(quiz_model)

    return quiz_model
