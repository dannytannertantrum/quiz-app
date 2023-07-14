"""Create users table

Revision ID: e867fb822104
Revises: 02_4504727f9348
Create Date: 2023-07-14 14:05:07.172122

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "03_e867fb822104"
down_revision = "02_4504727f9348"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
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
        sa.Column(
            "is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.Column("email", sa.String(length=128), nullable=False),
        sa.Column("hashed_password", sa.String(length=256), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
