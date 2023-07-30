from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.models.quiz_question import QuizQuestion
from app.schemas.quiz_question import QuizQuestionUpdateAnswerRequest


def get_quiz_questions_by_quiz_id(db: Session, quiz_id: UUID4) -> list[QuizQuestion]:
    """
    Returns a list of Quiz Question records or an empty list if none found
    """
    return (
        db.execute(select(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id))
        .scalars()
        .all()
    )


def get_question_by_quiz_question_id(
    db: Session, quiz_question_id: UUID4
) -> QuizQuestion:
    """
    Returns the question id and user answer or None if no record found
    """
    return db.execute(
        select(QuizQuestion.question_id, QuizQuestion.user_answer).where(
            QuizQuestion.id == quiz_question_id
        )
    ).first()


def create_quiz_question_in_db(
    db: Session, question_ids: list[UUID4], quiz_id: UUID4
) -> list[QuizQuestion]:
    """
    Creates new QuizQuestion database records and returns them
    """
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

    quiz_question_records = get_quiz_questions_by_quiz_id(db, quiz_id)

    return quiz_question_records


def update_quiz_question_in_db(
    db: Session, user_input: QuizQuestionUpdateAnswerRequest, quiz_question_id: UUID4
) -> QuizQuestion:
    """
    Returns the question id, quiz_id and user answer or None if no record found
    """
    updated_quiz_question_record = db.execute(
        update(QuizQuestion)
        .where(QuizQuestion.id == quiz_question_id)
        .values(user_answer=user_input.user_answer)
        .returning(QuizQuestion.id, QuizQuestion.user_answer, QuizQuestion.quiz_id)
    ).first()

    db.commit()

    return updated_quiz_question_record
