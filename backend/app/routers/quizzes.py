from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app.crud import crud_questions, crud_quizzes, crud_quiz_questions
from app.database import get_db
from app.dependencies import get_current_user
from app.helper_functions import choose_random_questions
from app.schemas.quiz import (
    QuizCreate,
    QuizCreateResponse,
    QuizWithTopicData,
    QuizAllData,
)
from app.schemas.user import UserBase


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
    current_user: UserBase = Depends(get_current_user),
) -> QuizCreateResponse:
    """
    Create a new quiz record and in turn, create 5 Quiz question records
    because each quiz has 5 questions
    Return the quiz id and a list of quiz_question_ids
    """
    quiz_id = crud_quizzes.create_quiz_in_db(db, current_user["id"])
    questions = crud_questions.get_questions_by_subtopic_ids(
        db, user_input.selected_topics
    )
    if len(questions) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough questions found"
        )

    question_ids = choose_random_questions(questions, picked_questions=[])
    quiz_question_records = crud_quiz_questions.create_quiz_question_in_db(
        db, question_ids, quiz_id
    )

    return {"id": quiz_id, "quiz_questions": quiz_question_records}


@router.get(
    "/user/me",
    response_model=list[QuizWithTopicData],
    status_code=status.HTTP_200_OK,
)
def read_all_quizzes_with_topic_data_by_user_id(
    db: Session = Depends(get_db),
    current_user: UserBase = Depends(get_current_user),
) -> list[QuizWithTopicData]:
    """
    All quizzes in the account section need to show the completed date,
    score, primary topic names and subtopic names
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    quizzes_with_topic_data = crud_quizzes.get_all_quizzes_with_topic_data_by_user_id(
        db, user_id=current_user["id"]
    )
    if not quizzes_with_topic_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No quizzes found"
        )

    return quizzes_with_topic_data


@router.get(
    "/{quiz_id}",
    response_model=QuizWithTopicData,
    status_code=status.HTTP_200_OK,
)
def read_quiz_with_topic_data_by_quiz_id(
    quiz_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserBase = Depends(get_current_user),
) -> QuizWithTopicData:
    """
    After a user submits the last answer on a quiz, they get directed
    to a page with their score. The front-end can add a query parameter
    like ?quiz_complete and generate a message based on the score and topics
    E.g. a perfect score may say, "You really know your <topic>!"
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    quiz_with_topic_data = crud_quizzes.get_quiz_with_topic_data_by_quiz_id(
        db, quiz_id=quiz_id
    )
    if not quiz_with_topic_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No quiz found"
        )

    return quiz_with_topic_data


@router.get(
    "/{quiz_id}/review",
    description="Return a quiz record with all the questions, answers and user submitted answers",
    response_model=QuizAllData,
    status_code=status.HTTP_200_OK,
)
def read_quiz_with_all_questions_answers_and_topics(
    quiz_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserBase = Depends(get_current_user),
) -> QuizAllData:
    """
    After a user has completed a quiz, they can review their answers
    to see which questions they answered correctly
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    quiz_with_all_data = crud_quizzes.get_quiz_with_all_questions_answers_and_topics(
        db, quiz_id=quiz_id
    )

    if not quiz_with_all_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No quiz found"
        )

    return quiz_with_all_data


@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: UUID4,
    db: Session = Depends(get_db),
    current_user: UserBase = Depends(get_current_user),
) -> None:
    """
    Hard delete a quiz record from the database
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    crud_quizzes.delete_quiz_in_db(db, quiz_id=quiz_id)
