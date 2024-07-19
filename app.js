const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('./lib/logger');
const corsConfig = require('./config/corsConfig.json');
const errorHandler = require('./error/ErrorHandler')
const indexRouter = require('./routes/index');

dotenv.config();

const { NODE_ENV } = process.env;

const app = express();
logger.info('app start');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Supabase 클라이언트 생성
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// supabase 클라이언트를 app.locals에 저장
app.locals.supabase = supabase;

app.use('/', indexRouter);

app.use(errorHandler);

module.exports = app;