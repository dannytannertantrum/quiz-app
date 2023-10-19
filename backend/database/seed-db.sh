#!/bin/bash

# Define the name of the PostgreSQL service and Docker Compose project
SERVICE_NAME="db"

# Define the path to your seed script
SQL_FILE_PATH="./seed.sql"

# Use docker-compose to execute the script within the container
# The -T option disables pseudo-tty allocation, which is often necessary when executing Docker Compose commands in scripts.
docker-compose exec -T $SERVICE_NAME psql -U postgres -d dev -a -f - < $SQL_FILE_PATH
