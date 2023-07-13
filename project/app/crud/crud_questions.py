from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud import crud_topics
from app.models.question import Question
from app.models.topic import Topic


def get_questions(db: Session) -> list[Question]:
    return db.execute(
        select(
            Question.id,
            Question.answer_options,
            Question.correct_answer,
            Question.question,
            Question.question_type,
            Question.topic_id,
        ).filter(Question.is_deleted == False)
    ).all()


def get_question_by_id(db: Session, question_id: UUID4) -> Question:
    """
    Returns question if is_deleted is False
    """
    return db.execute(
        select(
            Question.id,
            Question.answer_options,
            Question.correct_answer,
            Question.question,
            Question.question_type,
            Question.topic_id,
        ).filter(Question.id == question_id, Question.is_deleted == False)
    ).first()


def get_questions_by_primary_topic_id(
    db: Session, primary_topic_id: UUID4
) -> list[Question]:
    subtopics = crud_topics.get_subtopics(db, primary_topic_id)
    subtopic_ids: list[UUID4] = list(map(lambda x: x[0], subtopics))

    return get_questions_by_subtopic_ids(db, subtopic_ids)


def get_questions_by_subtopic_ids(
    db: Session, subtopic_ids: list[UUID4]
) -> list[Question]:
    """
    Returns a list of questions associated with a subtopic,
    provided that subtopic and its parent are active
    """

    # If parent topic is deleted, don't even both running the query for the subtopic
    parent_topic_id = crud_topics.get_primary_topic_id_by_subtopic_ids(db, subtopic_ids)
    result = crud_topics.get_topic_by_id(db, parent_topic_id)
    if not result:
        return []

    return (
        db.execute(
            select(Question)
            .join(Topic, Question.topic_id == Topic.id)
            .where(
                Topic.id.in_(subtopic_ids),
                Topic.is_deleted == False,
                Question.is_deleted == False,
            )
        )
        .scalars()
        .all()
    )
