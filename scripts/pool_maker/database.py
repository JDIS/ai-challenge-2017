from sqlalchemy import create_engine
from sqlalchemy.sql import select, update
from team import Team
import os

Engine = create_engine(f"postgresql://{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}@database/{os.environ['POSTGRES_USER']}")


def get_all_teams():
    conn = Engine.connect()
    s = select([Team]).where(Team.admin == False).where(Team.bot == False)
    return conn.execute(s)
