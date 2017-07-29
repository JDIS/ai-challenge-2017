import database
import random
import math
from team import Team

bot = Team()
bot.name = "A bot"
bot.bot = True

game_for_player = 3


def main():
    pools = []
    teams = list(database.get_all_teams())
    game_played = {}

    # Set the number of game played to 0
    for team in teams:
        game_played[team.id] = 0

    # Create the pools
    number_teams = len(teams)
    number_games = int(math.ceil((number_teams * game_for_player) / 4))
    games_with_bot = int(math.modf(number_teams * game_for_player / 4)[0] * 4)
    for i in range(number_games):
        pool = []
        while len(pool) != 4:
            # Check if need we need to fill the game with a bot
            if (len(pool) == 3 and games_with_bot > 0) or (i == number_games - 1 and games_with_bot > 0):
                selected_player = bot
                games_with_bot -= 1
            else:
                selected_player = teams[random.randint(0, number_teams - 1)]

            # Check if the player has already played a game
            if not selected_player.bot:
                has_already_played = False
                for team, number_game_played in game_played.items():
                    if number_game_played < game_played[selected_player.id]:
                        has_already_played = True
                        break
                if has_already_played:
                    continue

            # Check if player already in game
            already_in_game = False
            for player in pool:
                if player.id == selected_player.id:
                    already_in_game = True
                    break
            if already_in_game:
                continue

            pool.append(selected_player)

            if not selected_player.bot:
                game_played[selected_player.id] += 1

        pools.append(pool)

    for i in range(len(pools)):
        print("Pool {}".format(i))

        for team in pools[i]:
            print(team.name)

        print("************")

if __name__ == "__main__":
    main()
