from pydantic import UUID4
import pytest
from sqlalchemy.orm import Session

from app.models.topic import Topic
from app.crud import crud_topics
from tests.utils.topic import create_test_topic, delete_test_topics


@pytest.fixture(scope="function")
def create_test_topics(db: Session) -> list[UUID4]:
    topic1_id = create_test_topic(db, title="Movies")
    topic2_id = create_test_topic(
        db, title="Sportsball", description="homeruns are classic"
    )

    yield [topic1_id, topic2_id]

    delete_test_topics(db)


def test_read_primary_topics(db: Session, create_test_topics: list[UUID4]) -> None:
    topic1_id, topic2_id = create_test_topics
    result: list[Topic] = crud_topics.get_primary_topics(db)

    assert len(result) == 2

    assert result[0].id == topic1_id
    assert result[0].title == "Movies"
    assert result[0].description is None

    assert result[1].id == topic2_id
    assert result[1].description == "homeruns are classic"


def test_read_primary_topics_with_empty_list_returns_no_error(db: Session) -> None:
    result = crud_topics.get_primary_topics(db)

    assert result == []
    assert len(result) == 0
