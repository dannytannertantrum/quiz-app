from pydantic import BaseModel, UUID4


class QuizQuestionId(BaseModel):
    id: UUID4
