from typing import Optional

from pydantic import BaseModel, Field, UUID4


class QuizQuestionId(BaseModel):
    id: UUID4


class QuizQuestionFullResponse(QuizQuestionId):
    question_id: UUID4
    quiz_id: UUID4
    user_answer: Optional[int] = Field(default=None, le=4)


class QuizQuestionUpdateAnswerRequest(QuizQuestionId):
    # For now, users only have a max of 4 answer options
    user_answer: Optional[int] = Field(default=None, le=4)


class QuizQuestionAndAnswers(QuizQuestionUpdateAnswerRequest):
    question: str
    answer_options: list[dict[str, str | int]]


class QuizQuestionAllData(QuizQuestionFullResponse):
    question: str
    answer_options: list[dict[str, str | int]]
    question_type: str
    topic: str
