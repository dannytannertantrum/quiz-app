import os
from typing import Generator

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


def get_settings_override():
    return Settings(
        TESTING=1, DATABASE_URL=os.environ.get("DATABASE_TEST_URL"), ENVIRONMENT="test"
    )


@pytest.fixture(scope="session")
def app_config() -> Generator:
    app_settings: Settings = get_settings()
    yield app_settings


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
def generate_test_user(db: Session, app_config: Settings) -> user.User:
    user = create_test_user(
        db,
        id=app_config.TEST_USER_UUID,
        email=app_config.TEST_USER_EMAIL,
        password=app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
    )

    yield user

    delete_test_users(db)


@pytest.fixture(scope="function")
def token_headers(
    client: TestClient, generate_test_user: user.User, app_config: Settings
) -> dict[str, str]:
    return get_token_headers(
        client=client,
        email=app_config.TEST_USER_EMAIL,
        password=app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
    )


@pytest.fixture(scope="class")
def create_test_primary_topics(db: Session, app_config: Settings) -> list[topic.Topic]:
    primary_topic_movies = create_test_topic(
        db, title="Movies", id=app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID
    )
    primary_topic_sportsball = create_test_topic(
        db,
        title="Sportsball",
        id=app_config.TEST_PRIMARY_TOPIC_SPORTSBALL_UUID,
        description="homeruns are classic",
    )
    primary_topic_music = create_test_topic(
        db, title="Music", id=app_config.TEST_PRIMARY_TOPIC_MUSIC_UUID
    )

    yield [primary_topic_movies, primary_topic_sportsball, primary_topic_music]

    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_deleted_test_primary_topic(db: Session, app_config: Settings) -> topic.Topic:
    deleted_primary_topic = create_test_topic(
        db,
        title="Movies",
        id=app_config.TEST_DELETED_PRIMARY_TOPIC_SPORTS_UUID,
        is_deleted=True,
    )

    yield deleted_primary_topic

    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_test_subtopics(
    db: Session, create_test_primary_topics: list[topic.Topic], app_config: Settings
) -> list[topic.Topic]:
    subtopic_horror = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_HORROR_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID,
        title="horror",
    )
    subtopic_scifi = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_SCIFI_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID,
        title="sci-fi",
    )
    subtopic_drama = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_DRAMA_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID,
        title="drama",
    )
    subtopic_comedy = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_COMEDY_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID,
        title="comedy",
    )

    subtopic_hockey = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_HOCKEY_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_SPORTSBALL_UUID,
        title="hockey",
    )
    subtopic_football = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_FOOTBALL_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_SPORTSBALL_UUID,
        title="football",
    )

    subtopic_metal = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_METAL_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MUSIC_UUID,
        title="metal",
    )
    subtopic_techno = create_test_topic(
        db,
        id=app_config.TEST_SUBTOPIC_TECHNO_UUID,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MUSIC_UUID,
        title="techno",
    )

    yield [
        subtopic_horror,
        subtopic_scifi,
        subtopic_drama,
        subtopic_comedy,
        subtopic_hockey,
        subtopic_football,
        subtopic_metal,
        subtopic_techno,
    ]
    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_deleted_test_subtopic(
    db: Session, create_test_primary_topics: list[topic.Topic], app_config: Settings
) -> topic.Topic:
    deleted_subtopic = create_test_topic(
        db,
        parent_topic_id=app_config.TEST_PRIMARY_TOPIC_MOVIES_UUID,
        title="horror",
        is_deleted=True,
    )

    yield deleted_subtopic
    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_test_subtopic_with_deleted_parent_topic(
    db: Session, create_deleted_test_primary_topic: topic.Topic, app_config: Settings
) -> topic.Topic:
    subtopic_with_deleted_parent = create_test_topic(
        db,
        parent_topic_id=app_config.TEST_DELETED_PRIMARY_TOPIC_SPORTS_UUID,
        title="hockey",
        is_deleted=False,
    )

    yield subtopic_with_deleted_parent
    delete_test_topics(db)


@pytest.fixture(scope="class")
def create_test_questions(
    db: Session, create_test_subtopics: list[topic.Topic]
) -> list[question.Question]:
    questionsToYield = []

    for i in range(30):
        currentSubtopicIndex = i % len(create_test_subtopics)
        questionsToYield.append(
            create_test_question(
                db,
                answer_options=random_answer_options,
                correct_answer=i,
                question=random_lower_string(),
                question_type="multiple choice",
                topic_id=create_test_subtopics[currentSubtopicIndex].id,
            )
        )

    yield questionsToYield
    delete_test_questions(db)
