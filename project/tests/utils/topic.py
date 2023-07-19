from datetime import datetime
from pydantic import UUID4
from typing import Optional
from uuid import uuid4

from sqlalchemy import delete, insert
from sqlalchemy.orm import Session

from app.models.topic import Topic


def create_test_topic(
    db: Session,
    title: str,
    id: Optional[UUID4] = None,
    description: Optional[str] = None,
    is_deleted: Optional[bool] = False,
    parent_topic_id: Optional[UUID4] = None,
) -> Topic:
    """
    For creating subtopics, the topic_id should be the primary topic id
    """
    if not id:
        id = uuid4()

    result = db.execute(
        insert(Topic)
        .values(
            id=id,
            created_at=datetime.utcnow(),
            last_modified_at=None,
            description=description,
            is_deleted=is_deleted,
            title=title,
            parent_topic_id=parent_topic_id,
        )
        .returning(Topic.id, Topic.title, Topic.description, Topic.parent_topic_id)
    )

    db.commit()
    return result.first()


def delete_test_topics(db: Session) -> None:
    db.execute(delete(Topic))
    db.commit()
