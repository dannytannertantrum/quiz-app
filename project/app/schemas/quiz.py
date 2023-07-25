from pydantic import BaseModel, UUID4


class QuizId(BaseModel):
    id: UUID4


class QuizCreate(BaseModel):
    selected_topics: list[UUID4]
