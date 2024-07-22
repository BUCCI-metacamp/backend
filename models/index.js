const { sequelize } = require('./connection');
const User = require('./user');
const Report = require('./report');

const db = {};

db.sequelize = sequelize;

// model 생성
db.User = User;
db.Report = Report;

console.log(Object.keys(db));
// model init
Object.keys(db).forEach((modelName) => {
  if (db[modelName].init) {
    db[modelName].init(sequelize);
  }
});

// model 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;