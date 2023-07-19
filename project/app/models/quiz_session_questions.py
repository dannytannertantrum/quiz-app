from sqlalchemy import Column, ForeignKey, Integer, UUID

from app.database import Base


class QuizSessionQuestions(Base):
    """
    Join table between quiz_sessions and questions
    Fields:
        - id (PK UUID)
        - quiz_session_id (FK)
        - question_id (FK)
        - user_answer (int)
    """

    __tablename__ = "quiz_session_questions"

    id = Column(UUID, primary_key=True, index=True)
    question_id = Column(
        UUID, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False
    )
    quiz_session_id = Column(
        UUID, ForeignKey("quiz_sessions.id", ondelete="CASCADE"), nullable=False
    )
    user_answer = Column(Integer, nullable=True)
