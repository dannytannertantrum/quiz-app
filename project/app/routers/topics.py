from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, UUID4
from sqlalchemy.orm import Session

from app.database import get_db
from app.crud import crud_topics


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


# homepage will display all primary topics
@router.get(
    "/", response_model=list[TopicWithDescription], status_code=status.HTTP_200_OK
)
def read_primary_topics(db: Session = Depends(get_db)):
    topics = crud_topics.get_primary_topics(db)
    if not topics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No topics found"
        )

    return topics
