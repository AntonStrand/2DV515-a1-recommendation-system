#!/bin/bash

# Check for valid commands
if [ $# -eq 0 ]; then
  echo "ERROR: No arguments supplied"
else
  file=../server/.env
  if [ -f "$file" ]; then
    read -p  "WARNING: Files already exist are you sure you want to overwrite with new passwords? [Y/n] " choice
    if [[ $choice =~ ^[Nn]$ ]]
    then
      echo "Exit"
      exit
    fi
  fi
fi


if [ "$1" == "prod" ]; then
  echo "Creating production credentials."
  NODE_ENV=production
  MYSQL_USERNAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1)
  MYSQL_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 15 | head -n 1)
  ROOT=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 18 | head -n 1)
  ROOT_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 20 | head -n 1)
  DATABASE=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
elif [ "$1" == 'dev' ]; then
  echo "Creating development credentials."
  NODE_ENV=development
  MYSQL_USERNAME=mysql
  MYSQL_PASSWORD=password
  ROOT=root
  ROOT_PASSWORD=password
  DATABASE=dev
else
  echo "ERROR: $1 is an invalid argument"
  echo "Valid arguments"
  echo " prod  for production"
  echo " dev   for development"
  exit
fi

# Create .env settings
cat > ../server/.env <<EOF
#!/usr/bin/env bash
# Node
NODE_ENV=$NODE_ENV

# MySQL
MYSQL_VERSION=5.7.22
MYSQL_HOST=db
MYSQL_DATABASE=$DATABASE
MYSQL_ROOT_USER=$ROOT
MYSQL_ROOT_PASSWORD=$ROOT_PASSWORD
MYSQL_USER=$MYSQL_USERNAME
MYSQL_PASSWORD=$MYSQL_PASSWORD
EOF


# MAIN
echo "Start with: docker-compose up"
cd ..
docker-compose up -d

#Wait for docker to start
while [ "`docker inspect -f {{.State.Running}} db`" != "true" ]; do sleep 2; done 

echo Create tables

# Adding tables to database
docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} <<MYSQL
use $DATABASE;
CREATE TABLE movies(
movie_id INT NOT NULL,
title VARCHAR(100) NOT NULL,
year INT NOT NULL,
PRIMARY KEY (movie_id)
); 
CREATE TABLE users(
user_id INT NOT NULL,
name VARCHAR(100) NOT NULL,
PRIMARY KEY (user_id)
); 
CREATE TABLE ratings(
user_id INT NOT NULL,
movie_id INT NOT NULL,
rating FLOAT(2,1) NOT NULL,
PRIMARY KEY (user_id, movie_id)
); 
MYSQL

function insertMovies() {
  echo "Inserting movies..."
  # Remove headline
  cat ./initDB/$1/movies.csv | sed 1d | cut -d";" -f1,2 > temp.csv
  # Loop through each line
  cat temp.csv | while IFS=$';' read movie_id title 
  do
    echo "INSERT IGNORE INTO movies (movie_id, title) VALUES ($movie_id, $title);"
  done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
  echo "Movies inserted"
  rm temp.csv
}

function insertUsers() {
  echo "Inserting users..."
  # Remove headline
  cat ./initDB/$1/users.csv | sed 1d | cut -d";" -f1,2 > temp.csv
  # Loop through each line
  cat temp.csv | while IFS=$';' read user_id name
  do
    echo "INSERT IGNORE INTO users (user_id, name) VALUES ($user_id, '$name');"
  done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
  echo "Users inserted"
  rm temp.csv
}

function insertRatings() {
  echo "Inserting ratings..."
  # Remove headline
  cat ./initDB/$1/ratings.csv | sed 1d | cut -d";" -f1,2,3 > temp.csv
  # Loop through each line
  cat temp.csv | while IFS=$';' read user_id movie_id rating
  do
    echo "INSERT IGNORE INTO ratings (user_id, movie_id, rating) VALUES ($user_id, $movie_id, $rating);"
  done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
  echo "Ratings inserted"
  rm temp.csv
}

insertMovies $2
insertUsers $2
insertRatings $2     

