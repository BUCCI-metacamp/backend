const { Operation } = require("../../shared/models/index");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      Operation.create(params)
        .then((inserted) => {
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 최근 n개 값 조회
  findRecentWithLimit(limit) {
    return new Promise((resolve, reject) => {
      Operation.findAll({ order: [["time", "DESC"]], limit: limit })
        .then((recent) => {
          resolve(recent.map((data) => data?.toJSON()));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;