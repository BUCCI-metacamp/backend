FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY api-server/package*.json ./api-server/
RUN cd api-server && npm install

COPY api-server/ ./api-server/
COPY shared/ ./shared/

WORKDIR /app/api-server

CMD ["npm", "start"]
