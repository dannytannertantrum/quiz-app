from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, UUID4
from sqlalchemy.orm import Session

from app.crud import crud_questions
from app.database import get_db


router = APIRouter(
    prefix="/questions",
    tags=["questions"],
    responses={404: {"description": "Question not found"}},
)


class QuestionBase(BaseModel):
    id: UUID4
    answer_options: list
    correct_answer: int
    question: str
    question_type: str
    topic_id: UUID4


@router.get("/", response_model=list[QuestionBase], status_code=status.HTTP_200_OK)
def read_all_questions(db: Session = Depends(get_db)) -> list[QuestionBase]:
    questions = crud_questions.get_questions(db)
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No questions found"
        )

    return questions


@router.get(
    "/{question_id}", response_model=QuestionBase, status_code=status.HTTP_200_OK
)
def read_question_by_id(
    question_id: UUID4, db: Session = Depends(get_db)
) -> QuestionBase:
    question = crud_questions.get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No question associated with question id: {question_id}",
        )

    return question


@router.get(
    "/topic/{primary_topic_id}",
    response_model=list[QuestionBase],
    status_code=status.HTTP_200_OK,
)
def read_questions_by_primary_topic_id_or_subtopic_ids(
    primary_topic_id: UUID4,
    db: Session = Depends(get_db),
    subtopic_ids: Annotated[str | None, Query()] = None,
) -> list[QuestionBase]:
    if subtopic_ids:
        subtopic_ids_list = subtopic_ids.split(",")
        questions = crud_questions.get_questions_by_subtopic_ids(db, subtopic_ids_list)
        if not questions:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No questions found associated with subtopic ids: {subtopic_ids_list}",
            )

        return questions

    questions = crud_questions.get_questions_by_primary_topic_id(db, primary_topic_id)
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No questions found associated with primary topic id: {primary_topic_id}",
        )

    return questions
