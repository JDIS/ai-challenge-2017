from sqlalchemy import create_engine
from sqlalchemy.sql import select, update
from models.game import Game
from models.status import Status

Engine = create_engine('postgresql://jdis:compeIA@localhost/jdis')


def get_all_ready_games():
    conn = Engine.connect()
    s = select([Game]).where(Game.status == Status.ready)
    return conn.execute(s)


def update_played_game(game, winner, replay):
    conn = Engine.connect()
    s = update(Game).where(Game.id == game.id).values(winner=winner, status=Status.played, replay=replay)
    conn.execute(s)
