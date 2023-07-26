from uuid import UUID

from sqlalchemy.orm import Session

from app.crud import crud_quizzes
from app.models import User
from tests.utils import quiz


class TestCrudQuizSuccess:
    def test_create_quiz_in_db(self, db: Session, generate_test_user: User) -> None:
        try:
            result = crud_quizzes.create_quiz_in_db(db, user_id=generate_test_user.id)

            assert result is not None
            assert isinstance(result, UUID)
        finally:
            quiz.delete_test_quizzes(db)
