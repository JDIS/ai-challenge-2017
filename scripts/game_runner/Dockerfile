FROM python:3.6.2-stretch

RUN apt-get update
RUN apt-get -y install wget
RUN apt-get -y install unzip
RUN apt-get -y install make
RUN apt-get -y install build-essential
RUN apt-get -y install postgresql-client-common
RUN apt-get -y install postgresql-client
RUN apt-get -y install mono-complete

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs

WORKDIR /usr/halite-backend/halite
RUN wget github.com/Sytten/Halite/archive/v1.2.2.zip 
RUN unzip v1.2.2.zip
RUN cp -a Halite-1.2.2/environment/. .
RUN rm -rf Halite-1.2.2
RUN rm v1.2.2.zip
RUN make

WORKDIR /usr/halite-backend
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY helpers/ ./helpers/
COPY models/ ./models/
COPY game_runner.py .
COPY __init__.py .
