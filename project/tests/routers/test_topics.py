from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from tests.utils.topic import create_test_topic, delete_test_topics


class TestTopicRoutesReturningNoData:
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
    pass
