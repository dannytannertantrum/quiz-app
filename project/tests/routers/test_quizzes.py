from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.utils import kitchen_sink, question, quiz
from app.models.question import Question
from app.models.topic import Topic


class TestQuizRoutesNotReturningData:
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


class TestQuizRoutesReturningData:
    def test_create_quiz(
        self,
        db: Session,
        client: TestClient,
        token_headers: dict[str, str],
        create_test_subtopics: list[Topic],
        create_test_questions: list[Question],
    ) -> None:
        try:
            user_input = {
                "selected_topics": [
                    str(create_test_subtopics[0].id),
                    str(create_test_subtopics[1].id),
                    str(create_test_subtopics[2].id),
                ]
            }

            response = client.post("/quizzes/", headers=token_headers, json=user_input)

            assert response.status_code == 201
        finally:
            quiz.delete_test_quizzes(db)
