from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    """
    id (PK)
    created_at
    last_modified_at
    description
    is_deleted
    title
    topic_id (self join for subtopics)
    """

    id = Column(UUID, primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, onupdate=datetime.utcnow
    )
    last_modified_at = Column(DateTime(timezone=True), nullable=True)
    description = Column(String(250), nullable=True)
    is_deleted = Column(Boolean, nullable=False)
    title = Column(String(128), nullable=False)
    topic_id = Column(UUID, ForeignKey("topics.id"), nullable=True)

    # https://docs.sqlalchemy.org/en/20/orm/self_referential.html
    sub_topic = relationship("topics")
