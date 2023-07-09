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
    description: Optional[str] = None,
    topic_id: Optional[UUID4] = None,
) -> UUID4:
    result = db.execute(
        insert(Topic)
        .values(
            id=uuid4(),
            created_at=datetime.utcnow(),
            last_modified_at=None,
            description=description,
            is_deleted=False,
            title=title,
            topic_id=topic_id,
        )
        .returning(Topic.id)
    )

    db.commit()
    return result.scalar()


def delete_test_topics(db: Session) -> None:
    db.execute(delete(Topic))
    db.commit()
