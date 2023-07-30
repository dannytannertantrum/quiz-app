from uuid import uuid4

from fastapi.responses import Response
from fastapi.testclient import TestClient
import pytest
from sqlalchemy.orm import Session

from app.crud import crud_quizzes, crud_quiz_questions
from app.models import Question, QuizQuestion, Topic, User
from app.schemas.quiz import QuizId, QuizWithTopicData
from tests.utils import kitchen_sink, question, quiz


@pytest.fixture(scope="function")
def create_quiz_api_response(
    db: Session,
    client: TestClient,
    token_headers: dict[str, str],
    create_test_subtopics: list[Topic],
    create_test_questions: list[Question],
) -> Response:
    user_input = {
        "selected_topics": [
            str(create_test_subtopics[0].id),
            str(create_test_subtopics[1].id),
            str(create_test_subtopics[2].id),
        ]
    }
    response = client.post("/quizzes/", headers=token_headers, json=user_input)

    yield response
    quiz.delete_test_quizzes(db)


class TestQuizRoutesFailure:
    def test_create_quiz_bad_user_input_raises_exception(
        self, client: TestClient, token_headers: dict[str, str]
    ) -> None:
        user_input = {"selected_topics": ["not-a-uuid"]}
        response = client.post("/quizzes/", headers=token_headers, json=user_input)

        assert response.status_code == 422

    def test_create_quiz_with_not_enough_questions_raises_exception(
        self,
        db: Session,
        client: TestClient,
        token_headers: dict[str, str],
        create_test_subtopics: list[Topic],
    ) -> None:
        try:
            question.create_test_question(
                db,
                answer_options=question.random_answer_options,
                correct_answer=2,
                question=kitchen_sink.random_lower_string(),
                question_type="multiple choice",
                topic_id=create_test_subtopics[0].id,
            )
            user_input = {"selected_topics": [str(create_test_subtopics[0].id)]}

            response = client.post("/quizzes/", headers=token_headers, json=user_input)

            assert response.status_code == 400
            assert response.json() == {"detail": "Not enough questions found"}
        finally:
            question.delete_test_questions(db)

    def test_read_all_quizzes_with_topic_data_by_user_id_raises_exception_if_user_not_found(
        self, client: TestClient, token_headers: dict[str, str]
    ) -> None:
        response = client.get("/quizzes/user/me", headers=token_headers)

        assert response.status_code == 404
        assert response.json() == {"detail": "No quizzes found"}

    def test_read_quiz_with_topic_data_by_quiz_id_raises_exception_if_quiz_not_found(
        self, client: TestClient, token_headers: dict[str, str]
    ) -> None:
        response = client.get(f"/quizzes/{uuid4()}", headers=token_headers)

        assert response.status_code == 404
        assert response.json() == {"detail": "No quiz found"}


class TestQuizRoutesSuccess:
    def test_create_quiz(self, create_quiz_api_response: Response, db: Session) -> None:
        response_json = create_quiz_api_response.json()
        quiz = crud_quizzes.get_quiz_by_id(db, quiz_id=response_json["id"])
        quiz_questions = crud_quiz_questions.get_quiz_questions_by_quiz_id(
            db, quiz_id=response_json["id"]
        )

        assert create_quiz_api_response.status_code == 201
        assert quiz is not None
        assert str(quiz.id) == response_json["id"]

        # Ensure quiz question records also created
        assert len(quiz_questions) == 5
        assert quiz_questions[0].quiz_id == quiz.id

    def test_create_quiz_creates_a_quiz_question_record(
        self, create_quiz_api_response: Response, db: Session
    ) -> None:
        response_json = create_quiz_api_response.json()
        result = crud_quiz_questions.get_quiz_questions_by_quiz_id(
            db, quiz_id=response_json["id"]
        )

        assert result is not None

    def test_read_all_quizzes_with_topic_data_by_user_id(
        self,
        client: TestClient,
        token_headers: dict[str, str],
        create_test_quiz: QuizId,
        create_test_questions: list[Question],
        create_test_primary_topics: list[Topic],
        create_test_subtopics: list[Topic],
        create_test_quiz_questions: list[QuizQuestion],
        generate_test_user: User,
    ) -> None:
        response = client.get("/quizzes/user/me", headers=token_headers)
        data: QuizWithTopicData = response.json()[0]

        # Each list item of primary and subtopic generators is of type <class 'sqlalchemy.engine.row.Row'>
        # Index 1 is the topic title in each list - yes, this is brittle and perhaps I'll update at some point
        primary_topics = list(map(lambda x: x[1], create_test_primary_topics))
        subtopics = list(map(lambda x: x[1], create_test_subtopics))

        assert response.status_code == 200
        assert data["primary_topic"] in primary_topics
        assert data["subtopics"][0] in subtopics
        assert isinstance(data["subtopics"], list)
        assert data["created_at"] is not None

    def test_read_quiz_with_topic_data_by_quiz_id(
        self,
        client: TestClient,
        token_headers: dict[str, str],
        create_test_quiz: QuizId,
        create_test_questions: list[Question],
        create_test_primary_topics: list[Topic],
        create_test_subtopics: list[Topic],
        create_test_quiz_questions: list[QuizQuestion],
        generate_test_user: User,
    ) -> None:
        response = client.get(f"/quizzes/{create_test_quiz}", headers=token_headers)
        data: QuizWithTopicData = response.json()

        # Each list item of primary and subtopic generators is of type <class 'sqlalchemy.engine.row.Row'>
        # Index 1 is the topic title in each list - yes, this is brittle and perhaps I'll update at some point
        primary_topics = list(map(lambda x: x[1], create_test_primary_topics))
        subtopics = list(map(lambda x: x[1], create_test_subtopics))

        assert response.status_code == 200
        assert data["primary_topic"] in primary_topics
        assert data["subtopics"][0] in subtopics
        assert isinstance(data["subtopics"], list)
        assert data["created_at"] is not None

    def test_delete_quiz(
        self,
        db: Session,
        client: TestClient,
        token_headers: dict[str, str],
        create_test_quiz: QuizId,
        create_test_quiz_questions: list[QuizQuestion],
    ) -> None:
        quiz_record = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)
        quiz_question_record = crud_quiz_questions.get_quiz_questions_by_quiz_id(
            db, quiz_id=create_test_quiz
        )

        assert quiz_record is not None
        assert quiz_question_record is not None

        response = client.delete(
            f"/quizzes/{create_test_quiz}",
            headers=token_headers,
        )

        deleted_quiz_record = crud_quizzes.get_quiz_by_id(db, quiz_id=create_test_quiz)
        deleted_quiz_question_record = (
            crud_quiz_questions.get_quiz_questions_by_quiz_id(
                db, quiz_id=create_test_quiz
            )
        )

        assert deleted_quiz_record is None
        assert deleted_quiz_question_record == []
        assert response.status_code == 204
