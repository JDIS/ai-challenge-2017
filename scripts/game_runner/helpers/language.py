from enum import Enum, auto


class Language(Enum):
    python = {'extension': '.py', 'launcher': 'python3 {}/MyBot.py'}
    csharp = {'extension': '.cs',
              'launcher': 'mono {}/bin/Release/Halite.exe',
              'compiler': 'xbuild /p:Configuration=Release /p:Platform=AnyCpu {}/Halite.csproj'}
    cpp = {'extension': '.cpp', 'launcher': '{}/MyBot.o', 'compiler': 'g++ -std=c++11 {}/MyBot.cpp -o {}/MyBot.o'}
