from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, UUID4
from sqlalchemy.orm import Session

from app.crud import crud_topics
from app.database import get_db


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


# Homepage will display all primary topics
@router.get(
    "/", response_model=list[TopicWithDescription], status_code=status.HTTP_200_OK
)
def read_primary_topics(db: Session = Depends(get_db)) -> list[TopicWithDescription]:
    topics = crud_topics.get_primary_topics(db)
    if not topics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No topics found"
        )

    return topics


# After selecting a primary topic, user will see subtopics for quiz selection
@router.get(
    "/{topic_id}",
    response_model=list[TopicWithDescription],
    status_code=status.HTTP_200_OK,
)
def read_subtopics(
    topic_id: UUID4, db: Session = Depends(get_db)
) -> list[TopicWithDescription]:
    subtopics = crud_topics.get_subtopics(db, topic_id)
    if not subtopics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No subtopics associated with topic id: {topic_id}",
        )

    return subtopics
