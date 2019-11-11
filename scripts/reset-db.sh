#!/bin/bash

ENV=${1:-"../server/.env"}
CONTAINER=${3:-"db"}

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

# Reset tables
docker exec -i db mysql -u${ROOT} -p${ROOT_PASSWORD} ${DATABASE} <<MYSQL
TRUNCATE movies;
TRUNCATE users;
TRUNCATE ratings;
MYSQL