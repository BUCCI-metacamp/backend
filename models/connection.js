const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const db = {
  username: process.env.DB_ID,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};

// sequelize 생성
const sequelize = new Sequelize(
  db.database,
  db.username,
  db.password,
  {
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    pool: {
      max: 10, // 최대 연결 수
      min: 1,  // 최소 연결 수
      acquire: 30000, // 연결을 획득하는 데 최대 시간 (ms)
      idle: 10000,    // 연결이 유휴 상태로 유지될 수 있는 최대 시간 (ms)
    },
  },
);

exports.sequelize = sequelize;