from enum import Enum, auto


class Language(Enum):
    python = {'extension': '.py', 'launcher': 'python3 {}/MyBot.py'}
    node = {'extension': '.js', 'launcher': 'node {}/MyBot.js'}
    csharp = {'extension': '.cs',
              'launcher': 'mono {}/bin/Release/Halite.exe',
              'compiler': 'xbuild /p:Configuration=Release /p:Platform=AnyCpu {}/Halite.csproj'}
    cpp = {'extension': '.cpp', 'launcher': '{}/Halite', 'compiler': 'make -C {}/'}
