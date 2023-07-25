import random

from pydantic import UUID4

from app.models.question import Question


def choose_random_questions(
    questions: list[Question], picked_questions=[]
) -> list[UUID4]:
    """
    Generates a unique list of question UUIDs

    It is currently only used for the quizzes router which passes in
    unique uuids by default. If the list is too short, we return
    an empty list to guard against an endless loop.
    """
    if len(questions) < 5:
        return []

    if len(picked_questions) == 5:
        return picked_questions

    question = random.choice(questions)
    if question.id not in picked_questions:
        picked_questions.append(question.id)

    return choose_random_questions(questions, picked_questions)
