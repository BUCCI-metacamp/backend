const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./lib/logger');
const models = require('../shared/models/index');
const corsConfig = require('./config/corsConfig.json');
const errorHandler = require('./error/ErrorHandler')
const { createTimescaleExtension } = require('../shared/config/connection');
const mqttClient = require('./mqtt/mqttClient');

dotenv.config();

const { NODE_ENV } = process.env;

const app = express();
logger.info('app start');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// DB 연결 확인 및 table 생성
models.sequelize.authenticate().then(() => {
  logger.info('DB connection success');

  // createTimescaleExtension();

  // // sequelize sync (table 생성)
  // models.sequelize.sync().then(() => {
  //   logger.info('Sequelize sync success');
  // }).catch((error) => {
  //   logger.error('Sequelize sync error', error);
  // });
}).catch((error) => {
  logger.error('DB Connection fail', error);
});

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(errorHandler);

module.exports = app;