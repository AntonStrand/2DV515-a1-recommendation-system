#!/bin/bash

DATASET_PATH=$1
ENV=${2:-"../server/.env"}
CONTAINER=${3:-"db"}

if [ $# -eq 0 ]; then
  echo "ERROR: No arguments supplied"
  echo "Requires: path to the dataset folder"
  echo "Optional: path to .env (default: ../server/.env)"
  exit 1;
fi

# Verify that the provided dataset directory exists and contains all the files.
if [[ ! -d $DATASET_PATH ]]; then echo "Directory \"$DATASET_PATH\" does not exists."; exit 1; fi
if [[ ! -f "$DATASET_PATH/movies.csv" ]]; then echo "Directory \"$DATASET_PATH\" does not contain \"movies.csv\"."; exit 1; fi
if [[ ! -f "$DATASET_PATH/ratings.csv" ]]; then echo "Directory \"$DATASET_PATH\" does not contain \"ratings.csv\"."; exit 1; fi
if [[ ! -f "$DATASET_PATH/users.csv" ]]; then echo "Directory \"$DATASET_PATH\" does not contain \"users.csv\"."; exit 1; fi

if [ ! -f "$ENV" ]; then
  echo "The .env file could not be found."
  exit
fi

function getEnv() {
  grep "$1" $ENV | cut -d '=' -f2 | head -n1
}

# Get env variables
ROOT_PASSWORD=$(getEnv ROOT_PASSWORD)
ROOT=$(getEnv ROOT)
DATABASE=$(getEnv DATABASE)

# Check that Docker is running
IS_DOCKER_RUNNING=$(docker inspect --format="{{.State.Running}}" $CONTAINER 2> /dev/null)
if [[ "$IS_DOCKER_RUNNING" == "false" ]]; then echo "You need to start Docker first"; exit 1; fi

echo "Inserting movies..."
# Format data
  cat $DATASET_PATH/movies.csv | sed 1d | sed 's/,/;/g' | sed 's/"//g' | cut -d";" -f1,2 > temp.csv
# Loop through each line
cat temp.csv | while IFS=$';' read movie_id title 
do
  echo "INSERT IGNORE INTO movies (movie_id, title) VALUES ($movie_id, '$title');"
done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
echo "Movies inserted"
rm temp.csv

echo "Inserting users..."
# Format data
cat $DATASET_PATH/users.csv | sed 1d | sed 's/,/;/g' | sed 's/"//g' | cut -d";" -f1,2 > temp.csv
# Loop through each line
cat temp.csv | while IFS=$';' read user_id name
do
  echo "INSERT IGNORE INTO users (user_id, name) VALUES ($user_id, '$name');"
done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
echo "Users inserted"
rm temp.csv

echo "Inserting ratings..."
# Format data
cat $DATASET_PATH/ratings.csv | sed 1d | sed 's/,/;/g' | sed 's/"//g' | cut -d";" -f1,2,3 > temp.csv
# Loop through each line
cat temp.csv | while IFS=$';' read user_id movie_id rating
do
  echo "INSERT IGNORE INTO ratings (user_id, movie_id, rating) VALUES ($user_id, $movie_id, $rating);"
done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
echo "Ratings inserted"
rm temp.csv