from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, DateTime, Boolean, String, Enum

Base = declarative_base()


class Team(Base):
    __tablename__ = 'teams'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    members = Column(String)
    bot = Column(Boolean)
    admin = Column(Boolean)
    password = Column(String)

    def __repr__(self):
        return "<Team(id='%s', name='%s')>" % (self.id, self.name)
