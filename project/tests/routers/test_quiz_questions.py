from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.crud import crud_quiz_questions
from app.schemas.quiz_question import QuizQuestionId, QuizQuestionAndAnswers


class TestQuizQuestionRoutesFailure:
    def test_read_quiz_question_by_id_raises_not_found_error_when_question_not_found(
        self, client: TestClient, token_headers: dict[str, str]
    ):
        random_uuid = uuid4()
        response = client.get(f"/quiz-questions/{random_uuid}", headers=token_headers)

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No question associated with quiz question id: {random_uuid}"
        }

    def test_read_quiz_question_by_id_raises_exception_with_bad_request(
        self, client: TestClient, token_headers: dict[str, str]
    ):
        response = client.get("/quiz-questions/not-a-uuid", headers=token_headers)

        assert response.status_code == 422

    def test_update_quiz_question_raises_not_found_error_when_question_not_found(
        self, client: TestClient, token_headers: dict[str, str]
    ):
        random_uuid = uuid4()
        user_input = {"user_answer": 2}

        response = client.put(
            f"/quiz-questions/{random_uuid}", headers=token_headers, json=user_input
        )

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No question associated with quiz question id: {random_uuid}"
        }


class TestQuizQuestionRoutesSuccess:
    def test_get_quiz_question_by_id(
        self,
        client: TestClient,
        token_headers: dict[str, str],
        create_test_quiz_question: list[QuizQuestionId],
    ) -> None:
        response = client.get(
            f"/quiz-questions/{create_test_quiz_question[0]}", headers=token_headers
        )
        data: QuizQuestionAndAnswers = response.json()

        assert response.status_code == 200
        assert isinstance(data["id"], str)
        assert isinstance(data["question"], str)
        assert data["answer_options"] is not None

    def test_update_quiz_question(
        self,
        client: TestClient,
        db: Session,
        token_headers: dict[str, str],
        create_test_quiz_question: list[QuizQuestionId],
    ) -> None:
        quiz_question_id = create_test_quiz_question[0]
        user_input = {"user_answer": 2}

        response = client.put(
            f"/quiz-questions/{quiz_question_id}",
            headers=token_headers,
            json=user_input,
        )
        question_info = crud_quiz_questions.get_question_by_quiz_question_id(
            db, quiz_question_id=quiz_question_id
        )

        assert response.status_code == 204
        assert question_info.user_answer == 2
