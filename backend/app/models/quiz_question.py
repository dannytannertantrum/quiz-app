from sqlalchemy import Column, ForeignKey, Integer, UUID

from app.database import Base


class QuizQuestion(Base):
    """
    Join table between quizzes and questions
    Fields:
        - id (PK UUID)
        - quiz_id (FK)
        - question_id (FK)
        - user_answer (int)
    """

    __tablename__ = "quiz_questions"

    id = Column(UUID, primary_key=True, index=True)
    question_id = Column(
        UUID, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False
    )
    quiz_id = Column(UUID, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    user_answer = Column(Integer, nullable=True)
