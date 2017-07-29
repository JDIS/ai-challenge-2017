import os
import logging
import helpers.directories as directories
import shutil
from subprocess import check_output

logger = logging.getLogger(__name__)


def play_game(bots):
    games_directory = directories.get_games_directory()
    tmp_directory = directories.get_base_directory() + 'tmp/'
    halite_executable = directories.get_halite_directory() + 'halite'

    players = []
    command = [halite_executable, '-q',  '-i ' + games_directory, '-e ' + tmp_directory, '-d 32 32']

    for botId, data in bots.items():
        launcher = data['language'].value['launcher'].format(data['path'])
        players.append(botId)
        command.append(launcher)

    logger.info("Running command: {}".format(str(command)))
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

        elif len(players)+1 < i < 2*len(players)+2:
            player_id, position, last_round = lines[i].split(' ')
            rank[int(position)-1] = players[int(player_id)-1]

        elif i == 2*len(players)+3:
            error_files = lines[i].rstrip(' ').split()
            if error_files:
                errors_directory = directories.get_errors_directory(replay_id.split('.')[0])
                for file_path in error_files:
                    error_file_id = os.path.basename(file_path)
                    shutil.move(file_path, errors_directory + error_file_id)

    return rank, replay_id
