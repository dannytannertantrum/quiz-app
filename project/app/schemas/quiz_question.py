from typing import Optional

from pydantic import BaseModel, Field, UUID4


class QuizQuestionId(BaseModel):
    id: UUID4


class QuizQuestionUpdateAnswer(BaseModel):
    # For now, users only have a max of 4 answer options
    user_answer: Optional[int] = Field(default=None, le=4)


class QuizQuestionAndAnswers(QuizQuestionId, QuizQuestionUpdateAnswer):
    question: str
    answer_options: list[dict[str, str | int]]
