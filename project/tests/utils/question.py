from datetime import datetime
from pydantic import UUID4
from typing import Optional
from uuid import uuid4

from sqlalchemy import delete, insert
from sqlalchemy.orm import Session

from app.models.question import Question
from tests.utils.string_helpers import random_lower_string


def create_test_question(
    db: Session,
    answer_options: list[dict],
    correct_answer: int,
    question: str,
    question_type: str,
    topic_id: UUID4,
    id: Optional[UUID4] = None,
    is_deleted: Optional[bool] = False,
) -> Question:
    if not id:
        id = uuid4()

    result = db.execute(
        insert(Question)
        .values(
            id=id,
            created_at=datetime.utcnow(),
            last_modified_at=None,
            answer_options=answer_options,
            correct_answer=correct_answer,
            is_deleted=is_deleted,
            question=question,
            question_type=question_type,
            topic_id=topic_id,
        )
        .returning(
            Question.id,
            Question.answer_options,
            Question.correct_answer,
            Question.question,
            Question.topic_id,
        )
    )

    db.commit()
    return result.first()


def delete_test_questions(db: Session) -> None:
    db.execute(delete(Question))
    db.commit()


# Dummy data to be used in conftest
random_answer_options = [
    {"id": 1, "option_1": random_lower_string()},
    {"id": 2, "option_2": random_lower_string()},
    {"id": 3, "option_3": random_lower_string()},
    {"id": 4, "option_4": random_lower_string()},
]
