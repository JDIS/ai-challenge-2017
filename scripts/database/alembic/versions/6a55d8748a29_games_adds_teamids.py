"""games adds teamids

Revision ID: 6a55d8748a29
Revises: fa9af46a66bb
Create Date: 2017-07-16 19:41:25.409351

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6a55d8748a29'
down_revision = 'fa9af46a66bb'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('games', 'teams')
    op.add_column('games', sa.Column('next_team_count', sa.Integer, server_default='0'))
    op.add_column('games', sa.Column('team0', sa.Integer))
    op.add_column('games', sa.Column('team1', sa.Integer))
    op.add_column('games', sa.Column('team2', sa.Integer))
    op.add_column('games', sa.Column('team3', sa.Integer))


def downgrade():
    op.add_column('games', sa.Column('teams', sa.String, nullable=False))
    op.drop_column('games', 'team0')
    op.drop_column('games', 'team1')
    op.drop_column('games', 'team2')
    op.drop_column('games', 'team3')
    pass
