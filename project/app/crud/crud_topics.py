from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.topic import Topic


def get_primary_topics(db: Session) -> list[Topic]:
    """
    This only returns id, title and description because we
    won't need any other fields
    """
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).filter(
            Topic.topic_id == None, Topic.is_deleted == False
        )
    ).all()
