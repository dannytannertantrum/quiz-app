from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_questions, crud_quizzes, crud_quiz_questions
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.quiz_question import (
    QuizQuestionAndAnswers,
    QuizQuestionUpdateAnswerRequest,
)
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
    description="Returns the quiz question id, question, answer options, and the id of the user selected answer",
)
def read_quiz_question_by_id(
    quiz_question_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserCurrent = Depends(get_current_user),
) -> QuizQuestionAndAnswers:
    quiz_question = (
        crud_quiz_questions.get_question_and_user_answer_by_quiz_question_id(
            db, quiz_question_id
        )
    )
    if not quiz_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No question associated with quiz question id: {quiz_question_id}",
        )

    question_info = crud_questions.get_question_by_id(
        db, question_id=quiz_question.question_id
    )

    return {
        "id": quiz_question_id,
        "question": question_info.question,
        "answer_options": question_info.answer_options,
        "user_answer": quiz_question.user_answer,
    }


@router.put("/{quiz_question_id}", status_code=status.HTTP_204_NO_CONTENT)
def update_quiz_question(
    quiz_question_id: UUID4,
    user_input: QuizQuestionUpdateAnswerRequest,
    current_user: UserCurrent = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    quiz_question = (
        crud_quiz_questions.get_question_and_user_answer_by_quiz_question_id(
            db, quiz_question_id=quiz_question_id
        )
    )
    if not quiz_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No question associated with quiz question id: {quiz_question_id}",
        )

    quiz_question_record = crud_quiz_questions.update_quiz_question_in_db(
        db, user_input=user_input, quiz_question_id=quiz_question_id
    )
    quiz_questions = crud_quiz_questions.get_quiz_questions_by_quiz_id(
        db, quiz_id=quiz_question_record.quiz_id
    )
    user_answers = list(
        filter(
            lambda answer: answer is not None,
            map(lambda x: x.user_answer, quiz_questions),
        )
    )
    completed_at = None
    last_modified_at = datetime.now(timezone.utc)
    score = None

    if len(user_answers) == 5:
        completed_at = datetime.now(timezone.utc)
        result = crud_quiz_questions.calculate_user_score(
            db, quiz_id=quiz_question_record.quiz_id
        )
        score = result.user_score

    crud_quizzes.update_quiz_in_db(
        db,
        completed_at=completed_at,
        last_modified_at=last_modified_at,
        quiz_id=quiz_question_record.quiz_id,
        score=score,
    )
