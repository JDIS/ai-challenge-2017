"""add config table

Revision ID: 088598e662be
Revises: 6a55d8748a29
Create Date: 2017-07-17 18:21:14.762529

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '088598e662be'
down_revision = '6a55d8748a29'
branch_labels = None
depends_on = None


configs = sa.table('configs',
                   sa.Column('id', sa.Integer, primary_key=True),
                   sa.Column('round', sa.Integer(), server_default='0'),
                   sa.Column('submitions_over', sa.Boolean(), server_default='false'),
)


def upgrade():
    op.create_table('configs',
                    sa.Column('id', sa.Integer, primary_key=True),
                    sa.Column('round', sa.Integer(), server_default='0'),
                    sa.Column('submitions_over', sa.Boolean(), server_default='false'),
                    )

    op.bulk_insert(configs,
                   [
                       {'id': '0', 'round': '0', 'submitions_over': 'false'}
                   ]
                   )


def downgrade():
    op.drop_table('configs')
