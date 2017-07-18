import os

project_name = 'halite-backend/'


def get_games_directory():
    return safe_create_directory(get_base_directory() + 'games/')


def get_halite_directory():
    return get_base_directory() + 'halite/'


def get_base_directory():
    return os.getcwd().split(project_name)[0] + project_name


def safe_create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)
    return path
