from fastapi.testclient import TestClient

from app.config import get_settings, Settings
from app.models.user import User


app_config: Settings = get_settings()


class TestAuthRouteFailure:
    def test_get_access_token(self, client: TestClient) -> None:
        login_data = {
            "username": "random_user@example.com",
            "password": "CoolPasswordBrah",
        }
        response = client.post("/auth/token", data=login_data)
        assert response.status_code == 401


class TestAuthRoutesSuccess:
    def test_get_access_token(
        self, client: TestClient, generate_test_user: User
    ) -> None:
        login_data = {
            "username": generate_test_user.email,
            "password": app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
        }
        response = client.post("/auth/token", data=login_data)

        assert response.status_code == 200
        assert "isAuthorized" in response.json()
        assert response.cookies["access_token"] is not None

    def test_delete_access_token_cookie(
        self, client: TestClient, generate_test_user: User, access_token: dict[str, str]
    ) -> None:
        assert client.cookies["access_token"] is not None
        assert len(client.cookies) > 0

        response = client.post("/auth/sign-out", headers=access_token)

        assert response.status_code == 200
        assert response.json() == {"isAuthorized": False}
        assert len(response.cookies) == 0
