from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, String, UUID, sql

from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """
    Fields:
        - id (PK UUID)
        - created_at (datetime)
        - last_modified_at (datetime)
        - is_deleted (bool)
        - email (str)
        - hashed_password (str)
    """

    __tablename__ = "users"

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
    is_deleted = Column(Boolean, nullable=False)
    email = Column(String(128), nullable=False)
    hashed_password = Column(String(256), nullable=False)

    quizzes = relationship("Quiz", back_populates="quiz_owner")
