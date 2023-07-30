from datetime import datetime
from typing import Optional

from pydantic import BaseModel, UUID4

from app.schemas.quiz_question import QuizQuestionFullResponse


class QuizId(BaseModel):
    id: UUID4


class QuizCreate(BaseModel):
    selected_topics: list[UUID4]


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
