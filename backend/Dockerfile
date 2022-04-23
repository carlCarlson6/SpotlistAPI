# syntax=docker/dockerfile:1

FROM node:14.16.0

WORKDIR /backend

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
COPY src /backend/src

RUN npm install
RUN npm run build

CMD ["node", "./build/index.js"]