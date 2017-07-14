"""Add bots

Revision ID: 00dc80f0822f
Revises: e4f9da87dd5d
Create Date: 2017-07-13 21:52:15.229752

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '00dc80f0822f'
down_revision = 'e4f9da87dd5d'
branch_labels = None
depends_on = None

teams = sa.table('teams',
                 sa.column('name', sa.String),
                 sa.column('members', sa.String),
                 sa.column('bot', sa.Boolean))


def upgrade():
    op.add_column('teams',
                  sa.Column('bot', sa.Boolean, server_default='False')
                  )
    op.bulk_insert(teams,
                   [
                       {'name': 'ninja-bot', 'members': '', 'bot': True},
                       {'name': 'warrior-bot', 'members': '', 'bot': True},
                       {'name': 'wizard-bot', 'members': '', 'bot': True}
                   ]
                   )


def downgrade():
    op.drop_column('teams', 'bot')
    op.execute(teams.delete().where(teams.c.id == 1))
    op.execute(teams.delete().where(teams.c.id == 2))
    op.execute(teams.delete().where(teams.c.id == 3))
