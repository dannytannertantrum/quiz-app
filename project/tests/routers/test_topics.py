from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.topic import Topic
from app.schemas.topic import TopicWithDescription
from tests.utils.topic import create_test_topic, delete_test_topics


class TestTopicRoutesNotReturningData:
    def test_read_all_topics_returning_empty_list_raises_not_found_error(
        self, client: TestClient, token_headers: dict[str, str]
    ):
        response = client.get("/topics/", headers=token_headers)

        assert response.status_code == 404
        assert response.json() == {"detail": "No topics found"}

    def test_read_primary_topics_returning_empty_list_raises_not_found_error(
        self, client: TestClient, token_headers: dict[str, str]
    ):
        response = client.get("/topics/primary-topics", headers=token_headers)

        assert response.status_code == 404
        assert response.json() == {"detail": "No primary topics found"}

    def test_read_subtopics_returning_empty_list_raises_not_found_error(
        self, client: TestClient, token_headers: dict[str, str]
    ) -> None:
        random_uuid = uuid4()

        response = client.get(
            f"/topics/primary-topics/{random_uuid}", headers=token_headers
        )

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No subtopics associated with topic id: {random_uuid}"
        }

    def test_read_topic_by_id_that_does_not_exist_raises_not_found_error(
        self, client: TestClient, token_headers: dict[str, str]
    ) -> None:
        random_uuid = uuid4()

        response = client.get(f"/topics/{random_uuid}", headers=token_headers)

        assert response.status_code == 404
        assert response.json() == {
            "detail": f"No topic found with topic id: {random_uuid}"
        }

    def test_read_primary_topics_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session, token_headers: dict[str, str]
    ) -> None:
        try:
            create_test_topic(db, title="This should not be returned", is_deleted=True)

            response = client.get("/topics/primary-topics", headers=token_headers)

            assert response.status_code == 404
            assert response.json() == {"detail": "No primary topics found"}
        finally:
            delete_test_topics(db)

    def test_read_subtopics_with_primary_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session, token_headers: dict[str, str]
    ) -> None:
        try:
            primary_topic = create_test_topic(
                db, title="This should not be returned", is_deleted=True
            )
            # create subtopic
            create_test_topic(db, title="My subtopic", parent_topic_id=primary_topic.id)

            response = client.get(
                f"/topics/primary-topics/{primary_topic.id}", headers=token_headers
            )

            assert response.status_code == 404
            assert response.json() == {
                "detail": f"No subtopics associated with topic id: {primary_topic.id}"
            }
        finally:
            delete_test_topics(db)

    def test_read_subtopics_with_subtopic_marked_is_deleted_returns_no_results(
        self, client: TestClient, db: Session, token_headers: dict[str, str]
    ) -> None:
        try:
            primary_topic = create_test_topic(db, title="My primary topic")
            # create subtopic
            create_test_topic(
                db,
                title="My subtopic",
                parent_topic_id=primary_topic.id,
                is_deleted=True,
            )

            response = client.get(
                f"/topics/primary-topics/{primary_topic.id}", headers=token_headers
            )

            assert response.status_code == 404
            assert response.json() == {
                "detail": f"No subtopics associated with topic id: {primary_topic.id}"
            }
        finally:
            delete_test_topics(db)


class TestTopicRoutesReturningData:
    def test_read_all_topics_returns_all_topics(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
        token_headers: dict[str, str],
    ) -> None:
        totalNumOfTopics = len(create_test_primary_topics) + len(
            create_test_subtopics_movies
        )
        response = client.get("/topics/", headers=token_headers)
        topics: list[TopicWithDescription] = response.json()

        assert response.status_code == 200
        assert len(topics) == totalNumOfTopics

        assert topics[0]["id"] is not None
        assert topics[0]["title"] == "Movies"
        assert topics[0]["description"] == None

    def test_read_primary_topics_returns_only_primary_topics(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
        token_headers: dict[str, str],
    ) -> None:
        response = client.get("/topics/primary-topics", headers=token_headers)
        topics: list[TopicWithDescription] = response.json()

        assert response.status_code == 200
        assert len(topics) == len(create_test_primary_topics)

        assert topics[0]["id"] is not None
        assert topics[0]["title"] == "Movies"
        assert topics[0]["description"] == None

    def test_read_subtopics_returns_only_subtopics(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
        token_headers: dict[str, str],
    ) -> None:
        primary_topic_movies: Topic = create_test_primary_topics[0]

        response = client.get(
            f"/topics/primary-topics/{primary_topic_movies.id}", headers=token_headers
        )
        subtopics: list[TopicWithDescription] = response.json()

        assert response.status_code == 200
        assert len(subtopics) == len(create_test_subtopics_movies)

        assert subtopics[0]["id"] is not None
        assert subtopics[0]["title"] == "horror"
        assert subtopics[0]["description"] == None

    def test_read_topic_by_id(
        self,
        client: TestClient,
        create_test_primary_topics: list[Topic],
        token_headers: dict[str, str],
    ) -> None:
        primary_topic_movies: Topic = create_test_primary_topics[0]

        response = client.get(
            f"/topics/{primary_topic_movies.id}", headers=token_headers
        )
        topic: TopicWithDescription = response.json()

        assert response.status_code == 200

        assert topic["id"] is not None
        assert topic["title"] == "Movies"
        assert topic["description"] == None
