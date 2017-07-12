"""Create games table

Revision ID: e4f9da87dd5d
Revises: 94044bd46863
Create Date: 2017-07-13 00:00:41.235878

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'e4f9da87dd5d'
down_revision = '94044bd46863'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('games',
                    sa.Column('id', sa.Integer, primary_key=True),
                    sa.Column('created', sa.DateTime, server_default=sa.func.current_timestamp()),
                    sa.Column('updated', sa.DateTime, server_default=sa.func.current_timestamp(),
                              server_onupdate=sa.func.current_timestamp()),
                    sa.Column('teams', sa.String, nullable=False),
                    sa.Column('winner', sa.Integer, server_default='-1'),
                    sa.Column('ranked', sa.Boolean, server_default='False'),
                    sa.Column('played', sa.Boolean, server_default='False'),
                    sa.Column('round', sa.Integer, server_default='0'),
                    sa.Column('replay', sa.String))


def downgrade():
    op.drop_table('games')
