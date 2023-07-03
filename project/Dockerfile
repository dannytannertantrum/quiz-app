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
