import logging
from functools import lru_cache

from pydantic import BaseSettings


log = logging.getLogger("uvicorn")


# BaseSettings, from pydantic, validates the data so that when we create an instance of Settings,
# environment and testing will have types of str and bool, respectively.
# BaseSettings automatically reads from env variables
# In other words, environment: str = "dev" is equivalent to environment: str = os.getenv("ENVIRONMENT", "dev").
class Settings(BaseSettings):
    environment: str = "dev"
    testing: bool = bool(0)


@lru_cache
def get_settings() -> BaseSettings:
    log.info("Loading config settings from the environment...")
    return Settings()
