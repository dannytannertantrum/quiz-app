from datetime import datetime
from typing import Optional
from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import case, delete, distinct, func, Integer, select
from sqlalchemy.orm import aliased, Session

from app.models.question import Question
from app.models import Question, Quiz
from app.models.quiz_question import QuizQuestion
from app.models.topic import Topic
from app.schemas.quiz import QuizAllData, QuizId, QuizIdWithScore, QuizWithTopicData


def calculate_user_score(db: Session, quiz_id: UUID4) -> QuizIdWithScore:
    """
    Compares user submitted answer ids to correct answer ids
    and calculates a score based on how many they got right

    Returns a "user_score" aliased column

    SELECT
        SUM(CASE WHEN quiz_questions.user_answer = questions.correct_answer THEN 1 ELSE 0 END)
        * 100 / COUNT(quiz_questions.question_id) AS user_score
        FROM quizzes
        JOIN quiz_questions ON quizzes.id = quiz_questions.quiz_id
        JOIN questions questions ON quiz_questions.question_id = questions.id
        WHERE quizzes.id = quiz_id;

    Also, I hate SQLAlchemy
    """
    return db.execute(
        select(
            Quiz.id,
            (
                func.cast(
                    func.sum(
                        case(
                            (
                                QuizQuestion.user_answer == Question.correct_answer,
                                1,
                            ),
                            else_=0,
                        )
                    )
                    * 100
                    / func.count(QuizQuestion.question_id),
                    Integer,
                )
            ).label("user_score"),
        )
        .join(QuizQuestion, Quiz.id == QuizQuestion.quiz_id)
        .join(Question, QuizQuestion.question_id == Question.id)
        .where(Quiz.id == quiz_id)
        .group_by(Quiz.id)
    ).first()


def get_quiz_by_id(db: Session, quiz_id: UUID4) -> Quiz:
    """
    Returns a full Quiz record or None if no record found
    """
    return db.execute(select(Quiz).where(Quiz.id == quiz_id)).scalars().first()


def get_quiz_with_topic_data_by_quiz_id(
    db: Session, quiz_id: UUID4
) -> QuizWithTopicData:
    """
    Returns a Quiz record by quiz id with the following additional fields returned:
    - subtopics (a list of subtopics associated with the quiz)
    - primary_topic (name of the primary topic for the quiz)

    If no record found, returns None
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
        .where(Quiz.id == quiz_id)
        .group_by(
            Quiz.id,
            Quiz.created_at,
            Quiz.completed_at,
            Quiz.last_modified_at,
            Quiz.score,
            Quiz.user_id,
            t2.title,
        )
    ).first()


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


def get_quiz_with_all_questions_answers_and_topics(
    db: Session, quiz_id: UUID4
) -> QuizAllData:
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
            t2.title.label("primary_topic"),
            func.array_agg(distinct(t1.title)).label("subtopics"),
            func.json_agg(
                func.json_build_object(
                    "question_id",
                    Question.id,
                    "question",
                    Question.question,
                    "answer_options",
                    Question.answer_options,
                    "correct_answer",
                    Question.correct_answer,
                    "topic",
                    t1.title,
                    "user_answer",
                    QuizQuestion.user_answer,
                )
            ).label("questions_data"),
        )
        .join(QuizQuestion, Quiz.id == QuizQuestion.quiz_id)
        .join(Question, QuizQuestion.question_id == Question.id)
        .join(t1, Question.topic_id == t1.id)
        .join(t2, t1.parent_topic_id == t2.id)
        .where(Quiz.id == quiz_id)
        .group_by(Quiz.id, t2.title)
    ).first()


def create_quiz_in_db(
    db: Session,
    user_id: UUID4,
    last_modified_at: Optional[datetime] = None,
    completed_at: Optional[datetime] = None,
    score: Optional[int] = None,
) -> QuizId:
    """
    Creates a new Quiz record in the database and returns its id
    """
    new_quiz_id = uuid4()
    new_quiz = Quiz(
        id=new_quiz_id,
        user_id=user_id,
        last_modified_at=last_modified_at,
        completed_at=completed_at,
        score=score,
    )

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
) -> None:
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

    if not quiz_model:
        return None

    quiz_model.last_modified_at = last_modified_at
    quiz_model.completed_at = completed_at
    quiz_model.score = score

    db.add(quiz_model)
    db.commit()
    db.refresh(quiz_model)


def delete_quiz_in_db(db: Session, quiz_id: UUID4) -> None:
    db.execute(delete(Quiz).where(Quiz.id == quiz_id))
    db.commit()
