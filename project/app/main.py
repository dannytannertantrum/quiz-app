from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI

from app.api import ping
from app.database import init_db


log = logging.getLogger("uvicorn")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    This "lifespan" function under the asynccontextmanager decorator is how FastAPI
    defines code that should be executed before the app starts up and code that should
    be executed when the app is shutting down
    """
    log.info("Starting up...")

    app.include_router(ping.router)
    init_db(app)

    yield

    # After yielding, we clean up and shut down
    log.info("Shutting down...")


# https://fastapi.tiangolo.com/advanced/events/ - see docstrings above
app = FastAPI(lifespan=lifespan)
