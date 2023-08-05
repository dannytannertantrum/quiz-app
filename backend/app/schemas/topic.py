from typing import Optional
from pydantic import BaseModel, UUID4


class TopicBase(BaseModel):
    id: UUID4
    title: str


class TopicWithDescription(TopicBase):
    description: Optional[str]
