from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, UUID, sql
from sqlalchemy.orm import relationship

from app.database import Base


class Topic(Base):
    """
    Example Topics: Movies, Sportsball, Music
    Example subtopics: horror, sci-fi, baseball \n
    Fields:
        - id (PK)
        - created_at
        - last_modified_at
        - description
        - is_deleted
        - title
        - parent_topic_id (self join for subtopics)
    """

    __tablename__ = "topics"

    id = Column(UUID, primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=sql.func.now(),
    )
    last_modified_at = Column(
        DateTime(timezone=True),
        nullable=True,
        onupdate=datetime.utcnow,
        server_onupdate=sql.func.now(),
    )
    description = Column(String(250), nullable=True)
    is_deleted = Column(Boolean, nullable=False)
    title = Column(String(128), nullable=False)
    parent_topic_id = Column(UUID, ForeignKey("topics.id"), nullable=True)

    # https://docs.sqlalchemy.org/en/20/orm/self_referential.html
    sub_topic = relationship("Topic")
    questions = relationship("Question", back_populates="topics")
