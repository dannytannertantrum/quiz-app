from uuid import UUID, uuid4

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_questions, crud_quiz_questions
from app.models import Question
from app.schemas.quiz import QuizId
from app.schemas.quiz_question import QuizQuestionId, QuizQuestionUpdateAnswer
from tests.utils import quiz_question


random_uuid = uuid4()


class TestCrudQuizQuestionFailure:
    def test_get_quiz_questions_by_quiz_id_returns_empty_list_if_no_record_found(
        self, db: Session
    ) -> None:
        result = crud_quiz_questions.get_quiz_questions_by_quiz_id(
            db, quiz_id=random_uuid
        )

        assert result == []

    def test_get_question_by_quiz_question_id_returns_None_if_no_record_found(
        self, db: Session
    ) -> None:
        result = crud_quiz_questions.get_question_by_quiz_question_id(
            db, quiz_question_id=random_uuid
        )

        assert result is None

    def test_update_quiz_question_in_db_returns_None_if_no_record_to_update_found(
        self, db: Session
    ) -> None:
        user_input = QuizQuestionUpdateAnswer(user_answer=3)

        result = crud_quiz_questions.update_quiz_question_in_db(
            db, quiz_question_id=random_uuid, user_input=user_input
        )

        assert result is None


class TestCrudQuizQuestionSuccess:
    def test_create_quiz_question_in_db(
        self,
        db: Session,
        create_test_questions: list[Question],
        create_test_quiz: QuizId,
    ) -> None:
        try:
            questions = create_test_questions[:5]
            question_ids: list[UUID4] = list(map(lambda x: x[0], questions))
            result = crud_quiz_questions.create_quiz_question_in_db(
                db, question_ids=question_ids, quiz_id=create_test_quiz
            )

            assert len(result) == 5
        finally:
            quiz_question.delete_test_quiz_questions(db)

    def test_get_quiz_questions_by_quiz_id(
        self,
        db: Session,
        create_test_quiz_question: list[QuizQuestionId],
        create_test_quiz: QuizId,
    ) -> None:
        result = crud_quiz_questions.get_quiz_questions_by_quiz_id(
            db, quiz_id=create_test_quiz
        )

        assert len(result) == 5
        assert isinstance(result[0], UUID)

    def test_get_question_by_quiz_question_id(
        self,
        db: Session,
        create_test_quiz_question: list[QuizQuestionId],
        create_test_quiz: QuizId,
    ) -> None:
        result = crud_quiz_questions.get_question_by_quiz_question_id(
            db, quiz_question_id=create_test_quiz_question[0]
        )
        question = crud_questions.get_question_by_id(db, question_id=result.question_id)

        assert isinstance(result.question_id, UUID)
        assert question is not None

    def test_update_quiz_question_in_db(
        self,
        db: Session,
        create_test_quiz_question: list[QuizQuestionId],
        create_test_quiz: QuizId,
    ) -> None:
        quiz_question_id = create_test_quiz_question[0]
        user_input = QuizQuestionUpdateAnswer(user_answer=3)

        crud_quiz_questions.update_quiz_question_in_db(
            db, quiz_question_id=quiz_question_id, user_input=user_input
        )
        question_info = crud_quiz_questions.get_question_by_quiz_question_id(
            db, quiz_question_id=quiz_question_id
        )

        assert question_info.user_answer == 3
