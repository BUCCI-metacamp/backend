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
  },

  // 특정 type의 제일 최근 값 조회
  findRecentByValue(value) {
    return new Promise((resolve, reject) => {
      Operation.findOne({
        where: { value: value },
        order: [["time", "DESC"]],
      })
        .then((recent) => {
          resolve(recent ? recent.toJSON() : null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;