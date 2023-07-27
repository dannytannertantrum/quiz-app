from typing import Optional

from pydantic import BaseModel, UUID4


class QuizQuestionId(BaseModel):
    id: UUID4


class QuizQuestionUpdateAnswer(BaseModel):
    user_answer: Optional[int]


class QuizQuestionAndAnswers(QuizQuestionId, QuizQuestionUpdateAnswer):
    question: str
    answer_options: list[dict[str, str | int]]
