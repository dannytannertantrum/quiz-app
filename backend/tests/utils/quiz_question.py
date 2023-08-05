from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.crud.crud_quiz_questions import get_quiz_questions_by_quiz_id
from app.models.quiz_question import QuizQuestion


def create_test_quiz_questions_with_answers(
    db: Session, question_ids: list[UUID4], quiz_id: UUID4
) -> list[QuizQuestion]:
    """
    Creates new QuizQuestion database records with all
    answers filled in and returns them

    The answers in each question record we create for tests are based on
    an index % 4 + 1. We take the last 5 questions to create these records,
    and there are 2 correct answer options with the id of 2. This is better
    than random assignment so we can always test against those values.
    """
    for question_id in question_ids:
        new_quiz_question_id = uuid4()
        new_record = QuizQuestion(
            id=new_quiz_question_id,
            question_id=question_id,
            quiz_id=quiz_id,
            user_answer=2,
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)

    quiz_question_records = get_quiz_questions_by_quiz_id(db, quiz_id)

    return quiz_question_records


def delete_test_quiz_questions(db: Session) -> None:
    db.execute(delete(QuizQuestion))
    db.commit()
