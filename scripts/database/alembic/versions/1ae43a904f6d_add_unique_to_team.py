"""add unique to team

Revision ID: 1ae43a904f6d
Revises: 6ae6f47ea3ed
Create Date: 2017-07-14 20:43:09.223391

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ae43a904f6d'
down_revision = '6ae6f47ea3ed'
branch_labels = None
depends_on = None


def upgrade():
    op.create_unique_constraint('uq_name', 'teams', ['name'])


def downgrade():
    op.drop_constraint('uq_name', 'teams')
