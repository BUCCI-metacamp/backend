FROM node:16

WORKDIR /app

COPY api-server/package*.json ./api-server/
COPY shared/package*.json ./shared/

RUN cd api-server && npm install
RUN cd ../shared && npm install

COPY . .

WORKDIR /app/api-server

CMD ["npm", "start"]
