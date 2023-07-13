from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.topic import Topic
from app.crud import crud_topics
from tests.utils.topic import create_test_topic, delete_test_topics


class TestCrudTopicNotReturningData:
    def test_topics_marked_is_deleted_return_no_results(self, db: Session) -> None:
        try:
            create_test_topic(db, title="This should not be returned", is_deleted=True)
            result = crud_topics.get_primary_topics(db)

            assert result == []
        finally:
            delete_test_topics(db)


class TestCrudTopicReturningData:
    def test_read_primary_topics(
        self, db: Session, create_test_topics: list[Topic]
    ) -> None:
        topic1, topic2 = create_test_topics[0], create_test_topics[1]

        result: list[Topic] = crud_topics.get_primary_topics(db)

        # This shows us that only the primary topics were returned
        assert len(result) == 2

        assert result[0].id == topic1.id
        assert result[0].title == "Movies"
        assert result[0].description is None

        assert result[1].id == topic2.id
        assert result[1].description == "homeruns are classic"

    def test_read_subtopics(self, db: Session, create_test_topics: list[Topic]) -> None:
        topic, subtopic = create_test_topics[0], create_test_topics[2]
        result: list[Topic] = crud_topics.get_subtopics(db, topic.id)

        # Only return the subtopics
        assert len(result) == 4

        assert result[0].topic_id == topic.id
        assert result[0].title is not None
        assert result[0].description is None
        assert result[0].id == subtopic.id
