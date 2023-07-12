from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud import crud_topics
from app.models.question import Question
from app.models.topic import Topic


def get_questions_by_topic_id(db: Session, subtopic_id: UUID4) -> list[Question]:
    """
    Returns a list of questions associated with a subtopic,
    provided that subtopic and its parent are active
    """

    # If parent topic is deleted, don't even both running the query for the subtopic
    parent_topic_id = db.execute(
        select(Topic.topic_id).filter(Topic.id == subtopic_id)
    ).scalar()
    result = crud_topics.get_topic_by_id(db, parent_topic_id)
    if not result:
        return []

    return db.execute(
        select(Question)
        .join(Topic, Question.topic_id == Topic.id)
        .where(
            Topic.id == subtopic_id,
            Topic.is_deleted == False,
            Question.is_deleted == False,
        )
    ).all()
