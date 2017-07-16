"""Drop played flag and add status

Revision ID: fa9af46a66bb
Revises: 1ae43a904f6d
Create Date: 2017-07-16 11:29:13.194465

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fa9af46a66bb'
down_revision = '1ae43a904f6d'
branch_labels = None
depends_on = None

games = sa.Table(
    'games',
    sa.MetaData(),
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('played', sa.Boolean),
    sa.Column('status', sa.String)
)


def upgrade():
    op.add_column('games',
                  sa.Column('status', sa.String, server_default='created')
                  )

    # Update status
    connection = op.get_bind()
    for game in connection.execute(games.select()):
        if game.played:
            connection.execute(
                games.update().where(
                    games.c.id == game.id
                ).values(
                    status='played'
                )
            )

    op.drop_column('games', 'played')


def downgrade():
    op.add_column('games',
                  sa.Column('played', sa.Boolean, server_default='False')
                  )

    # Update played
    connection = op.get_bind()
    for game in connection.execute(games.select()):
        if game.status == 'played':
            connection.execute(
                games.update().where(
                    games.c.id == game.id
                ).values(
                    played=True
                )
            )

    op.drop_column('games', 'status')

