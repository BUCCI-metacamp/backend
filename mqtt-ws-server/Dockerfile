FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY mqtt-ws-server/package*.json ./mqtt-ws-server/
RUN cd mqtt-ws-server && npm install

COPY mqtt-ws-server/ ./mqtt-ws-server/
COPY shared/ ./shared/

WORKDIR /app/mqtt-ws-server

CMD ["npm", "start"]
