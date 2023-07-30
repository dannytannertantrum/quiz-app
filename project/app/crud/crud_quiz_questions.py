from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import case, func, Integer, select
from sqlalchemy.orm import Session

from app.models import Question, Quiz, QuizQuestion
from app.schemas.quiz import QuizIdWithScore
from app.schemas.quiz_question import QuizQuestionUpdateAnswerRequest


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


def get_quiz_questions_by_quiz_id(db: Session, quiz_id: UUID4) -> list[QuizQuestion]:
    """
    Returns a list of Quiz Question records or an empty list if none found
    """
    return (
        db.execute(select(QuizQuestion).where(QuizQuestion.quiz_id == quiz_id))
        .scalars()
        .all()
    )


def get_question_and_user_answer_by_quiz_question_id(
    db: Session, quiz_question_id: UUID4
) -> QuizQuestion:
    """
    Returns the question id and user answer or None if no record found
    """
    return db.execute(
        select(QuizQuestion.question_id, QuizQuestion.user_answer).where(
            QuizQuestion.id == quiz_question_id
        )
    ).first()


def create_quiz_question_in_db(
    db: Session, question_ids: list[UUID4], quiz_id: UUID4
) -> list[QuizQuestion]:
    """
    Creates new QuizQuestion database records and returns them
    """
    for i in question_ids:
        new_quiz_question_id = uuid4()
        new_record = QuizQuestion(
            id=new_quiz_question_id,
            question_id=i,
            quiz_id=quiz_id,
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)

    quiz_question_records = get_quiz_questions_by_quiz_id(db, quiz_id)

    return quiz_question_records


def update_quiz_question_in_db(
    db: Session, user_input: QuizQuestionUpdateAnswerRequest, quiz_question_id: UUID4
) -> QuizQuestion:
    """
    Returns a Quiz Question record or None if no record found
    """
    quiz_question_model: QuizQuestion = (
        db.execute(select(QuizQuestion).where(QuizQuestion.id == quiz_question_id))
        .scalars()
        .first()
    )

    if not quiz_question_model:
        return None

    quiz_question_model.user_answer = user_input.user_answer

    db.add(quiz_question_model)
    db.commit()
    db.refresh(quiz_question_model)

    return quiz_question_model
