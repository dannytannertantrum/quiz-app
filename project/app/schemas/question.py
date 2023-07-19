from pydantic import BaseModel, UUID4


class QuestionBase(BaseModel):
    id: UUID4
    answer_options: list
    question: str
    question_type: str
    topic_id: UUID4
