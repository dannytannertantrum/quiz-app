"""Add delete cascade for user on quiz model

Revision ID: 19834f3ca392
Revises: 06_85c76802effe
Create Date: 2023-07-25 20:37:37.508551

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = "07_19834f3ca392"
down_revision = "06_85c76802effe"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("quizzes_user_id_fkey", "quizzes", type_="foreignkey")
    op.create_foreign_key(
        constraint_name="quizzes_user_id_fkey",
        source_table="quizzes",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("quizzes_user_id_fkey", "quizzes", type_="foreignkey")
    op.create_foreign_key(
        constraint_name="quizzes_user_id_fkey",
        source_table="quizzes",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
    )
