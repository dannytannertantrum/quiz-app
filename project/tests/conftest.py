import os
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.main import app
from app.config import get_settings, Settings


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

    SessionTest = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # For local, we use alembic to migrate and keep records of database changes
    # But for tests, our migrations/versions should reflect our models,
    # so it's easier to create the tables with Base.metadata.create_all(engine)
    Base.metadata.create_all(engine)
    yield SessionTest()
