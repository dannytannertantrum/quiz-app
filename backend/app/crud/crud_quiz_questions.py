from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import QuizQuestion, Question
from app.schemas.quiz_question import (
    QuizQuestionUpdateAnswerRequest,
    QuizQuestionAllData,
)


def get_quiz_questions_by_quiz_id(db: Session, quiz_id: UUID4) -> list[QuizQuestion]:
    """
    Returns a list of Quiz Question records or an empty list if none found
    """
    return (
        db.execute(select(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id))
        .scalars()
        .all()
    )


def get_all_quiz_questions_by_quiz_id(
    db: Session, quiz_id: UUID4
) -> list[QuizQuestionAllData]:
    """
    Returns a list of Quiz Question records complete with each question and answer option
    """

    rows = db.execute(
        select(
            QuizQuestion.id,
            QuizQuestion.quiz_id,
            QuizQuestion.user_answer,
            QuizQuestion.question_id,
            Question.question,
            Question.answer_options,
            Question.question_type,
        )
        .join(Question, QuizQuestion.question_id == Question.id)
        .where(
            QuizQuestion.quiz_id == quiz_id,
            Question.is_deleted == False,
        )
    ).all()

    data = [row._asdict() for row in rows]

    return data


def get_question_and_user_answer_by_quiz_question_id(
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
    Returns a Quiz Question record or None if no record found
    """
    quiz_question_model: QuizQuestion = (
        db.execute(select(QuizQuestion).where(QuizQuestion.id == quiz_question_id))
        .scalars()
        .first()
    )

    if not quiz_question_model:
        return None

    quiz_question_model.user_answer = user_input.user_answer

    db.add(quiz_question_model)
    db.commit()
    db.refresh(quiz_question_model)

    return quiz_question_model
