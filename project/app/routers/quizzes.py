from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_questions, crud_quizzes, crud_quiz_questions
from app.database import get_db
from app.dependencies import get_current_user
from app.helper_functions import choose_random_questions
from app.schemas.quiz import QuizCreate, QuizCreateResponse
from app.schemas.user import UserCurrent


router = APIRouter(
    prefix="/quizzes",
    tags=["quizzes"],
    responses={404: {"description": "Quiz not found"}},
)


@router.post(
    "/",
    response_model=QuizCreateResponse,
    status_code=status.HTTP_201_CREATED,
    description="User input is a list of subtopic ids",
)
def create_quiz(
    user_input: QuizCreate,
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> QuizCreateResponse:
    quiz_id = crud_quizzes.create_quiz_in_db(db, current_user["id"])
    questions = crud_questions.get_questions_by_subtopic_ids(
        db, user_input.selected_topics
    )
    if len(questions) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough questions found"
        )

    question_ids = choose_random_questions(questions, picked_questions=[])
    quiz_question_ids = crud_quiz_questions.create_quiz_question_in_db(
        db, question_ids, quiz_id
    )

    return {"quiz_id": quiz_id, "quiz_question_ids": quiz_question_ids}
