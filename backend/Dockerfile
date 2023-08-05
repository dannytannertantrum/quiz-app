# syntax=docker/dockerfile:1

# pull official base image
FROM python:3.11.2-slim-buster

# set working directory
WORKDIR /code

# set environment variables
# Prevent Python from writing pyc files to disc and from buffering stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
  && apt-get -y install netcat gcc \
  && apt-get clean

# install python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app and put this COPY command at bottom to not reinstall packages every time
COPY . .

# `+x` sets the executable permission for a file, allowing it to be executed as a program or script.
# The `+x` option, where `+` indicates adding permissions and `x` indicates the executable permission.
COPY ./entrypoint.sh .
RUN chmod +x /code/entrypoint.sh

# An ENTRYPOINT allows us to configure a container that will run as an executable.
# It's like CMD, but a key difference is that the ENTRYPOINT command is not easily overridden.
# When a container is started, any command-line arguments provided are appended to the ENTRYPOINT command,
# rather than replacing it. 
ENTRYPOINT [ "/code/entrypoint.sh" ]
