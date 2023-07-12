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
from app.models import topic, question
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.string_helpers import random_lower_string
from tests.utils.topic import create_test_topic, delete_test_topics


PRIMARY_TOPIC_MOVIES_UUID = uuid4()
PRIMARY_TOPIC_SPORTSBALL_UUID = uuid4()
PRIMARY_TOPIC_MUSIC_UUID = uuid4()


def get_settings_override():
    return Settings(
        testing=1, database_url=os.environ.get("DATABASE_TEST_URL"), environment="test"
    )


# Remdiner: scope="module" means the fixture will be invoked once per test module
# It's created for the module, used for all tests, then destroyed after all tests
@pytest.fixture(scope="module")
def client() -> Generator:
    # set up - if we drill into dependency_overrides, we can see it's a dict of key/value pairs
    # The key is the dependency name and value is what we'd like to override it with
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


@pytest.fixture(scope="module")
def create_test_topics(db: Session) -> list[topic.Topic]:
    primary_topic_movies = create_test_topic(
        db, title="Movies", id=PRIMARY_TOPIC_MOVIES_UUID
    )
    primary_topic_sportsball = create_test_topic(
        db,
        title="Sportsball",
        id=PRIMARY_TOPIC_SPORTSBALL_UUID,
        description="homeruns are classic",
    )
    subtopic_movies1 = create_test_topic(
        db, topic_id=PRIMARY_TOPIC_MOVIES_UUID, title="horror"
    )
    subtopic_movies2 = create_test_topic(
        db, topic_id=PRIMARY_TOPIC_MOVIES_UUID, title="sci-fi"
    )
    subtopic_movies3 = create_test_topic(
        db, topic_id=PRIMARY_TOPIC_MOVIES_UUID, title="drama"
    )
    subtopic_movies4 = create_test_topic(
        db, topic_id=PRIMARY_TOPIC_MOVIES_UUID, title="comedy"
    )
    primary_topic_music_is_deleted = create_test_topic(
        db, title="Music", id=PRIMARY_TOPIC_MUSIC_UUID, is_deleted=True
    )
    subtopic_music = create_test_topic(
        db, topic_id=PRIMARY_TOPIC_MUSIC_UUID, title="metal"
    )
    subtopic_deleted = create_test_topic(
        db, topic_id=PRIMARY_TOPIC_SPORTSBALL_UUID, title="baseball", is_deleted=True
    )

    yield [
        primary_topic_movies,
        primary_topic_sportsball,
        subtopic_movies1,
        subtopic_movies2,
        subtopic_movies3,
        subtopic_movies4,
        primary_topic_music_is_deleted,
        subtopic_music,
        subtopic_deleted,
    ]
    delete_test_topics(db)


@pytest.fixture(scope="module")
def create_test_questions(
    db: Session, create_test_topics: list[topic.Topic]
) -> list[question.Question]:
    _movies, _sportsball, horror, _sci_fi, drama, comedy = create_test_topics
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
    drama_question1 = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=2,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=drama.id,
    )
    drama_question2 = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=4,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=drama.id,
    )
    horror_question1 = create_test_question(
        db,
        answer_options=random_answer_options,
        correct_answer=2,
        question=random_lower_string(),
        question_type="multiple choice",
        topic_id=horror.id,
    )
    horror_question2 = create_test_question(
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
        drama_question1,
        drama_question2,
        horror_question1,
        horror_question2,
    ]
    delete_test_questions(db)
