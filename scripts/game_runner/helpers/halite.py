import os
import helpers.directories as directories
from subprocess import check_output


def play_game(bots):
    games_directory = directories.get_games_directory()
    halite_executable = directories.get_halite_directory() + 'halite'

    players = []
    command = [halite_executable, '-q',  '-i ' + games_directory, '-d 20 20']

    for botId, data in bots.items():
        launcher = data['language'].value['launcher'].format(data['path'])
        players.append(botId)
        command.append(launcher)

    output = check_output(command)
    rank, replay_id = parse_game_output(output, players)

    return rank, replay_id


def parse_game_output(output, players):
    lines = output.decode("utf-8").split('\n')
    rank = [None]*len(players)
    replay_id = ''

    for i in range(len(lines)):
        if i == len(players)+1:
            game_path = lines[i].split(' ')[0]
            replay_id = os.path.basename(game_path)
        if len(players)+1 < i < 2*len(players)+2:
            player_id, position, last_round = lines[i].split(' ')
            rank[int(position)-1] = players[int(player_id)-1]
        if i > 2*len(players)+2:
            pass  # Handle bots error

    return rank, replay_id
