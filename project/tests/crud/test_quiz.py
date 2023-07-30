from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.crud import crud_quizzes, crud_quiz_questions
from app.models import Question, QuizQuestion, Topic, User
from app.schemas.quiz import QuizId
from app.schemas.quiz_question import QuizQuestionId
from tests.utils.quiz import delete_test_quizzes


random_uuid = uuid4()


class TestCrudQuizNotReturningData:
    def test_get_quiz_by_id_returns_None_if_no_record_found(self, db: Session) -> None:
        quiz = crud_quizzes.get_quiz_by_id(db, quiz_id=random_uuid)

        assert quiz is None

    def test_get_all_quizzes_with_topic_data_by_user_id_returns_empty_list_if_none_found(
        self, db: Session
    ) -> None:
        quizzes = crud_quizzes.get_all_quizzes_with_topic_data_by_user_id(
            db, user_id=random_uuid
        )

        assert quizzes == []

    def test_get_quiz_with_topic_data_by_quiz_id_returns_None_if_no_record_found(
        self, db: Session
    ) -> None:
        quiz = crud_quizzes.get_quiz_with_topic_data_by_quiz_id(db, quiz_id=random_uuid)

        assert quiz is None

    def test_delete_quiz(
        self,
        db: Session,
        generate_test_user: User,
        create_test_quiz: QuizId,
        create_test_quiz_question: list[QuizQuestionId],
    ) -> None:
        quiz_record = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)
        quiz_question_record = crud_quiz_questions.get_quiz_questions_by_quiz_id(
            db, quiz_id=create_test_quiz
        )

        assert quiz_record is not None
        assert quiz_question_record is not None

        crud_quizzes.delete_quiz_in_db(db, quiz_id=create_test_quiz)
        deleted_quiz_record = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)
        deleted_quiz_question_record = (
            crud_quiz_questions.get_quiz_questions_by_quiz_id(
                db, quiz_id=create_test_quiz
            )
        )

        assert deleted_quiz_record is None
        assert deleted_quiz_question_record == []


class TestCrudQuizReturningData:
    def test_get_quiz_by_id(self, db: Session, create_test_quiz: QuizId) -> None:
        result = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)

        assert result is not None
        assert isinstance(result.user_id, UUID)

    def test_create_quiz_in_db(self, db: Session, generate_test_user: User) -> None:
        try:
            result = crud_quizzes.create_quiz_in_db(db, user_id=generate_test_user.id)

            assert result is not None
            assert isinstance(result, UUID)
        finally:
            delete_test_quizzes(db)

    def test_update_quiz_in_db(self, db: Session, create_test_quiz: QuizId) -> None:
        quiz_record = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)

        assert quiz_record.last_modified_at is None
        assert quiz_record.score is None

        crud_quizzes.update_quiz_in_db(
            db,
            quiz_id=create_test_quiz,
            last_modified_at=datetime.now(timezone.utc),
            score=3,
        )

        assert quiz_record.last_modified_at is not None
        assert quiz_record.score == 3

    def test_get_all_quizzes_with_topic_data_by_user_id(
        self,
        db: Session,
        create_test_quiz: QuizId,
        create_test_questions: list[Question],
        create_test_primary_topics: list[Topic],
        create_test_subtopics: list[Topic],
        create_test_quiz_question: list[QuizQuestion],
        generate_test_user: User,
    ):
        quizzes_with_topic_data = (
            crud_quizzes.get_all_quizzes_with_topic_data_by_user_id(
                db, user_id=generate_test_user.id
            )
        )

        assert quizzes_with_topic_data[0].id == create_test_quiz
        assert quizzes_with_topic_data[0].created_at is not None
        assert isinstance(quizzes_with_topic_data[0].subtopics, list)
        assert isinstance(quizzes_with_topic_data[0].primary_topic, str)

    def test_get_quiz_with_topic_data_by_quiz_id(
        self,
        db: Session,
        create_test_quiz: QuizId,
        create_test_questions: list[Question],
        create_test_primary_topics: list[Topic],
        create_test_subtopics: list[Topic],
        create_test_quiz_question: list[QuizQuestion],
    ):
        quiz_with_topic_data = crud_quizzes.get_quiz_with_topic_data_by_quiz_id(
            db, quiz_id=create_test_quiz
        )

        assert quiz_with_topic_data.id == create_test_quiz
        assert quiz_with_topic_data.created_at is not None
        assert isinstance(quiz_with_topic_data.subtopics, list)
        assert isinstance(quiz_with_topic_data.primary_topic, str)
