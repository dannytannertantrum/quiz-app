from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_questions, crud_quiz_questions
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.quiz_question import QuizQuestionAndAnswers
from app.schemas.user import UserCurrent


router = APIRouter(
    prefix="/quiz-questions",
    tags=["quiz questions"],
    responses={404: {"description": "Quiz questions not found"}},
)


@router.get(
    "/{quiz_question_id}",
    response_model=QuizQuestionAndAnswers,
    status_code=status.HTTP_200_OK,
)
def read_quiz_question_by_id(
    quiz_question_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> QuizQuestionAndAnswers:
    question_id = crud_quiz_questions.get_question_by_quiz_question_id(
        db, quiz_question_id
    )
    if not question_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No question associated with quiz question id: {quiz_question_id}",
        )

    question_info = crud_questions.get_question_by_id(db, question_id=question_id)

    return {
        "id": quiz_question_id,
        "question": question_info.question,
        "answer_options": question_info.answer_options,
    }
