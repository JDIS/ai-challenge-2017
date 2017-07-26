from sqlalchemy import create_engine
from sqlalchemy.sql import select, update
from models.game import Game
from models.status import Status

Engine = create_engine('postgresql://jdis:compeIA@database/jdis')


def get_all_ready_games():
    conn = Engine.connect()
    s = select([Game]).where(Game.status == Status.ready)
    return conn.execute(s)


def update_played_game(game, rank, replay):
    conn = Engine.connect()
    s = update(Game).where(Game.id == game.id).values(grade0=rank[0],
                                                      grade1=rank[1],
                                                      grade2=rank[2],
                                                      grade3=rank[3],
                                                      status=Status.played,
                                                      replay=replay)
    conn.execute(s)
