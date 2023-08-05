from uuid import uuid4

from sqlalchemy.orm import Session

from app.config import Settings
from app.crud import crud_questions
from app.models import Question, Topic
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.kitchen_sink import random_lower_string


class TestCrudQuestionNotReturningData:
    def test_get_questions_returns_empty_list_when_no_questions_exist(
        self, db: Session
    ) -> None:
        result = crud_questions.get_questions(db)

        assert result == []

    def test_get_question_by_id_returns_None_when_no_questions_exist(
        self, db: Session
    ) -> None:
        result = crud_questions.get_question_by_id(db, question_id=uuid4())

        assert result is None

    def test_get_questions_with_question_marked_is_deleted_returns_no_results(
        self, app_config: Settings, db: Session, create_test_subtopics: list[Topic]
    ) -> None:
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=2,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=app_config.TEST_SUBTOPIC_HORROR_UUID,
            is_deleted=True,
        )

        try:
            result = crud_questions.get_questions_by_subtopic_ids(
                db, [app_config.TEST_SUBTOPIC_HORROR_UUID]
            )
            assert result == []
        finally:
            delete_test_questions(db)

    def test_get_questions_via_subtopic_with_parent_primary_topic_marked_is_deleted_returns_no_results(
        self,
        db: Session,
        create_test_subtopic_with_deleted_parent_topic: Topic,
    ) -> None:
        # This subtopic has a primary topic marked is_deleted=True
        subtopic_with_deleted_parent = create_test_subtopic_with_deleted_parent_topic
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=4,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=subtopic_with_deleted_parent.id,
            is_deleted=False,
        )

        try:
            result = crud_questions.get_questions_by_subtopic_ids(
                db, [subtopic_with_deleted_parent.id]
            )
            assert result == []
        finally:
            delete_test_questions(db)

    def test_get_questions_via_subtopic_marked_is_deleted_returns_no_results(
        self, db: Session, create_deleted_test_subtopic
    ) -> None:
        deleted_subtopic = create_deleted_test_subtopic
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
            result = crud_questions.get_questions_by_subtopic_ids(
                db, [deleted_subtopic.id]
            )
            assert result == []
        finally:
            delete_test_questions(db)


class TestCrudQuestionReturningData:
    def test_get_all_questions(
        self, db: Session, create_test_questions: list[Question]
    ) -> None:
        result: list[Question] = crud_questions.get_questions(db)

        assert len(result) == len(create_test_questions)

        assert result[0].id is not None
        assert result[0].answer_options is not None
        assert isinstance(result[0].correct_answer, int)
        assert isinstance(result[0].question, str)
        assert result[0].question_type == "multiple choice"
        assert result[0].topic_id is not None

    def test_get_questions_by_id(
        self, db: Session, create_test_questions: list[Question]
    ) -> None:
        question: Question = create_test_questions[0]
        result: Question = crud_questions.get_question_by_id(db, question.id)

        assert result.id is not None
        assert result.answer_options is not None
        assert isinstance(result.correct_answer, int)
        assert isinstance(result.question, str)
        assert result.question_type == "multiple choice"
        assert result.topic_id is not None

    def test_get_questions_by_primary_topic_id(
        self,
        app_config: Settings,
        db: Session,
        create_test_primary_topics: list[Topic],
        create_test_subtopics: list[Topic],
        create_test_questions: list[Question],
    ) -> None:
        result: list[Question] = crud_questions.get_questions_by_primary_topic_id(
            db, app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID
        )

        assert len(result) > 0
        assert result[0].topic_id is not None
        assert isinstance(result[0].question, str)
        assert isinstance(result[0].answer_options, list)
        assert isinstance(result[0].correct_answer, int)

    def test_get_questions_by_list_of_subtopic_ids(
        self,
        app_config: Settings,
        db: Session,
        create_test_questions: list[Question],
        create_test_subtopics: list[Topic],
    ) -> None:
        result: list[Question] = crud_questions.get_questions_by_subtopic_ids(
            db,
            [app_config.TEST_SUBTOPIC_DRAMA_UUID, app_config.TEST_SUBTOPIC_COMEDY_UUID],
        )

        assert len(result) > 1
        assert result[0].topic_id in [
            app_config.TEST_SUBTOPIC_DRAMA_UUID,
            app_config.TEST_SUBTOPIC_COMEDY_UUID,
        ]
        assert result[1].topic_id in [
            app_config.TEST_SUBTOPIC_DRAMA_UUID,
            app_config.TEST_SUBTOPIC_COMEDY_UUID,
        ]
        assert result[2].topic_id in [
            app_config.TEST_SUBTOPIC_DRAMA_UUID,
            app_config.TEST_SUBTOPIC_COMEDY_UUID,
        ]
        assert isinstance(result[0].question, str)
        assert isinstance(result[0].answer_options, list)
        assert isinstance(result[0].correct_answer, int)
