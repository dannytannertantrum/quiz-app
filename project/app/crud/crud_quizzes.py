from uuid import uuid4

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.models.quiz import Quiz
from app.schemas.quiz import QuizId


def create_quiz_in_db(db: Session, user_id: UUID4) -> QuizId:
    new_quiz_id = uuid4()
    new_quiz = Quiz(id=new_quiz_id, user_id=user_id)

    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return new_quiz_id
