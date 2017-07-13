#!/bin/bash

sudo su

# Install requirements
apt-get -y install docker
apt-get -y install docker-compose
apt-get -y install python3
apt-get -y install python3-pip
apt-get -y install python3-alembic
apt-get -y install wget
apt-get -y install unzip
apt-get -y install make
apt-get -y install build-essential
apt-get -y install postgresql-client-common
apt-get -y install postgresql-client

pip3 install psycopg2

# Database
docker-compose up -d
cd scripts/database/
alembic update head
cd ../../

# Halite
if [ ! -d halite]
then
  mkdir halite
  cd halite
  wget https://halite.io/downloads/environment/HaliteEnvironment-Source.zip
  unzip HaliteEnvironment-Source.zip
  rm HaliteEnvironment-Source.zip
  make 
fi

