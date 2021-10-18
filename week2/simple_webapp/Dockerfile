#!/bin/bash
FROM node:16-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE ${PORT}
CMD ["npm", "run", "start"]