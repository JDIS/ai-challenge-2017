# halite-backend

## Database
### Launch
The backend is supported by a postgres database. To start it, you need to install ```docker``` and ```docker-compose```.
Then you run ```docker-compose run -d``` in this directory. It will run on the default port 5432.
The database name and the username are: jdis.
The password is: compeIA

### Update tables
The database tables are maintained by ```alembic``` which can be installed using ```pip```.
Go into ```/scripts/database``` and run ```alembic upgrade head```.
This will migrate the database to the most recent state using scripts located in ```/scripts/database/alembic/versions```.
If you need to modify the tables, create a new script with ```alembic revision -m "my revision"```.
You can then find it under the ```versions``` folder and make the necessary changes. 
