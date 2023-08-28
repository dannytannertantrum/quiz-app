import random
import string

from fastapi.testclient import TestClient


def random_lower_string() -> str:
    return "".join(random.choices(string.ascii_lowercase, k=32))


def get_token_from_cookies(
    client: TestClient, email: str, password: str
) -> dict[str, str]:
    login_data = {
        "username": email,
        "password": password,
    }
    response = client.post("/auth/token", data=login_data)
    return response.cookies
