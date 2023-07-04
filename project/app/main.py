import os

from fastapi import Depends, FastAPI
from tortoise.contrib.fastapi import register_tortoise

from app.config import get_settings, Settings

app = FastAPI()


# https://tortoise.github.io/contrib/fastapi.html
# Tortoise automatically cleans the connection up behind the scenes
register_tortoise(
    app,
    db_url=os.environ.get("DATABASE_URL"),
    modules={"models": ["app.models.tortoise"]},
    generate_schemas=False,  # False so a migration tool (Aerich) can do this for us
    add_exception_handlers=True,
)


@app.get("/ping")
async def pong(settings: Settings = Depends(get_settings)):
    return {
        "ping": "pong!",
        "environment": settings.environment,
        "testing": settings.testing,
    }
