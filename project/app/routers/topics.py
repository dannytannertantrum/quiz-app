from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.topic import Topic


router = APIRouter(
    prefix="/topics",
    tags=["topics"],
    responses={404: {"description": "Topic not found"}},
)


class TopicBase(BaseModel):
    id: UUID4
    title: str


class TopicWithDescription(TopicBase):
    description: Optional[str]


class TopicResponseSchema(TopicWithDescription):
    created_at: datetime
    last_modified_at: Optional[datetime]
    is_deleted: bool
    topic_id: Optional[UUID4]


# homepage will display all primary topics
@router.get(
    "/", response_model=list[TopicResponseSchema], status_code=status.HTTP_200_OK
)
def get_primary_topics(db: Session = Depends(get_db)):
    topics = db.execute(select(Topic).filter(Topic.topic_id == None)).scalars().all()
    if not topics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No topics found"
        )

    return topics
