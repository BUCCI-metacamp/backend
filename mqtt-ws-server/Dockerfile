FROM node:16

WORKDIR /app

COPY mqtt-ws-server/package*.json ./mqtt-ws-server/
COPY shared/package*.json ./shared/

RUN cd mqtt-ws-server && npm install
RUN cd ../shared && npm install

COPY . .

WORKDIR /app/mqtt-ws-server

CMD ["npm", "start"]
