#!/bin/bash

path=$1
env=$([ -z "$2" ] && echo "../server/.env" || echo $2)

if [ $# -eq 0 ]; then
  echo "ERROR: No arguments supplied"
  echo "Requires: path to the dataset folder"
  echo "Optional: path to .env (default: ../server/.env)"
  exit;
fi

if [ ! -f "$env" ]; then
  echo "The .env file could not be found."
  exit
fi

function getEnv() {
  grep "$1" $env | cut -d '=' -f2 | sed -n 1p
}

# Get env variables
ROOT_PASSWORD=$(getEnv ROOT_PASSWORD)
ROOT=$(getEnv ROOT)
DATABASE=$(getEnv DATABASE)

# Check that Docker is running
if [ docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} -e "select 1" > /dev/null 2>&1 ]; then echo You need to start Docker first; exit; fi

echo "Inserting movies..."
# Format data
  cat $path/movies.csv | sed 1d | sed 's/,/;/g' | sed 's/"//g' | cut -d";" -f1,2 > temp.csv
# Loop through each line
cat temp.csv | while IFS=$';' read movie_id title 
do
  echo "INSERT IGNORE INTO movies (movie_id, title) VALUES ($movie_id, '$title');"
done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
echo "Movies inserted"
rm temp.csv

echo "Inserting users..."
# Format data
cat $path/users.csv | sed 1d | sed 's/,/;/g' | sed 's/"//g' | cut -d";" -f1,2 > temp.csv
# Loop through each line
cat temp.csv | while IFS=$';' read user_id name
do
  echo "INSERT IGNORE INTO users (user_id, name) VALUES ($user_id, '$name');"
done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
echo "Users inserted"
rm temp.csv

echo "Inserting ratings..."
# Format data
cat $path/ratings.csv | sed 1d | sed 's/,/;/g' | sed 's/"//g' | cut -d";" -f1,2,3 > temp.csv
# Loop through each line
cat temp.csv | while IFS=$';' read user_id movie_id rating
do
  echo "INSERT IGNORE INTO ratings (user_id, movie_id, rating) VALUES ($user_id, $movie_id, $rating);"
done | docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE}
echo "Ratings inserted"
rm temp.csv