import time
import sys
import logging
import helpers.database as database
import helpers.bots_handler as bots_handler
import helpers.halite as halite

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format='%(asctime)s %(name)-30s %(levelname)-8s %(message)s')
logger = logging.getLogger("{}/{}".format(__file__, __name__))
running = True


def main():
    while running:
        logger.info("Polling new games")
        games_ready = database.get_all_ready_games()
        for game in games_ready:
            teams = game.teams.split(',')
            bots = bots_handler.unzip_bots(teams)

            logger.info("Playing game: {}".format(game.id))
            rank, replay_id = halite.play_game(bots)
            database.update_played_game(game, rank[0], replay_id)

        logger.info("Finished processing games")
        time.sleep(1)

if __name__ == "__main__":
    main()
