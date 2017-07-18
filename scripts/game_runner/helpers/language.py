from enum import Enum, auto


class Language(Enum):
    python = {'extension': '.py', 'launcher': 'python3 {}/MyBot.py'}
    cpp = {'extension': '.cpp', 'launcher': '{}/MyBot.o', 'compiler': 'g++ -std=c++11 {}/MyBot.cpp -o {}/MyBot.o'}
