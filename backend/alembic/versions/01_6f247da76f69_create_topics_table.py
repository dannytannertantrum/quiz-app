"""create topics table

Revision ID: 6f247da76f69
Revises: 
Create Date: 2023-07-07 17:07:31.443571

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "01_6f247da76f69"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "topics",
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
        sa.Column("description", sa.String(length=250), nullable=True),
        sa.Column(
            "is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.Column("title", sa.String(length=128), nullable=False),
        sa.Column("topic_id", sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(
            ["topic_id"],
            ["topics.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_topics_id"), table_name="topics")
    op.drop_table("topics")
