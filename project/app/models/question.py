from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    UUID,
    sql,
)
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import relationship

from app.database import Base


class Question(Base):
    """
    Example Question: Who shot Mr. Burns?
    Example Question Type: "multiple choice"
    Fields:
        - id (PK UUID)
        - created_at (datetime)
        - last_modified_at (datetime)
        - answer_options: [
            - {id: int, option: string},
        - ],
        - correct_answer: <id of correct answer>
        - is_deleted (bool)
        - question (str)
        - question_type (str "multiple choice" or "tf")
        - topic_id (FK to topics.id)
    """

    __tablename__ = "questions"

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
    answer_options = Column(MutableList.as_mutable(JSON), nullable=False)
    correct_answer = Column(Integer, nullable=False)
    is_deleted = Column(Boolean, nullable=False)
    question = Column(String(1024), nullable=False)
    question_type = Column(String(20), nullable=False)
    topic_id = Column(UUID, ForeignKey("topics.id"), nullable=False)

    topics = relationship("Topic", back_populates="questions")
