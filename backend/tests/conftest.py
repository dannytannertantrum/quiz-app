import os
from datetime import datetime, timezone
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from pydantic import UUID4
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings, Settings
from app.crud import crud_quizzes, crud_quiz_questions
from app.database import Base
from app.main import app
from app.models import Question, QuizQuestion, Topic, User
from app.schemas import quiz
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.kitchen_sink import random_lower_string, get_token_from_cookies
from tests.utils.quiz import delete_test_quizzes
from tests.utils.quiz_question import (
    create_test_quiz_questions_with_answers,
    delete_test_quiz_questions,
)
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
def generate_test_user(db: Session, app_config: Settings) -> User:
    user = create_test_user(
        db,
        id=app_config.TEST_USER_UUID,
        email=app_config.TEST_USER_EMAIL,
        password=app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
    )

    yield user

    delete_test_users(db)


@pytest.fixture(scope="function")
def access_token(
    client: TestClient, generate_test_user: User, app_config: Settings
) -> dict[str, str]:
    return get_token_from_cookies(
        client=client,
        email=app_config.TEST_USER_EMAIL,
        password=app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
    )


@pytest.fixture(scope="class")
def create_test_primary_topics(db: Session, app_config: Settings) -> list[Topic]:
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
def create_deleted_test_primary_topic(db: Session, app_config: Settings) -> Topic:
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
    db: Session, create_test_primary_topics: list[Topic], app_config: Settings
) -> list[Topic]:
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
    db: Session, create_test_primary_topics: list[Topic], app_config: Settings
) -> Topic:
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
    db: Session, create_deleted_test_primary_topic: Topic, app_config: Settings
) -> Topic:
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
    db: Session, create_test_subtopics: list[Topic]
) -> list[Question]:
    questionsToYield = []

    for i in range(30):
        currentSubtopicIndex = i % len(create_test_subtopics)
        questionsToYield.append(
            create_test_question(
                db,
                answer_options=random_answer_options,
                correct_answer=i % 4 + 1,
                question=random_lower_string(),
                question_type="multiple choice",
                topic_id=create_test_subtopics[currentSubtopicIndex].id,
            )
        )

    yield questionsToYield
    delete_test_questions(db)


@pytest.fixture(scope="function")
def create_test_quiz(db: Session, generate_test_user: User) -> quiz.QuizId:
    yield crud_quizzes.create_quiz_in_db(db, user_id=generate_test_user.id)
    delete_test_quizzes(db)


@pytest.fixture(scope="function")
def create_test_quiz_questions(
    db: Session,
    create_test_questions: list[Question],
    create_test_quiz: quiz.QuizId,
) -> list[QuizQuestion]:
    questions = create_test_questions[:5]
    question_ids: list[UUID4] = list(map(lambda x: x[0], questions))
    quiz_questions = crud_quiz_questions.create_quiz_question_in_db(
        db, question_ids=question_ids, quiz_id=create_test_quiz
    )

    yield quiz_questions
    delete_test_quiz_questions(db)


@pytest.fixture(scope="function")
def create_test_quiz_for_qq_with_all_answers(
    db: Session, generate_test_user: User
) -> quiz.QuizId:
    yield crud_quizzes.create_quiz_in_db(
        db,
        user_id=generate_test_user.id,
        last_modified_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc),
        score=40,
    )
    delete_test_quizzes(db)


@pytest.fixture(scope="function")
def create_test_quiz_questions_with_all_answers(
    db: Session,
    create_test_questions: list[Question],
    create_test_quiz_for_qq_with_all_answers: quiz.QuizId,
) -> list[QuizQuestion]:
    # Use the last 5 values to do something different than above
    questions = create_test_questions[-5:]
    question_ids: list[UUID4] = list(map(lambda x: x[0], questions))
    quiz_questions_with_answers = create_test_quiz_questions_with_answers(
        db, question_ids=question_ids, quiz_id=create_test_quiz_for_qq_with_all_answers
    )

    yield quiz_questions_with_answers
    delete_test_quiz_questions(db)
