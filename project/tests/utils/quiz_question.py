from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models.quiz_question import QuizQuestion


def delete_test_quiz_questions(db: Session) -> None:
    db.execute(delete(QuizQuestion))
    db.commit()
