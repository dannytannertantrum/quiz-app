from pydantic import BaseModel, UUID4


class QuestionBase(BaseModel):
    id: UUID4
    answer_options: list
    correct_answer: int
    question: str
    question_type: str
    topic_id: UUID4
