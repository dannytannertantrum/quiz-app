from sqlalchemy.orm import Session

from app.crud import crud_questions
from app.models import Question, Topic
from tests.utils.question import (
    create_test_question,
    delete_test_questions,
    random_answer_options,
)
from tests.utils.string_helpers import random_lower_string


class TestCrudQuestionNotReturningData:
    def test_get_questions_via_subtopic_with_question_marked_is_deleted_returns_no_results(
        self, db: Session, create_test_subtopics_movies: list[Topic]
    ) -> None:
        horror_subtopic = create_test_subtopics_movies[0]
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=2,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=horror_subtopic.id,
            is_deleted=True,
        )

        try:
            result = crud_questions.get_questions_by_subtopic_ids(
                db, [horror_subtopic.id]
            )
            assert result == []
        finally:
            delete_test_questions(db)

    def test_get_questions_via_subtopic_with_parent_primary_topic_marked_is_deleted_returns_no_results(
        self,
        db: Session,
        create_test_subtopic_with_deleted_parent_topic: Topic,
    ) -> None:
        # This subtopic has a primary topic marked is_deleted=True
        subtopic_with_deleted_parent = create_test_subtopic_with_deleted_parent_topic
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=4,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=subtopic_with_deleted_parent.id,
            is_deleted=False,
        )

        try:
            result = crud_questions.get_questions_by_subtopic_ids(
                db, [subtopic_with_deleted_parent.id]
            )
            assert result == []
        finally:
            delete_test_questions(db)

    def test_get_questions_via_subtopic_marked_is_deleted_returns_no_results(
        self, db: Session, create_deleted_test_subtopic
    ) -> None:
        deleted_subtopic = create_deleted_test_subtopic
        create_test_question(
            db,
            answer_options=random_answer_options,
            correct_answer=4,
            question=random_lower_string(),
            question_type="multiple choice",
            topic_id=deleted_subtopic.id,
            is_deleted=False,
        )

        try:
            result = crud_questions.get_questions_by_subtopic_ids(
                db, [deleted_subtopic.id]
            )
            assert result == []
        finally:
            delete_test_questions(db)


class TestCrudQuestionReturningData:
    def test_get_all_questions(
        self, db: Session, create_test_questions: list[Question]
    ) -> None:
        comedy_question: Question = create_test_questions[0]
        result: list[Question] = crud_questions.get_questions(db)

        assert len(result) == len(create_test_questions)

        assert result[0].id == comedy_question.id
        assert result[0].answer_options == comedy_question.answer_options
        assert result[0].correct_answer == comedy_question.correct_answer
        assert result[0].question == comedy_question.question
        assert result[0].question_type == comedy_question.question_type
        assert result[0].topic_id == comedy_question.topic_id

    def test_get_questions_by_id(
        self, db: Session, create_test_questions: list[Question]
    ) -> None:
        comedy_question: Question = create_test_questions[0]
        result: Question = crud_questions.get_question_by_id(db, comedy_question.id)

        assert result.id == comedy_question.id
        assert result.answer_options == comedy_question.answer_options
        assert result.correct_answer == comedy_question.correct_answer
        assert result.question == comedy_question.question
        assert result.question_type == comedy_question.question_type
        assert result.topic_id == comedy_question.topic_id

    def test_get_questions_by_primary_topic_id(
        self,
        db: Session,
        create_test_primary_topics: list[Topic],
        create_test_subtopics_movies: list[Topic],
    ) -> None:
        primary_topic_movies: Topic = create_test_primary_topics[0]
        subtopic_comedy: Topic = create_test_subtopics_movies[3]
        result: list[Question] = crud_questions.get_questions_by_primary_topic_id(
            db, primary_topic_movies.id
        )

        assert len(result) == len(create_test_subtopics_movies)
        assert result[0].topic_id == subtopic_comedy.id
        assert isinstance(result[0].question, str)
        assert isinstance(result[0].answer_options, list)
        assert isinstance(result[0].correct_answer, int)

    def test_get_questions_by_list_of_subtopic_ids(
        self,
        db: Session,
        create_test_questions: list[Question],
        create_test_subtopics_movies: list[Topic],
    ) -> None:
        subtopic_drama, subtopic_comedy = create_test_subtopics_movies[2:]
        comedy_question1 = create_test_questions[0]
        result: list[Question] = crud_questions.get_questions_by_subtopic_ids(
            db, [subtopic_drama.id, subtopic_comedy.id]
        )

        # There are 4 questions total, 2 are associated with comedy and 1 with drama
        assert len(result) == 3
        assert result[0].topic_id == subtopic_comedy.id
        assert result[0].topic_id == comedy_question1.topic_id
        assert result[2].topic_id == subtopic_drama.id
        assert isinstance(result[0].question, str)
        assert isinstance(result[0].answer_options, list)
        assert isinstance(result[0].correct_answer, int)
