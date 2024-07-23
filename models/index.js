const { sequelize } = require('./connection');
const User = require('./user');
const Report = require('./report');
const Edukit = require('./edukit');
const PowerState = require('./powerState');

const db = {};

db.sequelize = sequelize;

// model 생성
db.User = User;
db.Report = Report;
db.Edukit = Edukit;
db.PowerState = PowerState;

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

// 테이블 생성 및 hypertable 설정
(async () => {
  try {
    await sequelize.sync(); // 테이블을 생성
    for (const modelName of Object.keys(db)) {
      if (db[modelName].createHypertable) {
        try {
          await db[modelName].createHypertable();
          console.log(`${modelName} hypertable 생성 성공`);
        } catch (err) {
          console.error(`${modelName} hypertable 생성 실패:`, err);
        }
      }
    }
  } catch (err) {
    console.error('테이블 생성 실패:', err);
  }
})();

module.exports = db;