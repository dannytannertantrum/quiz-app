from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.topic import Topic


def get_primary_topics(db: Session) -> list[Topic]:
    """
    This only returns id, title and description
    """
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).filter(
            Topic.topic_id == None, Topic.is_deleted == False
        )
    ).all()


def get_subtopics(db: Session, topic_id: UUID4) -> list[Topic]:
    """
    This only returns id, title and description
    """
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).filter(
            Topic.topic_id == topic_id, Topic.is_deleted == False
        )
    ).all()
