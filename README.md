# halite-backend
This project was made to give a competition. This simple dashboard let players
test their bots and participate in the official challenge.

## Features
- Can run games in the backend.
- Can run practice matches againts other players or bots.
- Can watch past matches.
- The admnistrator can start ranked matches.
- For the final round, the admnistrator can disable the site for the players.
This will prevent them to know the final result before the match is presented.
- Easy to setup. Runs in docker compose.
- There's a leaderboard for ranked matches.
- Each round produces more points.
- There's already 3 bots. The third one is better than random.
- There's 4 starter packs. The contains scripts to test locally on linux, mac
and windows. They also have a simple A*.
- There's a starting guide to help new players.
- The migrations are atomatically ran.

## Install
You need `docker` and `docker-compose`. Copy the `env.example` file to `.env`.
Edit this `.env` file to setup all the variables. The secret can be generated
with `openssl rand -hex 48`. Those variables will be shared between every
containers. Run `docker-compose up`. The first time, the runner will complain
that the DB doens't contain certain tables. Don't panic. Just wait and 10 seconds
later the migrations will start and everything will be fixed.

## Notes
- Don't put this on the Internet. Every games are in the same container. Players
can easy screwup the system.
- The code is in english but the presentation is in french.
- Be careful if you open the DB port on your firewall.
- Round 0 doesn't produce any point.
- Don't hesitate to rebrand the site. The branding was made for our CS student
association.

## I want to contribute, what should I do?
- You could translate the frontend to english.
- Run every games in its container without acces to the network and everything
else.

### Update tables
The database tables are maintained by `alembic` which can be installed using
`virtualenv`. Go into `/scripts/database` and run
`virtualenv . && source bin/activate && pip install -r requirements.txt`.

If you need to modify the tables, create a new script with
`alembic revision -m "my revision"`. You will need to restart the `migration`
container to run the migrations. You can then find it under the `versions` folder
and make the necessary changes. 
