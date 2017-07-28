from enum import Enum


class Language(Enum):
    python = {'extension': '.py', 'launcher': 'python3 {}/MyBot.py'}
    node = {'extension': '.js', 'launcher': 'node {}/MyBot.js'}
    csharp = {'extension': '.cs',
              'launcher': 'mono {}/bin/Release/MyBot.exe',
              'compiler': 'xbuild /p:Configuration=Release /p:Platform=AnyCpu {}/MyBot.csproj'}
    cpp = {'extension': '.cpp', 'launcher': '{}/MyBot', 'compiler': 'make -C {}/ 2>&1'}
    # The bot will fail during the game, but it will show in the ranking
    default = {'extension': '.xxxxx', 'launcher': '{}/MyBot'}
