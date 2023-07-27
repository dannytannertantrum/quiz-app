from uuid import UUID, uuid4

from sqlalchemy.orm import Session

from app.crud import crud_quizzes
from app.models import User
from app.schemas.quiz import QuizId
from tests.utils import quiz


class TestCrudQuizFailure:
    def test_get_quiz_by_id_returns_None_if_no_record_found(self, db: Session) -> None:
        result = crud_quizzes.get_quiz_by_id(db, quiz_id=uuid4())

        assert result is None


class TestCrudQuizSuccess:
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
            quiz.delete_test_quizzes(db)
