from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, UUID4

from app.schemas.quiz_question import QuizQuestionFullResponse


class QuizId(BaseModel):
    id: UUID4


class QuizCreate(BaseModel):
    selected_topics: list[UUID4]


class QuizIdWithScore(QuizId):
    user_score: int


class QuizCreateResponse(QuizId):
    quiz_questions: list[QuizQuestionFullResponse]


class QuizWithTopicData(QuizId):
    completed_at: Optional[datetime]
    created_at: datetime
    last_modified_at: Optional[datetime]
    score: Optional[int]
    subtopics: list[str]
    primary_topic: str
    user_id: UUID4


class QuestionsAnswersAndUserAnswer(BaseModel):
    answer_options: list[dict[str, str | int]]
    correct_answer: int = Field(default=None, gt=0, le=4)
    question: str
    question_id: UUID4
    topic: str
    user_answer: Optional[int] = Field(default=None, gt=0, le=4)


class QuizAllData(QuizWithTopicData):
    questions_data: list[QuestionsAnswersAndUserAnswer]
