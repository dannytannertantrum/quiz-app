from pydantic import BaseModel, UUID4


class QuizQuestionBase(BaseModel):
    id: UUID4
