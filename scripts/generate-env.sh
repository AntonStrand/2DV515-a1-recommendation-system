#!/bin/bash

# Set default values if not provided
overwrite=$([ -z "$2" ] && echo "n" || echo $2)
file=$([ -z "$3" ] && echo "../server/.env" || echo $3)

# Check for valid commands
if [ $# -eq 0 ]; then
  echo "ERROR: No arguments supplied"
  echo "Requires: environment (prod/dev)"
  echo "Optional: silent overwrite (y/N) and path to .env (default: ../server/.env)"
  exit;
else
  if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
    if [ -f "$file" ]; then
      read -p  "[WARNING] Files already exist are you sure you want to overwrite with new passwords? [Y/n] " choice
      if [[ $choice =~ ^[Nn]$ ]]
      then
        echo "Exit"
        exit
      fi
    fi
  fi
fi


if [ "$1" == "prod" ]; then
  echo "Creating production credentials."
  NODE_ENV=production
  MYSQL_USERNAME=$(cat /dev/urandom | LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  MYSQL_PASSWORD=$(cat /dev/urandom | LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  ROOT=$(cat /dev/urandom | LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  ROOT_PASSWORD=$(cat /dev/urandom | LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  DATABASE=$(cat /dev/urandom | LC_CTYPE=C tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
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
cat > $file <<EOF
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