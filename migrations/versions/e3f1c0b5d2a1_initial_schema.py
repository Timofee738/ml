"""initial schema

Revision ID: e3f1c0b5d2a1
Revises: 
Create Date: 2026-04-03 12:05:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e3f1c0b5d2a1"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    if "users" not in tables:
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("username", sa.String(), nullable=False),
            sa.Column("email", sa.String(), nullable=False),
            sa.Column("hashed_password", sa.String(), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.false()),
            sa.PrimaryKeyConstraint("id"),
        )
        inspector = sa.inspect(bind)
        tables = set(inspector.get_table_names())

    user_indexes = {idx["name"] for idx in inspector.get_indexes("users")} if "users" in tables else set()
    if op.f("ix_users_email") not in user_indexes:
        op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    if "posts" not in tables:
        op.create_table(
            "posts",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("content", sa.Text(), nullable=False),
            sa.Column("image_url", sa.String(length=255), nullable=True),
            sa.Column("is_spam", sa.Boolean(), nullable=False, server_default=sa.false()),
            sa.Column("spam_score", sa.Float(), nullable=False, server_default=sa.text("0")),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = set(inspector.get_table_names())

    if "posts" in tables:
        op.drop_table("posts")

    if "users" in tables:
        user_indexes = {idx["name"] for idx in inspector.get_indexes("users")}
        if op.f("ix_users_email") in user_indexes:
            op.drop_index(op.f("ix_users_email"), table_name="users")
        op.drop_table("users")
