from uuid import uuid4

from sqlalchemy.orm import Session

from app.config import Settings
from app.models.topic import Topic
from app.crud import crud_topics
from tests.utils.topic import create_test_topic, delete_test_topics


random_uuid = uuid4()


class TestCrudTopicNotReturningData:
    def test_get_all_topics_returns_empty_list_if_no_records_round(
        self, db: Session
    ) -> None:
        result = crud_topics.get_all_topics(db)

        assert result == []

    def test_get_topic_by_id_returns_None_if_no_record_found(self, db: Session) -> None:
        result = crud_topics.get_topic_by_id(db, topic_id=random_uuid)

        assert result is None

    def test_get_primary_topics_returns_empty_list_if_no_records_round(
        self, db: Session
    ) -> None:
        result = crud_topics.get_primary_topics(db)

        assert result == []

    def test_get_subtopics_returns_empty_list_if_no_records_round(
        self, db: Session
    ) -> None:
        result = crud_topics.get_subtopics(db, primary_topic_id=random_uuid)

        assert result == []

    def test_get_primary_topic_id_by_subtopic_ids_returns_None_if_no_records_round(
        self, db: Session
    ) -> None:
        result = crud_topics.get_primary_topic_id_by_subtopic_ids(
            db, subtopic_ids=[random_uuid]
        )

        assert result is None

    def test_get_topics_marked_is_deleted_return_no_results(self, db: Session) -> None:
        try:
            create_test_topic(db, title="This should not be returned", is_deleted=True)
            result = crud_topics.get_primary_topics(db)

            assert result == []
        finally:
            delete_test_topics(db)


class TestCrudTopicReturningData:
    def test_get_primary_topics(
        self, db: Session, create_test_primary_topics: list[Topic]
    ) -> None:
        topic1_movies, topic2_sportsball, topic3_music = create_test_primary_topics

        result: list[Topic] = crud_topics.get_primary_topics(db)

        # This shows us that only the primary topics were returned
        assert len(result) == len(create_test_primary_topics)

        assert result[0].id == topic1_movies.id
        assert result[0].title == "Movies"
        assert result[0].description is None

        assert result[1].id == topic2_sportsball.id
        assert result[1].description == "homeruns are classic"

        assert result[2].title == topic3_music.title

    def test_get_subtopics(
        self,
        app_config: Settings,
        db: Session,
        create_test_primary_topics: list[Topic],
        create_test_subtopics: list[Topic],
    ) -> None:
        movies: list[Topic] = crud_topics.get_subtopics(
            db, app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID
        )

        assert len(movies) > 0
        assert movies[0].parent_topic_id == app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID
        assert movies[0].title is not None
