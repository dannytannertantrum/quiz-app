from fastapi import FastAPI

from app.routers import auth, ping, questions, quizzes, topics, users


app = FastAPI()

app.include_router(auth.router)
app.include_router(ping.router)
app.include_router(questions.router)
app.include_router(quizzes.router)
app.include_router(topics.router)
app.include_router(users.router)
