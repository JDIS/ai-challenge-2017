#!/bin/bash

sudo su

# Install requirements
apt-get -y install docker
apt-get -y install docker-compose
apt-get -y install python3
apt-get -y install python3-pip
apt-get -y install python3-alembic

pip3 install psycopg2

# Database
docker-compose up -d
cd scripts/database/
alembic update head

