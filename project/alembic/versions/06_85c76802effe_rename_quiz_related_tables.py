"""Rename quiz related tables

Revision ID: 85c76802effe
Revises: 05_24695bbcf22d
Create Date: 2023-07-25 13:45:02.547052

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "06_85c76802effe"
down_revision = "05_24695bbcf22d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint(
        constraint_name="quiz_sessions_user_id_fkey",
        table_name="quiz_sessions",
        type_="foreignkey",
    )
    op.drop_constraint(
        constraint_name="quiz_session_questions_question_id_fkey",
        table_name="quiz_session_questions",
        type_="foreignkey",
    )
    op.drop_constraint(
        constraint_name="quiz_session_questions_quiz_session_id_fkey",
        table_name="quiz_session_questions",
        type_="foreignkey",
    )
    op.rename_table("quiz_sessions", "quizzes")
    op.rename_table("quiz_session_questions", "quiz_questions")
    op.alter_column("quiz_questions", "quiz_session_id", new_column_name="quiz_id")
    op.execute("ALTER INDEX quiz_sessions_pkey RENAME TO quizzes_pkey")
    op.execute("ALTER INDEX ix_quiz_sessions_id RENAME TO ix_quizzes_id")
    op.execute("ALTER INDEX quiz_session_questions_pkey RENAME TO quiz_questions_pkey")
    op.execute(
        "ALTER INDEX ix_quiz_session_questions_id RENAME TO ix_quiz_questions_id"
    )
    op.create_foreign_key(
        constraint_name="quizzes_user_id_fkey",
        source_table="quizzes",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
    )
    op.create_foreign_key(
        constraint_name="quiz_questions_question_id_fkey",
        source_table="quiz_questions",
        referent_table="questions",
        local_cols=["question_id"],
        remote_cols=["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        constraint_name="quiz_questions_quiz_id_fkey",
        source_table="quiz_questions",
        referent_table="quizzes",
        local_cols=["quiz_id"],
        remote_cols=["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint(
        constraint_name="quizzes_user_id_fkey",
        table_name="quizzes",
        type_="foreignkey",
    )
    op.drop_constraint(
        constraint_name="quiz_questions_question_id_fkey",
        table_name="quiz_questions",
        type_="foreignkey",
    )
    op.drop_constraint(
        constraint_name="quiz_questions_quiz_id_fkey",
        table_name="quiz_questions",
        type_="foreignkey",
    )
    op.rename_table("quizzes", "quiz_sessions")
    op.rename_table("quiz_questions", "quiz_session_questions")
    op.alter_column(
        "quiz_session_questions", "quiz_id", new_column_name="quiz_session_id"
    )
    op.execute("ALTER INDEX quizzes_pkey RENAME TO quiz_sessions_pkey")
    op.execute("ALTER INDEX ix_quizzes_id RENAME TO ix_quiz_sessions_id")
    op.execute("ALTER INDEX quiz_questions_pkey RENAME TO quiz_session_questions_pkey")
    op.execute(
        "ALTER INDEX ix_quiz_questions_id RENAME TO ix_quiz_session_questions_id"
    )
    op.create_foreign_key(
        constraint_name="quiz_sessions_user_id_fkey",
        source_table="quiz_sessions",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
    )
    op.create_foreign_key(
        constraint_name="quiz_session_questions_question_id_fkey",
        source_table="quiz_session_questions",
        referent_table="questions",
        local_cols=["question_id"],
        remote_cols=["id"],
    )
    op.create_foreign_key(
        constraint_name="quiz_session_questions_quiz_session_id_fkey",
        source_table="quiz_session_questions",
        referent_table="quiz_sessions",
        local_cols=["quiz_session_id"],
        remote_cols=["id"],
    )
