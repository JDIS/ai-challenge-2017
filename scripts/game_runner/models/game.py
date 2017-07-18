from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, DateTime, Boolean, String, Enum
from models.status import Status

Base = declarative_base()


class Game(Base):
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True)
    created = Column(DateTime)
    updated = Column(DateTime)
    teams = Column(String)
    winner = Column(Integer)
    ranked = Column(Boolean)
    status = Column(Enum(Status))
    round = Column(Integer)
    replay = Column(String)

    def __repr__(self):
        return "<Game(id='%s', teams='%s', status='%s')>" % (
            self.id, self.teams, self.status)
