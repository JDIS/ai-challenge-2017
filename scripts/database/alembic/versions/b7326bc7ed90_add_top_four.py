"""Add top four

Revision ID: b7326bc7ed90
Revises: 088598e662be
Create Date: 2017-07-24 23:30:05.778646

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7326bc7ed90'
down_revision = '088598e662be'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('games', 'winner')
    op.add_column('games',
                  sa.Column('grade0', sa.Integer, server_default='-1')
                  )
    op.add_column('games',
                  sa.Column('grade1', sa.Integer, server_default='-1')
                  )
    op.add_column('games',
                  sa.Column('grade2', sa.Integer, server_default='-1')
                  )
    op.add_column('games',
                  sa.Column('grade3', sa.Integer, server_default='-1')
                  )


def downgrade():
    op.add_column('games',
                  sa.Column('winner', sa.Integer, server_default='-1')
                  )
    op.drop_column('games', 'grade0')
    op.drop_column('games', 'grade1')
    op.drop_column('games', 'grade2')
    op.drop_column('games', 'grade3')
