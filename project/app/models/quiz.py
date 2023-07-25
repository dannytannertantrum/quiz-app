from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    UUID,
    sql,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Quiz(Base):
    """
    Quizzes are created once a user selects subtopics
    Fields:
        - id (PK UUID)
        - created_at (datetime)
        - last_modified_at (datetime)
        - completed_at (datetime)
        - score (int)
        - user_id (FK)
    """

    __tablename__ = "quizzes"

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
    completed_at = Column(DateTime(timezone=True), nullable=True)
    score = Column(Integer, nullable=True)
    user_id = Column(UUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    quiz_owner = relationship("User", back_populates="quizzes")
