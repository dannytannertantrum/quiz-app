# syntax=docker/dockerfile:1

FROM node:20-alpine

WORKDIR /code

COPY package.json package-lock.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]
