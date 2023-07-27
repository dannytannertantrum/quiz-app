from pydantic import BaseModel, UUID4


class QuizQuestionId(BaseModel):
    id: UUID4


class QuizQuestionAndAnswers(QuizQuestionId):
    question: str
    answer_options: list[dict[str, str | int]]
