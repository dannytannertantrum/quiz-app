from sqlalchemy.orm import Session

from app.config import Settings
from app.models.topic import Topic
from app.crud import crud_topics
from tests.utils.topic import create_test_topic, delete_test_topics


class TestCrudTopicNotReturningData:
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
