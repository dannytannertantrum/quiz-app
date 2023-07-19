"""Create quiz_sessions and quiz_session_questions tables

Revision ID: 24695bbcf22d
Revises: 04_4ef9db4e4e1e
Create Date: 2023-07-19 20:41:48.559343

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "05_24695bbcf22d"
down_revision = "04_4ef9db4e4e1e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "quiz_sessions",
        sa.Column("id", sa.UUID(), nullable=False, primary_key=True, index=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "last_modified_at",
            sa.DateTime(timezone=True),
            nullable=True,
            onupdate=sa.func.now(),
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "quiz_session_questions",
        sa.Column("id", sa.UUID(), nullable=False, primary_key=True, index=True),
        sa.Column("question_id", sa.UUID(), nullable=False),
        sa.Column("quiz_session_id", sa.UUID(), nullable=False),
        sa.Column("user_answer", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["question_id"], ["questions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["quiz_session_id"], ["quiz_sessions.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_quiz_session_questions_id"), table_name="quiz_session_questions"
    )
    op.drop_table("quiz_session_questions")
    op.drop_index(op.f("ix_quiz_sessions_id"), table_name="quiz_sessions")
    op.drop_table("quiz_sessions")
