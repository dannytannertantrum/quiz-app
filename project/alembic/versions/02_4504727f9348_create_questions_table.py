"""Create questions table

Revision ID: 4504727f9348
Revises: 01_6f247da76f69
Create Date: 2023-07-11 14:30:03.637404

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "02_4504727f9348"
down_revision = "01_6f247da76f69"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "questions",
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
        sa.Column("answer_options", sa.JSON(), nullable=False),
        sa.Column("correct_answer", sa.Integer(), nullable=False),
        sa.Column(
            "is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.Column("question", sa.String(length=1024), nullable=False),
        sa.Column("question_type", sa.String(length=20), nullable=False),
        sa.Column("topic_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(
            ["topic_id"],
            ["topics.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_questions_id"), table_name="questions")
    op.drop_table("questions")
