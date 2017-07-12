"""Create teams table

Revision ID: 94044bd46863
Revises:
Create Date: 2017-07-12 23:50:21.173435

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '94044bd46863'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('teams',
                    sa.Column('id', sa.Integer, primary_key=True),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.Column('members', sa.String(), nullable=False)
                    )


def downgrade():
    op.drop_table('teams')
