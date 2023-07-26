from pydantic import BaseModel, UUID4


class QuizId(BaseModel):
    id: UUID4


class QuizCreate(BaseModel):
    selected_topics: list[UUID4]


class QuizCreateResponse(BaseModel):
    quiz_id: UUID4
    quiz_question_ids: list[UUID4]
