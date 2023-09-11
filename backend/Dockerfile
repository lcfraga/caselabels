FROM node:20.6.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
CMD bin/start-server
