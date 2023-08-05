from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_topics
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.topic import TopicWithDescription
from app.schemas.user import UserCurrent


router = APIRouter(
    prefix="/topics",
    tags=["topics"],
    responses={404: {"description": "Topic not found"}},
)


# Return all topics - likely not a use case for the front-end
@router.get(
    "/",
    response_model=list[TopicWithDescription],
    status_code=status.HTTP_200_OK,
)
def read_all_topics(
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> list[TopicWithDescription]:
    topics = crud_topics.get_all_topics(db)
    if not topics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No topics found"
        )

    return topics


# Homepage will display all primary topics
@router.get(
    "/primary-topics",
    response_model=list[TopicWithDescription],
    status_code=status.HTTP_200_OK,
)
def read_primary_topics(
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> list[TopicWithDescription]:
    topics = crud_topics.get_primary_topics(db)
    if not topics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No primary topics found"
        )

    return topics


# After selecting a primary topic, user will see subtopics for quiz selection
@router.get(
    "/primary-topics/{primary_topic_id}",
    response_model=list[TopicWithDescription],
    status_code=status.HTTP_200_OK,
)
def read_subtopics(
    primary_topic_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> list[TopicWithDescription]:
    subtopics = crud_topics.get_subtopics(db, primary_topic_id)
    if not subtopics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No subtopics associated with topic id: {primary_topic_id}",
        )

    return subtopics


# Return one topic via id
@router.get(
    "/{topic_id}",
    response_model=TopicWithDescription,
    status_code=status.HTTP_200_OK,
)
def read_topic_by_id(
    topic_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> TopicWithDescription:
    topic = crud_topics.get_topic_by_id(db, topic_id)
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No topic found with topic id: {topic_id}",
        )

    return topic
