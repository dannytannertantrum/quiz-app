from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, ping, questions, quizzes, quiz_questions, topics, users

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Set-Cookie",
        "Access-Control-Allow-Headers",
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
    ],
)

app.include_router(auth.router)
app.include_router(ping.router)
app.include_router(questions.router)
app.include_router(quizzes.router)
app.include_router(quiz_questions.router)
app.include_router(topics.router)
app.include_router(users.router)
