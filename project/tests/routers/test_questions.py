from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.topic import Topic
from tests.utils.topic import create_test_topic, delete_test_topics
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.string_helpers import random_lower_string


class TestQuestionRoutesNotReturningData:
    def test_read_all_questions_returning_empty_list_returns_not_found_error(
        self, client: TestClient
    ):
        response = client.get("/questions/")

        assert response.status_code == 404
        assert response.json() == {"detail": "No questions found"}

    def test_read_question_by_id_returning_empty_list_returns_not_found_error(
        self, client: TestClient
    ) -> None:
        random_uuid = uuid4()
        response = client.get(f"/questions/{random_uuid}")

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No question associated with question id: {random_uuid}"
        }

    def test_read_question_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session, create_test_subtopics_movies: list[Topic]
    ) -> None:
        horror_subtopic = create_test_subtopics_movies[0]
        try:
            create_test_question(
                db,
                answer_options=random_answer_options,
                correct_answer=2,
                is_deleted=True,
                question=random_lower_string(),
                question_type="multiple choice",
                topic_id=horror_subtopic.id,
            )

            response = client.get("/questions/")

            assert response.status_code == 404
            assert response.json() == {"detail": "No questions found"}
        finally:
            delete_test_questions(db)

    def test_read_question_with_subtopics_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session, create_deleted_test_subtopic: Topic
    ) -> None:
        deleted_subtopic = create_deleted_test_subtopic
        try:
            create_test_question(
                db,
                answer_options=random_answer_options,
                correct_answer=2,
                is_deleted=True,
                question=random_lower_string(),
                question_type="multiple choice",
                topic_id=deleted_subtopic.id,
            )

            response = client.get("/questions/")

            assert response.status_code == 404
            assert response.json() == {"detail": "No questions found"}
        finally:
            delete_test_questions(db)

    def test_read_question_with_primary_topic_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session, create_deleted_test_primary_topic: Topic
    ) -> None:
        subtopic_with_deleted_primary_topic = create_test_topic(
            db,
            title="This is deleted",
            description="So it shouldn't return",
            topic_id=create_deleted_test_primary_topic.id,
        )

        try:
            create_test_question(
                db,
                answer_options=random_answer_options,
                correct_answer=2,
                is_deleted=True,
                question=random_lower_string(),
                question_type="multiple choice",
                topic_id=subtopic_with_deleted_primary_topic.id,
            )

            response = client.get("/questions/")

            assert response.status_code == 404
            assert response.json() == {"detail": "No questions found"}
        finally:
            delete_test_questions(db)
            delete_test_topics(db)


class TestQuestionRoutesReturningData:
    def test_read_all_questions_returns_questions(
        self,
        db: Session,
        client: TestClient,
        create_test_questions: list[Question],
    ) -> None:
        response = client.get("/questions/")
        questions: list[Question] = response.json()

        assert response.status_code == 200
        assert len(questions) == len(create_test_questions)

        assert questions[0]["id"] is not None
        assert questions[0]["answer_options"] is not None
        assert questions[0]["question"] is not None

    def test_read_questions_by_id_returns_one_question(
        self, client: TestClient, create_test_questions: list[Question]
    ) -> None:
        response = client.get(f"/questions/{create_test_questions[0].id}")
        question: Question = response.json()

        assert response.status_code == 200

        assert question["answer_options"] is not None
        assert isinstance(question["correct_answer"], int)
        assert isinstance(question["question"], str)
        assert question["question_type"] == "multiple choice"
        assert question["topic_id"] is not None

    def test_read_questions_by_primary_topic_id(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
    ) -> None:
        response = client.get(f"/questions/topic/{create_test_primary_topics[0].id}")
        questions: list[Question] = response.json()

        assert response.status_code == 200
        assert len(questions) == len(create_test_subtopics_movies)

        assert questions[0]["answer_options"] is not None
        assert isinstance(questions[0]["correct_answer"], int)
        assert isinstance(questions[0]["question"], str)
        assert questions[0]["question_type"] == "multiple choice"
        assert questions[0]["topic_id"] is not None

    def test_read_questions_by_subtopic_ids(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
    ) -> None:
        horror, scifi_empty, drama, comedy = create_test_subtopics_movies
        response = client.get(
            f"/questions/topic/{create_test_primary_topics[0].id}?subtopic_ids={horror.id},{drama.id}"
        )
        questions: list[Question] = response.json()

        assert response.status_code == 200
        assert len(questions) == 2  # horror and drama each have one question

        assert questions[0]["answer_options"] is not None
        assert isinstance(questions[0]["correct_answer"], int)
        assert isinstance(questions[0]["question"], str)
        assert questions[0]["question_type"] == "multiple choice"
        assert questions[0]["topic_id"] is not None
