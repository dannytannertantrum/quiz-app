from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models.quiz import Quiz


def delete_test_quizzes(db: Session) -> None:
    db.execute(delete(Quiz))
    db.commit()
