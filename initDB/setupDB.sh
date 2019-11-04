#!/bin/bash

file=../server/.env
if [ -f "$file" ]; then
  echo "WARNING: Files already exist are you sure you want to overwrite with new passwords?"
  read -p "Continue (y/n)?" choice
  if [[ ! $choice =~ ^[Yy]$ ]]
  then
      echo "Exit"
      exit
  fi
fi

if [[ $# -eq 0 ]]; then
  echo "No arguments suplied"
  echo "prod  for production"
  echo "dev   for development"
  exit
elif [ "$1" == "prod" ]; then
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
  echo "Unknown parameter"
  echo "prod  for production"
  echo "dev   for development"
  exit
fi

# Create .env settings
cat > ../server/.env <<EOF
#!/usr/bin/env bash
# Node
NODE_ENV=$NODE_ENV

# MySQL
MYSQL_VERSION=5.7.22
MYSQL_HOST=movieSQL
MYSQL_DATABASE=$DATABASE
MYSQL_ROOT_USER=$ROOT
MYSQL_ROOT_PASSWORD=$ROOT_PASSWORD
MYSQL_USER=$MYSQL_USERNAME
MYSQL_PASSWORD=$MYSQL_PASSWORD
EOF

echo "Start with: docker-compose up"
cd ..
docker-compose up
