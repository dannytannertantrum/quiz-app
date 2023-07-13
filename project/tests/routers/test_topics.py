from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.topic import Topic
from tests.utils.topic import create_test_topic, delete_test_topics


class TestTopicRoutesNotReturningData:
    def test_read_primary_topics_with_empty_list_returns_not_found_error(
        self, client: TestClient
    ):
        response = client.get("/topics/")

        assert response.status_code == 404
        assert response.json() == {"detail": "No topics found"}

    def test_read_subtopics_with_empty_list_returns_not_found_error(
        self, client: TestClient
    ) -> None:
        random_uuid = uuid4()

        response = client.get(f"/topics/{random_uuid}")

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No subtopics associated with topic id: {random_uuid}"
        }

    def test_read_primary_topics_marked_is_deleted_return_no_results(
        self, client: TestClient, db: Session
    ) -> None:
        try:
            create_test_topic(db, title="This should not be returned", is_deleted=True)

            response = client.get("/topics/")

            assert response.status_code == 404
            assert response.json() == {"detail": "No topics found"}
        finally:
            delete_test_topics(db)

    def test_read_subtopics_with_primary_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session
    ) -> None:
        try:
            primary_topic = create_test_topic(
                db, title="This should not be returned", is_deleted=True
            )
            # create subtopic
            create_test_topic(db, title="My subtopic", topic_id=primary_topic.id)

            response = client.get(f"/topics/{primary_topic.id}")

            assert response.status_code == 404
            assert response.json() == {
                "detail": f"No subtopics associated with topic id: {primary_topic.id}"
            }
        finally:
            delete_test_topics(db)

    def test_read_subtopics_with_subtopic_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session
    ) -> None:
        try:
            primary_topic = create_test_topic(db, title="My primary topic")
            # create subtopic
            create_test_topic(
                db, title="My subtopic", topic_id=primary_topic.id, is_deleted=True
            )

            response = client.get(f"/topics/{primary_topic.id}")

            assert response.status_code == 404
            assert response.json() == {
                "detail": f"No subtopics associated with topic id: {primary_topic.id}"
            }
        finally:
            delete_test_topics(db)


class TestTopicRoutesReturningData:
    def test_read_primary_topics_returns_topics(
        self, client: TestClient, create_test_primary_topics: list[Topic]
    ) -> None:
        response = client.get("/topics/")
        topics: list[Topic] = response.json()

        assert response.status_code == 200
        assert len(topics) == len(create_test_primary_topics)

        assert topics[0]["id"] is not None
        assert topics[0]["title"] == "Movies"
        assert topics[0]["description"] == None

    def test_read_subtopics_returns_subtopics(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
    ) -> None:
        primary_topic_movies: Topic = create_test_primary_topics[0]

        response = client.get(f"/topics/{primary_topic_movies.id}")
        subtopics: list[Topic] = response.json()

        assert response.status_code == 200
        assert len(subtopics) == len(create_test_subtopics_movies)

        assert subtopics[0]["id"] is not None
        assert subtopics[0]["title"] == "horror"
        assert subtopics[0]["description"] == None
