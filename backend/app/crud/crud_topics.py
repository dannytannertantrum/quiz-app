from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.topic import Topic


def get_all_topics(db: Session) -> list[Topic]:
    """
    Returns all active primary topics and subtopics or an empty list if none found
    """
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).where(
            Topic.is_deleted == False
        )
    ).all()


def get_topic_by_id(db: Session, topic_id: UUID4) -> Topic:
    """
    Returns topic id, title and description if is_deleted is False or None if no record found
    """
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).where(
            Topic.id == topic_id, Topic.is_deleted == False
        )
    ).first()


def get_primary_topics(db: Session) -> list[Topic]:
    """
    Returns a list of ids, titles and descriptions or an empty list if none found
    """
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).where(
            Topic.parent_topic_id == None, Topic.is_deleted == False
        )
    ).all()


def get_subtopics(db: Session, primary_topic_id: UUID4) -> list[Topic]:
    """
    Returns a list of ids, titles and descriptions or an empty list if none found
    - The topic_id passed in is the primary topic id
    """
    primary_topic = get_topic_by_id(db, primary_topic_id)
    if not primary_topic:
        return []

    return db.execute(
        select(Topic.id, Topic.title, Topic.description, Topic.parent_topic_id).where(
            Topic.parent_topic_id == primary_topic_id, Topic.is_deleted == False
        )
    ).all()


def get_primary_topic_id_by_subtopic_ids(
    db: Session, subtopic_ids: list[UUID4]
) -> Topic:
    """
    Returns a primary topic id or None if no record found
    """
    return db.execute(
        select(Topic.parent_topic_id).where(Topic.id.in_(subtopic_ids))
    ).scalar()
