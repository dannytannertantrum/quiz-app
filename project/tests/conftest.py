import os
from typing import Generator
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings, Settings
from app.database import Base
from app.main import app
from app.models import topic, question, user
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.kitchen_sink import random_lower_string, get_token_headers
from tests.utils.topic import create_test_topic, delete_test_topics
from tests.utils.user import create_test_user, delete_test_users


app_config: Settings = get_settings()

DELETED_PRIMARY_TOPIC_SPORTS_UUID = uuid4()
PRIMARY_TOPIC_MOVIES_UUID = uuid4()
PRIMARY_TOPIC_MUSIC_UUID = uuid4()
PRIMARY_TOPIC_SPORTSBALL_UUID = uuid4()
SUBTOPIC_COMEDY_UUID = uuid4()
SUBTOPIC_DRAMA_UUID = uuid4()
SUBTOPIC_HORROR_UUID = uuid4()
SUBTOPIC_SCIFI_UUID = uuid4()
USER_UUID = uuid4()


def get_settings_override():
    return Settings(
        TESTING=1, DATABASE_URL=os.environ.get("DATABASE_TEST_URL"), ENVIRONMENT="test"
    )


@pytest.fixture(scope="module")
def client() -> Generator:
    app.dependency_overrides[get_settings] = get_settings_override
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def db() -> Generator:
    app.dependency_overrides[get_settings] = get_settings_override
    engine = create_engine(os.environ.get("DATABASE_TEST_URL"))

    SessionTest = sessionmaker(autoflush=False, bind=engine)

    # For local, we use alembic to migrate and keep records of database changes
    # But for tests, our migrations/versions should reflect our models,
    # so it's easier to create the tables with Base.metadata.create_all(engine)
    Base.metadata.create_all(engine)
    yield SessionTest()


@pytest.fixture(scope="function")
def generate_test_user(db: Session) -> user.User:
    user = create_test_user(
        db,
        id=USER_UUID,
        email=app_config.TEST_USER_EMAIL,
        password=app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
    )

    yield user

    delete_test_users(db)


@pytest.fixture(scope="function")
def token_headers(client: TestClient, generate_test_user: user.User) -> dict[str, str]:
    return get_token_headers(
        client=client,
        email=app_config.TEST_USER_EMAIL,
        password=app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
    )


@pytest.fixture(scope="class")
def create_test_primary_topics(db: Session) -> list[topic.Topic]:
    primary_topic_movies = create_test_topic(
        db, title="Movies", id=PRIMARY_TOPIC_MOVIES_UUID
    )
    primary_topic_sportsball = create_test_topic(
        db,
        title="Sportsball",
        id=PRIMARY_TOPIC_SPORTSBALL_UUID,
        description="homeruns are classic",
    )
    primary_topic_music = create_test_topic(
        db, title="Music", id=PRIMARY_TOPIC_MUSIC_UUID
    )

    yield [primary_topic_movies, primary_topic_sportsball, primary_topic_music]

    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_deleted_test_primary_topic(db: Session) -> topic.Topic:
    deleted_primary_topic = create_test_topic(
        db, title="Movies", id=DELETED_PRIMARY_TOPIC_SPORTS_UUID, is_deleted=True
    )

    yield deleted_primary_topic

    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_test_subtopics_movies(
    db: Session, create_test_primary_topics
) -> list[topic.Topic]:
    primary_topic_movies: topic.Topic = create_test_primary_topics[0]
    subtopic_horror = create_test_topic(
        db,
        id=SUBTOPIC_HORROR_UUID,
        parent_topic_id=primary_topic_movies.id,
        title="horror",
    )
    subtopic_scifi = create_test_topic(
        db,
        id=SUBTOPIC_SCIFI_UUID,
        parent_topic_id=primary_topic_movies.id,
        title="sci-fi",
    )
    subtopic_drama = create_test_topic(
        db,
        id=SUBTOPIC_DRAMA_UUID,
        parent_topic_id=primary_topic_movies.id,
        title="drama",
    )
    subtopic_comedy = create_test_topic(
        db,
        id=SUBTOPIC_COMEDY_UUID,
        parent_topic_id=primary_topic_movies.id,
        title="comedy",
    )

    yield [
        subtopic_horror,
        subtopic_scifi,
        subtopic_drama,
        subtopic_comedy,
    ]
    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_deleted_test_subtopic(
    db: Session, create_test_primary_topics
) -> topic.Topic:
    primary_topic: topic.Topic = create_test_primary_topics[0]
    deleted_subtopic = create_test_topic(
        db, parent_topic_id=primary_topic.id, title="horror", is_deleted=True
    )

    yield deleted_subtopic
    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_test_subtopic_with_deleted_parent_topic(
    db: Session, create_deleted_test_primary_topic
) -> topic.Topic:
    deleted_primary_topic = create_deleted_test_primary_topic
    subtopic_with_deleted_parent = create_test_topic(
        db, parent_topic_id=deleted_primary_topic.id, title="horror", is_deleted=False
    )

    yield subtopic_with_deleted_parent
    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_test_questions(
    db: Session, create_test_subtopics_movies: list[topic.Topic]
) -> list[question.Question]:
    horror, sci_fi, drama, comedy = create_test_subtopics_movies
    comedy_question1 = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=3,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=comedy.id,
    )
    comedy_question2 = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=1,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=comedy.id,
    )
    drama_question = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=2,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=drama.id,
    )
    horror_question = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=3,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=horror.id,
    )

    yield [
        comedy_question1,
        comedy_question2,
        drama_question,
        horror_question,
    ]
    delete_test_questions(db)
