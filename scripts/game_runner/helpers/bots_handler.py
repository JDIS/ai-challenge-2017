import os
import shutil
import helpers.directories as directories
import logging
from zipfile import ZipFile
from subprocess import check_output
from helpers.language import Language

logger = logging.getLogger(__name__)

tmp_directory = directories.get_base_directory() + 'tmp/'
bots_directory = directories.get_base_directory() + 'bots/'


def prepare_bots(bots):
    bots_extracted = {}

    # Delete tmp before copying bots
    if os.path.exists(tmp_directory):
        shutil.rmtree(tmp_directory)
    os.makedirs(tmp_directory)

    for bot in bots:
        bot_path = _unzip_bot(bot)
        bots_extracted[bot] = {'path': bot_path, 'language': _detect_language(bot_path)}
        _compile_bot(bots_extracted[bot])

    return bots_extracted


def _unzip_bot(bot):
    bot_path = tmp_directory + str(bot)

    try:
        zip_bot = ZipFile(bots_directory + str(bot) + '.zip', 'r')
        zip_bot.extractall(bot_path)
        zip_bot.close()
    except:
        logger.error('Unzipping fail for team bot: {}'.format(bot))

    if os.path.exists(bot_path + '/MyBot'):
        bot_path = bot_path + '/MyBot'

    return bot_path


def _detect_language(bot_path):
    for lang in Language:
        path = bot_path + '/MyBot' + lang.value.get('extension')
        if os.path.isfile(path):
            return lang
    logger.warning('Unknown language for bot: {}'.format(bot_path))
    return Language.default


def _compile_bot(bot):
    try:
        compiler = bot['language'].value.get('compiler')
        if compiler:
            compilation_output = check_output(compiler.format(bot['path']), shell=True)
    except:
        logger.error('Compilation fail for bot: {}'.format(bot['path']))
