from uuid import uuid4

from sqlalchemy.orm import Session

from app.crud import crud_questions
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.string_helpers import random_lower_string


class TestCrudQuestionNotReturningData:
    def test_read_questions_via_random_topic_id_returns_no_error(
        self, db: Session
    ) -> None:
        random_uuid = uuid4()
        result = crud_questions.get_questions_by_topic_id(db, random_uuid)

        assert result == []
        assert len(result) == 0

    def test_read_questions_marked_is_deleted_return_no_results(
        self, db: Session, create_test_topics
    ) -> None:
        horror_subtopic = create_test_topics[2]
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=2,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=horror_subtopic.id,
            is_deleted=True,
        )

        try:
            result = crud_questions.get_questions_by_topic_id(db, horror_subtopic.id)
            assert result == []
        finally:
            delete_test_questions(db)

    def test_read_questions_with_primary_topic_marked_is_deleted_return_no_results(
        self, db: Session, create_test_topics
    ) -> None:
        # This subtopic has a primary topic marked is_deleted=True
        subtopic_music = create_test_topics[7]
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=4,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=subtopic_music.id,
            is_deleted=False,
        )

        try:
            result = crud_questions.get_questions_by_topic_id(db, subtopic_music.id)
            assert result == []
        finally:
            delete_test_questions(db)

    def test_read_questions_with_subtopic_marked_is_deleted_return_no_results(
        self, db: Session, create_test_topics
    ) -> None:
        deleted_subtopic = create_test_topics[8]
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=4,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=deleted_subtopic.id,
            is_deleted=False,
        )

        try:
            result = crud_questions.get_questions_by_topic_id(db, deleted_subtopic.id)
            assert result == []
        finally:
            delete_test_questions(db)
