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
apt-get -y install mono-complete

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs

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
  wget http://github.com/Sytten/Halite/archive/v1.2.zip 
  unzip v1.2.zip
  cp -a Halite-1.2/environment/. .
  rm -rf Halite-1.2
  rm v1.2.zip
  make 
  cd ../
fi

