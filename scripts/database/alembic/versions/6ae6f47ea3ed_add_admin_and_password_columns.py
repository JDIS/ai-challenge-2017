"""Add admin and password columns

Revision ID: 6ae6f47ea3ed
Revises: 00dc80f0822f
Create Date: 2017-07-13 22:36:45.887983

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ae6f47ea3ed'
down_revision = '00dc80f0822f'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('teams',
                  sa.Column('admin', sa.Boolean, server_default='False')
                  )
    op.add_column('teams',
                  sa.Column('password', sa.String, nullable=False, server_default="")
                  )


def downgrade():
    op.drop_column('teams', 'admin')
    op.drop_column('teams', 'password')
