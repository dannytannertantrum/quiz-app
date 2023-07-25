from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.quiz_question import QuizQuestion
from app.schemas.quiz_question import QuizQuestionBase


def get_quiz_questions_by_quiz_id(
    db: Session, quiz_id: UUID4
) -> list[QuizQuestionBase]:
    return db.execute(
        select(QuizQuestion.id).where(QuizQuestion.quiz_id == quiz_id)
    ).all()


def create_quiz_question_in_db(
    db: Session, question_ids: list[UUID4], quiz_id: UUID4
) -> list[QuizQuestion]:
    for i in question_ids:
        new_quiz_question_id = uuid4()
        new_record = QuizQuestion(
            id=new_quiz_question_id,
            question_id=i,
            quiz_id=quiz_id,
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)

    quiz_question_ids = get_quiz_questions_by_quiz_id(db, quiz_id)

    return quiz_question_ids
