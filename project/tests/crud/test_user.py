from uuid import uuid4

from sqlalchemy.orm import Session

from app.crud import crud_users
from app.models import User
from app.schemas.user import UserCreate, UserUpdate
from app.security import verify_password

from tests.utils.user import create_test_user, delete_test_users


class TestCrudUserNotReturningData:
    def test_get_user_by_id_marked_is_deleted_returns_no_result(
        self, db: Session
    ) -> None:
        user_id = uuid4()
        try:
            create_test_user(
                db,
                id=user_id,
                email="user@example.com",
                password="Welcome123",
                is_deleted=True,
            )
            result = crud_users.get_user_by_id(db, user_id)

            assert result is None
        finally:
            delete_test_users(db)

    def test_get_user_by_email_marked_is_deleted_returns_no_result(
        self, db: Session
    ) -> None:
        user_email = "user@example.com"
        try:
            create_test_user(
                db,
                email=user_email,
                password="Welcome123",
                is_deleted=True,
            )
            result = crud_users.get_user_by_email(db, user_email)

            assert result is None
        finally:
            delete_test_users(db)

    def test_update_user_with_incorrect_current_password_returns_False(
        self, db: Session
    ) -> None:
        user_id = uuid4()
        email = "user@example.com"
        current_password = "Welcome123"
        user_input = UserUpdate(
            email=email,
            current_password="thisIsDifferent",
            new_password="samePassword",
            confirm_new_password="samePassword",
        )
        try:
            create_test_user(
                db,
                id=user_id,
                email=email,
                password=current_password,
            )
            result = crud_users.update_user_in_db(
                db, user_id=user_id, user_input=user_input
            )

            assert result is False
        finally:
            delete_test_users(db)

    def test_update_user_with_incorrect_matching_passwords_returns_False(
        self, db: Session
    ) -> None:
        user_id = uuid4()
        email = "user@example.com"
        current_password = "Welcome123"
        user_input = UserUpdate(
            email=email,
            current_password=current_password,
            new_password="thisPassword",
            confirm_new_password="doesNotMatchThisOne",
        )
        try:
            create_test_user(
                db,
                id=user_id,
                email=email,
                password=current_password,
            )
            result = crud_users.update_user_in_db(
                db, user_id=user_id, user_input=user_input
            )

            assert result is False
        finally:
            delete_test_users(db)

    def test_authenticate_user_returns_False_if_email_does_not_exist(
        self, db: Session
    ) -> None:
        user_id = uuid4()
        user_email = "user@example.com"
        user_password = "Welcome123"
        wrong_email = "this@wontwork.net"
        try:
            create_test_user(
                db,
                id=user_id,
                email=user_email,
                password=user_password,
                is_deleted=False,
            )
            result = crud_users.authenticate_user(
                db, email=wrong_email, password=user_password
            )

            assert result is False
        finally:
            delete_test_users(db)

    def test_authenticate_user_returns_False_if_user_is_marked_deleted(
        self, db: Session
    ) -> None:
        user_id = uuid4()
        user_email = "user@example.com"
        user_password = "Welcome123"
        try:
            create_test_user(
                db,
                id=user_id,
                email=user_email,
                password=user_password,
                is_deleted=True,
            )
            result = crud_users.authenticate_user(
                db, email=user_email, password=user_password
            )

            assert result is False
        finally:
            delete_test_users(db)

    def test_authenticate_user_returns_False_if_password_does_not_match_hashed_version_of_password(
        self, db: Session
    ) -> None:
        user_email = "user@example.com"
        user_password = "Welcome123"
        wrong_password = "wrong!!!!"
        try:
            create_test_user(
                db,
                email=user_email,
                password=user_password,
                is_deleted=True,
            )
            result = crud_users.authenticate_user(
                db, email=user_email, password=wrong_password
            )

            assert result is False
        finally:
            delete_test_users(db)

    def test_delete_user_with_hard_delete_completely_removes_user_record(
        self, db: Session
    ) -> None:
        user_id = uuid4()
        user_email = "delete@test.tv"
        try:
            create_test_user(
                db,
                id=user_id,
                email=user_email,
                password="Whatever",
                is_deleted=False,
            )
            user_exists = crud_users.get_user_by_id(db, user_id=user_id)
            assert user_exists is not None

            crud_users.delete_user_in_db(db, user_id=user_id, is_hard_delete=True)
            user_still_exists = crud_users.get_user_by_id(db, user_id=user_id)

            assert user_still_exists is None
        finally:
            delete_test_users(db)

    def test_delete_user_with_soft_delete_keeps_user_record(self, db: Session) -> None:
        user_id = uuid4()
        user_email = "delete@testButKeep.com"
        try:
            create_test_user(
                db,
                id=user_id,
                email=user_email,
                password="Whatever",
                is_deleted=False,
            )
            user_exists = crud_users.get_user_by_id(db, user_id=user_id)
            assert user_exists is not None

            crud_users.delete_user_in_db(db, user_id=user_id, is_hard_delete=False)
            user_still_exists = crud_users.get_user_by_id(
                db, user_id=user_id, check_for_deleted_users=True
            )

            assert user_still_exists is not None
        finally:
            delete_test_users(db)


class TestCrudUserReturningData:
    def test_get_user_by_id(self, db: Session, generate_test_user: User) -> None:
        result = crud_users.get_user_by_id(db, generate_test_user.id)

        assert result.id is not None
        assert result.email == generate_test_user.email
        assert result.hashed_password == generate_test_user.hashed_password

    def test_get_user_by_email(self, db: Session, generate_test_user: User) -> None:
        result = crud_users.get_user_by_email(db, generate_test_user.email)

        assert result.id is not None
        assert result.email == generate_test_user.email
        assert result.hashed_password == generate_test_user.hashed_password

    def test_create_user(self, db: Session) -> None:
        user_input = UserCreate(email="myNewUser@example.com", password="myPassword")
        result = crud_users.create_user_in_db(db, user_input=user_input)

        assert result.id is not None
        assert result.email == "myNewUser@example.com"
        assert verify_password("myPassword", result.hashed_password)
        assert result.created_at is not None
        assert result.last_modified_at is None

    def test_update_user(self, db: Session, generate_test_user: User) -> None:
        plain_password = "ThisIsANewPassword"
        user_input = UserUpdate(
            email=generate_test_user.email,
            current_password="Welcome123",
            new_password=plain_password,
            confirm_new_password=plain_password,
        )
        result = crud_users.update_user_in_db(
            db, generate_test_user.id, user_input=user_input
        )

        assert verify_password(
            plain_password=plain_password, hashed_password=result.hashed_password
        )

    def test_authenticate_user(self, db: Session, generate_test_user: User) -> None:
        plain_text_password_of_generated_user = "Welcome123"
        result = crud_users.authenticate_user(
            db,
            email=generate_test_user.email,
            password=plain_text_password_of_generated_user,
        )

        assert result.id == generate_test_user.id
        assert result.email == generate_test_user.email
        assert result.hashed_password == generate_test_user.hashed_password
