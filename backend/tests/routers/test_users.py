from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.config import get_settings, Settings
from app.crud import crud_users
from app.models.user import User
from app.security import verify_password
from tests.utils.user import delete_test_users


app_config: Settings = get_settings()


class TestUserRoutesFailure:
    def test_read_all_users_when_no_users_exist_returns_empty_array(
        self,
        client: TestClient,
    ) -> None:
        response = client.get("/users/")
        users = response.json()

        assert response.status_code == 200
        assert users == []

    def test_create_user_with_existing_email_raises_exception(
        self, client: TestClient, generate_test_user: User
    ) -> None:
        user_input = {"username": generate_test_user.email, "password": "HelloWorld"}
        response = client.post("/users/", json=user_input)

        assert response.status_code == 400
        assert response.json() == {
            "detail": "A user with this email already exists in the system."
        }

    def test_create_user_with_password_less_than_8_characters_raises_exception(
        self, client: TestClient
    ) -> None:
        user_input = {"username": "test@example.com", "password": "Hello"}
        response = client.post("/users/", json=user_input)

        assert response.status_code == 422

    def test_create_user_with_invalid_email_raises_exception(
        self, client: TestClient
    ) -> None:
        user_input = {"username": "bademail.com", "password": "HELLOWORLD!!"}
        response = client.post("/users/", json=user_input)

        assert response.status_code == 422

    def test_update_user_with_password_less_than_8_characters_raises_exception(
        self,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        user_id = generate_test_user.id
        user_input = {
            "email": generate_test_user.email,
            "current_password": app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
            "new_password": "Hello",
            "confirm_new_password": "Hello",
        }

        response = client.put(
            f"/users/{user_id}", headers=access_token, json=user_input
        )

        assert response.status_code == 422

    def test_update_user_with_wrong_current_password_raises_exception(
        self,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        user_id = generate_test_user.id
        user_input = {
            "email": generate_test_user.email,
            "current_password": "ThisIsWrong",
            "new_password": "TheseMatch",
            "confirm_new_password": "TheseMatch",
        }

        response = client.put(
            f"/users/{user_id}", headers=access_token, json=user_input
        )

        assert response.status_code == 400
        assert response.json() == {
            "detail": "There was a problem with the request. Please try again"
        }

    def test_update_user_with_wrong_matching_passwords_raises_exception(
        self,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        user_id = generate_test_user.id
        user_input = {
            "email": generate_test_user.email,
            "current_password": app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
            "new_password": "ThisPassword",
            "confirm_new_password": "DoesNotMatchThisOne",
        }

        response = client.put(
            f"/users/{user_id}", headers=access_token, json=user_input
        )

        assert response.status_code == 400
        assert response.json() == {
            "detail": "There was a problem with the request. Please try again"
        }

    def test_user_routes_without_token_headers_raises_unauthorized_exception(
        self,
        client: TestClient,
        generate_test_user: User,
    ) -> None:
        client_without_cookies = client
        client_without_cookies.cookies = None

        response_get = client_without_cookies.get("users/me")
        assert response_get.status_code == 401

        response_put = client_without_cookies.put(f"/users/{uuid4()}")
        assert response_put.status_code == 401

        response_delete = client_without_cookies.delete(f"/users/{uuid4()}")
        assert response_delete.status_code == 401


class TestUserRoutesSuccess:
    def test_read_all_users(self, client: TestClient, generate_test_user: User) -> None:
        response = client.get("/users/")
        # It would normally be plural, but we're only passing in one user
        user = response.json()

        assert response.status_code == 200
        assert len(user) == 1
        assert isinstance(user[0], str)

    def test_create_user(self, db: Session, client: TestClient) -> None:
        user_input = {
            "username": "myEmail@example.com",
            "password": "MyCoolPassword",
        }
        try:
            response = client.post("/users/", json=user_input)
            new_user: User = response.json()

            assert response.status_code == 201
            assert new_user["id"] is not None
            assert new_user["email"] == user_input["username"]
        finally:
            delete_test_users(db)

    def test_read_users_me(
        self,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        response = client.get("/users/me", headers=access_token)
        user = response.json()

        assert response.status_code == 200
        assert user["id"] is not None
        assert user["email"] == generate_test_user.email
        assert user["created_at"] is not None

    def test_update_user(
        self,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        user_id = generate_test_user.id
        new_password = "MatchingNewPassword"
        user_input = {
            "email": generate_test_user.email,
            "current_password": app_config.TEST_USER_PLAIN_TEXT_PASSWORD,
            "new_password": new_password,
            "confirm_new_password": new_password,
        }

        response = client.put(
            f"/users/{user_id}", headers=access_token, json=user_input
        )
        updated_user = response.json()

        assert response.status_code == 200
        assert verify_password(
            plain_password=new_password, hashed_password=updated_user["hashed_password"]
        )

    def test_delete_user_soft(
        self,
        db: Session,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        try:
            response = client.delete(
                f"/users/{generate_test_user.id}", headers=access_token
            )
            response_message = response.json()
            user_marked_deleted = crud_users.get_user_by_id(
                db, user_id=generate_test_user.id, check_for_deleted_users=True
            )

            assert response.status_code == 200
            assert user_marked_deleted is not None
            assert (
                response_message["message"]
                == f"Account with email {generate_test_user.email} has been deactivated"
            )
        finally:
            delete_test_users(db)

    def test_delete_user_hard(
        self,
        db: Session,
        client: TestClient,
        generate_test_user: User,
        access_token: dict[str, str],
    ) -> None:
        try:
            response = client.delete(
                f"/users/{generate_test_user.id}?is_hard_delete=True",
                headers=access_token,
            )
            response_message = response.json()

            is_user_still_there = crud_users.get_user_by_id(
                db, user_id=generate_test_user.id
            )
            assert is_user_still_there is None
            assert response.status_code == 200
            assert (
                response_message["message"]
                == f"Account with email {generate_test_user.email} has been fully dropped from our database records"
            )
        finally:
            delete_test_users(db)
