import logging
from functools import lru_cache
from uuid import uuid4

from pydantic import AnyUrl, EmailStr, UUID4
from pydantic_settings import BaseSettings

log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    """
    Our base config settings

    Notes:
        - BaseSettings, from pydantic, validates the data so that when we create an instance of Settings,
        environment and testing will have types of str and bool, respectively.
        - BaseSettings automatically reads from env variables
        - In other words, environment: str = "dev" is equivalent to environment: str = os.getenv("ENVIRONMENT", "dev").
        - AnyUrl is a pydantic URL validator
    """

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    DATABASE_URL: AnyUrl = None
    ENVIRONMENT: str = "dev"
    SECRET_KEY: str = "7041b2de450fca0fe128fb5897098945f6daafb1155f83643b4b1fe99f838c25"
    TESTING: bool = bool(0)

    # Used for testing purposes
    TEST_DELETED_PRIMARY_TOPIC_SPORTS_UUID: UUID4 = uuid4()
    TEST_PRIMARY_TOPIC_MOVIES_UUID: UUID4 = uuid4()
    TEST_PRIMARY_TOPIC_MUSIC_UUID: UUID4 = uuid4()
    TEST_PRIMARY_TOPIC_SPORTSBALL_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_COMEDY_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_DRAMA_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_FOOTBALL_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_HOCKEY_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_HORROR_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_METAL_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_SCIFI_UUID: UUID4 = uuid4()
    TEST_SUBTOPIC_TECHNO_UUID: UUID4 = uuid4()
    TEST_USER_UUID: UUID4 = uuid4()

    TEST_USER_EMAIL: EmailStr = "user@example.com"
    TEST_USER_PLAIN_TEXT_PASSWORD: str = "Welcome123"


@lru_cache
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()
