import random

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_questions, crud_quizzes, crud_quiz_questions
from app.database import get_db
from app.dependencies import get_current_user
from app.models.question import Question
from app.schemas.quiz import QuizCreate
from app.schemas.quiz_question import QuizQuestionBase
from app.schemas.user import UserCurrent


router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"],
    responses={404: {"description": "Quiz not found"}},
)


def choose_random_questions(
    questions: list[Question], picked_questions=[]
) -> list[UUID4]:
    if len(picked_questions) == 5:
        return picked_questions

    question = random.choice(questions)
    if question.id not in picked_questions:
        picked_questions.append(question.id)

    return choose_random_questions(questions, picked_questions)


@router.post(
    "/",
    response_model=list[QuizQuestionBase],
    status_code=status.HTTP_200_OK,
    description="User input is a list of subtopic ids",
)
def create_quiz(
    user_input: QuizCreate,
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> list[QuizQuestionBase]:
    quiz_id = crud_quizzes.create_quiz_in_db(db, current_user["id"])
    questions = crud_questions.get_questions_by_subtopic_ids(
        db, user_input.selected_topics
    )
    if len(questions) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough questions found"
        )

    question_ids = choose_random_questions(questions)
    quiz_question_ids = crud_quiz_questions.create_quiz_question_in_db(
        db, question_ids, quiz_id
    )

    return quiz_question_ids
