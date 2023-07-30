from datetime import datetime
from typing import Optional
from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import distinct, select, func
from sqlalchemy.orm import aliased, Session

from app.models.question import Question
from app.models.quiz import Quiz
from app.models.quiz_question import QuizQuestion
from app.models.topic import Topic
from app.schemas.quiz import QuizId, QuizWithTopicData


def get_quiz_by_id(db: Session, quiz_id: UUID4) -> Quiz:
    """
    Returns a full Quiz record or None if no record found
    """
    return db.execute(select(Quiz).where(Quiz.id == quiz_id)).scalars().first()


def get_all_quizzes_with_topic_data_by_user_id(
    db: Session, user_id: UUID4
) -> list[QuizWithTopicData]:
    """
    Returns a list of Quiz records by user id with the following additional fields returned:
    - subtopics (a list of subtopics associated with each quiz)
    - primary_topic (name of the primary topic for each quiz)

    If no records found, returns an empty list

    SELECT DISTINCT ON (quizzes.id) quizzes.*, ARRAY_AGG(DISTINCT t1.title) AS subtopics, t2.title AS primary_topic
        FROM quizzes
        JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
        JOIN questions ON quiz_questions.question_id = questions.id
        JOIN topics t1 ON questions.topic_id = t1.id
        JOIN topics t2 ON t1.parent_topic_id = t2.id
        WHERE quizzes.user_id=user_id
        GROUP BY quizzes.id, quizzes.*, t2.title;
    """

    t1 = aliased(Topic)
    t2 = aliased(Topic)

    return db.execute(
        select(
            Quiz.id,
            Quiz.created_at,
            Quiz.completed_at,
            Quiz.last_modified_at,
            Quiz.score,
            Quiz.user_id,
            func.array_agg(distinct(t1.title)).label("subtopics"),
            t2.title.label("primary_topic"),
        )
        .distinct(Quiz.id)
        .join(QuizQuestion, Quiz.id == QuizQuestion.quiz_id)
        .join(Question, QuizQuestion.question_id == Question.id)
        .join(t1, Question.topic_id == t1.id)
        .join(t2, t1.parent_topic_id == t2.id)
        .where(Quiz.user_id == user_id)
        .group_by(
            Quiz.id,
            Quiz.created_at,
            Quiz.completed_at,
            Quiz.last_modified_at,
            Quiz.score,
            Quiz.user_id,
            t2.title,
        )
    ).all()


def create_quiz_in_db(db: Session, user_id: UUID4) -> QuizId:
    """
    Creates a new Quiz record in the database and returns its id
    """
    new_quiz_id = uuid4()
    new_quiz = Quiz(id=new_quiz_id, user_id=user_id)

    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return new_quiz_id


def update_quiz_in_db(
    db: Session,
    quiz_id: UUID4,
    last_modified_at: datetime,
    completed_at: Optional[datetime] = None,
    score: Optional[int] = None,
):
    """
    Updates a Quiz record in the following scenarios:
    1. Every time a user submits an answer on a quiz, a quiz question
    record is updated and therefore, we need to update last_modified_at
    2. When the user submits the last question, a score is calculated and
    last_modified_at, completed_at and score get upserted
    """
    quiz_model: Quiz = (
        db.execute(select(Quiz).where(Quiz.id == quiz_id)).scalars().first()
    )
    quiz_model.last_modified_at = last_modified_at
    quiz_model.completed_at = completed_at
    quiz_model.score = score

    db.add(quiz_model)
    db.commit()
    db.refresh(quiz_model)

    return quiz_model
