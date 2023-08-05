"""Rename topic_id column

Revision ID: 4ef9db4e4e1e
Revises: 03_e867fb822104
Create Date: 2023-07-19 18:09:25.801910

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "04_4ef9db4e4e1e"
down_revision = "03_e867fb822104"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("topics", "topic_id", new_column_name="parent_topic_id")
    op.drop_constraint(
        constraint_name="topics_topic_id_fkey", table_name="topics", type_="foreignkey"
    )
    op.create_foreign_key(
        constraint_name="topics_parent_topic_id_fkey",
        source_table="topics",
        referent_table="topics",
        local_cols=["parent_topic_id"],
        remote_cols=["id"],
    )


def downgrade() -> None:
    op.alter_column("topics", "parent_topic_id", new_column_name="topic_id")
    op.drop_constraint(
        constraint_name="topics_parent_topic_id_fkey",
        table_name="topics",
        type_="foreignkey",
    )
    op.create_foreign_key(
        constraint_name="topics_topic_id_fkey",
        source_table="topics",
        referent_table="topics",
        local_cols=["topic_id"],
        remote_cols=["id"],
    )
