from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.topic import Topic


def get_primary_topics(db: Session):
    return db.execute(
        select(Topic.id, Topic.title, Topic.description).filter(
            Topic.topic_id == None, Topic.is_deleted == False
        )
    ).all()
