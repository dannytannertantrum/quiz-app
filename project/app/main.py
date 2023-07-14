from fastapi import FastAPI

from app.routers import ping, questions, topics


app = FastAPI()

app.include_router(ping.router)
app.include_router(questions.router)
app.include_router(topics.router)
