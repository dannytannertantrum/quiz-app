from uuid import UUID

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_quiz_questions
from app.models import Question
from app.schemas.quiz import QuizId
from app.schemas.quiz_question import QuizQuestionId
from tests.utils import quiz_question


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
        first_id = result[0][0]

        assert len(result) == 5
        assert isinstance(first_id, UUID)
