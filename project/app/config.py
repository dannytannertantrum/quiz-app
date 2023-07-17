import logging
from functools import lru_cache

from pydantic import AnyUrl, EmailStr
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
    TEST_USER_EMAIL: EmailStr = "user@example.com"
    TEST_USER_PLAIN_TEXT_PASSWORD: str = "Welcome123"


@lru_cache
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()
