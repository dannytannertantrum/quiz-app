from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.crud import crud_quizzes, crud_quiz_questions
from app.models import QuizQuestion
from app.schemas.quiz import QuizId
from app.schemas.quiz_question import QuizQuestionAndAnswers


class TestQuizQuestionRoutesFailure:
    def test_read_quiz_question_by_id_raises_not_found_error_when_question_not_found(
        self, client: TestClient, access_token: dict[str, str]
    ):
        random_uuid = uuid4()
        response = client.get(f"/quiz-questions/{random_uuid}", headers=access_token)

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No question associated with quiz question id: {random_uuid}"
        }

    def test_read_quiz_question_by_id_raises_exception_with_bad_request(
        self, client: TestClient, access_token: dict[str, str]
    ):
        response = client.get("/quiz-questions/not-a-uuid", headers=access_token)

        assert response.status_code == 422

    def test_update_quiz_question_raises_not_found_error_when_question_not_found(
        self, client: TestClient, access_token: dict[str, str]
    ):
        random_uuid = uuid4()
        user_input = {"user_answer": 2}

        response = client.put(
            f"/quiz-questions/{random_uuid}", headers=access_token, json=user_input
        )

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No question associated with quiz question id: {random_uuid}"
        }

    def test_update_quiz_question_raises_exception_when_answer_id_greater_than_4(
        self,
        client: TestClient,
        access_token: dict[str, str],
        create_test_quiz_questions: list[QuizQuestion],
    ):
        quiz_question_id = create_test_quiz_questions[0].id
        user_input = {"user_answer": 5}

        response = client.put(
            f"/quiz-questions/{quiz_question_id}",
            headers=access_token,
            json=user_input,
        )

        assert response.status_code == 422


class TestQuizQuestionRoutesSuccess:
    def test_get_quiz_question_by_id(
        self,
        client: TestClient,
        access_token: dict[str, str],
        create_test_quiz_questions: list[QuizQuestion],
    ) -> None:
        response = client.get(
            f"/quiz-questions/{create_test_quiz_questions[0].id}", headers=access_token
        )
        data: QuizQuestionAndAnswers = response.json()

        assert response.status_code == 200
        assert isinstance(data["id"], str)
        assert isinstance(data["question"], str)
        assert data["answer_options"] is not None

    def test_update_quiz_question_with_empty_answers(
        self,
        client: TestClient,
        db: Session,
        access_token: dict[str, str],
        create_test_quiz: QuizId,
        create_test_quiz_questions: list[QuizQuestion],
    ) -> None:
        quiz_question_id = create_test_quiz_questions[0].id
        user_input = {"user_answer": 2}

        response = client.put(
            f"/quiz-questions/{quiz_question_id}",
            headers=access_token,
            json=user_input,
        )
        question_info = (
            crud_quiz_questions.get_question_and_user_answer_by_quiz_question_id(
                db, quiz_question_id=quiz_question_id
            )
        )
        quiz = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)

        assert response.status_code == 204
        assert question_info.user_answer == 2

        # Make sure the Quiz record also got updated
        assert quiz.last_modified_at is not None
        assert quiz.completed_at is None
        assert quiz.score is None

    def test_update_quiz_question_with_all_answers_submitted(
        self,
        client: TestClient,
        db: Session,
        access_token: dict[str, str],
        create_test_quiz_for_qq_with_all_answers: QuizId,
        create_test_quiz_questions_with_all_answers: list[QuizQuestion],
    ) -> None:
        quiz_question_id = create_test_quiz_questions_with_all_answers[0].id
        user_input = {"user_answer": 2}

        response = client.put(
            f"/quiz-questions/{quiz_question_id}",
            headers=access_token,
            json=user_input,
        )
        question_info = (
            crud_quiz_questions.get_question_and_user_answer_by_quiz_question_id(
                db, quiz_question_id=quiz_question_id
            )
        )
        quiz = crud_quizzes.get_quiz_by_id(
            db, quiz_id=create_test_quiz_for_qq_with_all_answers
        )

        assert response.status_code == 204
        assert question_info.user_answer == 2

        # Make sure the Quiz record also got updated
        assert quiz.last_modified_at is not None
        assert quiz.completed_at is not None
        assert isinstance(quiz.score, int)
        assert quiz.score == 40  # Kinda brittle
