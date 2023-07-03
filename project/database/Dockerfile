# pull official base image
FROM postgres:15

# run create.sql on init
# Check out "Initialization scripts" here: https://hub.docker.com/_/postgres/ - our create.sql will execute on init.
ADD create.sql /docker-entrypoint-initdb.d
