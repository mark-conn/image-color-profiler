FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g nodemon
COPY package.json /app/package.json
RUN npm install \
 && npm ls \
 && npm cache clean --force \
 && mv /app/node_modules /node_modules
COPY . /app

ENV PORT 4000
EXPOSE 4000

CMD ["node", "server.js"]