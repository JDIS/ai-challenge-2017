from enum import Enum, auto


class Status(Enum):
    created = auto()
    ready = auto()
    played = auto()
    error = auto()
