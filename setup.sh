#!/bin/bash

# Check for valid commands
if [ $# -eq 0 ]; then
  echo "ERROR: No arguments supplied"
  echo "First param"
  echo "prod for production"
  echo "dev for development"
  echo "Second param"
  echo "Path to csv folder"
  exit
fi

# Check if .env-file already exists
file=./server/.env
if [ -f "$file" ]; then
  read -p  "[WARNING] Files already exist are you sure you want to overwrite with new passwords? [Y/n] " choice
  if [[ $choice =~ ^[Nn]$ ]]
  then
    echo "Exit"
    exit
  fi
fi

function getEnv() {
  grep $1 $file | cut -d '=' -f2 | sed -n 1p
}

# Generate .env
chmod 777 scripts/generate-env.sh
./scripts/generate-env.sh $1 "y" $file

echo "Starting docker"
docker-compose up --build -d

# Get env variables
ROOT_PASSWORD=$(getEnv ROOT_PASSWORD)
ROOT=$(getEnv ROOT)
DATABASE=$(getEnv DATABASE)

#Wait for docker to start
#Every 2 second making a request to the db. If there is an correct response it means Docker is running
until docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} -e "select 1" > /dev/null 2>&1; do sleep 2; echo Waiting...; done

echo Create tables

# Adding tables to database
docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} <<MYSQL
use $DATABASE;
CREATE TABLE IF NOT EXISTS movies(
movie_id INT NOT NULL,
title VARCHAR(100) NOT NULL,
PRIMARY KEY (movie_id)
); 
CREATE TABLE IF NOT EXISTS users(
user_id INT NOT NULL,
name VARCHAR(100) NOT NULL,
PRIMARY KEY (user_id)
); 
CREATE TABLE IF NOT EXISTS ratings(
user_id INT NOT NULL,
movie_id INT NOT NULL,
rating FLOAT(2,1) NOT NULL,
PRIMARY KEY (user_id, movie_id)
); 
MYSQL

chmod 777 scripts/populate-db.sh
./scripts/populate-db.sh $2 $file

echo "The project has been initialized."