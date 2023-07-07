from fastapi import FastAPI

from app.routers import ping, topics


app = FastAPI()

app.include_router(ping.router)
app.include_router(topics.router)
