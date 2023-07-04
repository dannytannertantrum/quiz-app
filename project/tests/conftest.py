import os

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.config import get_settings, Settings


def get_settings_override():
    return Settings(testing=1, database_url=os.environ.get("DATABASE_TEST_URL"))


# Remdiner: scope="module" means the fixture will be invoked once per test module
# It's created for the module, used for all tests, then destroyed after all tests
@pytest.fixture(scope="module")
def test_app():
    # set up - if we drill into dependency_overrides, we can see it's a dict of key/value pairs
    # The key is the dependency name and value is what we'd like to override it with
    app.dependency_overrides[get_settings] = get_settings_override
    with TestClient(app) as test_client:
        # testing
        yield test_client

    # tear down
