from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    UUID,
    sql,
)
from sqlalchemy.orm import relationship

from app.database import Base


class QuizSession(Base):
    """
    Quiz Sessions are created once a user selects subtopics
    Fields:
        - id (PK UUID)
        - created_at (datetime)
        - last_modified_at (datetime)
        - completed_at (datetime)
        - score (int)
        - user_id (FK)
    """

    __tablename__ = "quiz_sessions"

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
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)

    quiz_session_owner = relationship("User", back_populates="quiz_sessions")
