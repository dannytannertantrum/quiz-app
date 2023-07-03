#!/bin/sh

echo "Waiting for postgres..."

# nc = netcat - a networking utility with the help of TCP/IP protocol which reads and writes data across network connections.
# The nc -z option checks for the TCP connection without sending any data.
while ! nc -z web-database 5432; do
  # Use 0.1 to not overwhelm the system with continuous connection attempts
  sleep 0.1
done

echo "PostgreSQL started"

# This line executes the command or script provided as arguments
# when running the Entrypoint.sh file.
exec "$@"
