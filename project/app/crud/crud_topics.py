from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.topic import Topic


def get_topic_by_id(db: Session, topic_id: UUID4) -> Topic:
    """
    Returns topic id if is_deleted is False
    """
    return db.execute(
        select(Topic.id).filter(Topic.id == topic_id, Topic.is_deleted == False)
    ).first()


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
    - The topic_id passed in is the primary topic id
    """
    primary_topic = get_topic_by_id(db, topic_id)
    if not primary_topic:
        return []

    return db.execute(
        select(Topic.id, Topic.title, Topic.description).filter(
            Topic.topic_id == topic_id, Topic.is_deleted == False
        )
    ).all()
