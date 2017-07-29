from sqlalchemy import create_engine
from sqlalchemy.sql import select, update
from team import Team

Engine = create_engine('postgresql://jdis:compeIA@127.0.0.1/jdis')


def get_all_teams():
    conn = Engine.connect()
    s = select([Team]).where(Team.admin == False).where(Team.bot == False)
    return conn.execute(s)
