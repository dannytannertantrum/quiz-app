from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI

from app.api import ping
from app.database import init_db


log = logging.getLogger("uvicorn")


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Starting up...")

    app.include_router(ping.router)
    init_db(app)

    yield

    # After yielding, we clean up and shut down
    log.info("Shutting down...")


app = FastAPI(lifespan=lifespan)
