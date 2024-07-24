const { PowerState } = require("../../shared/models/index");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      PowerState.create(params)
        .then((inserted) => {
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 최근 값 조회
  findRecent() {
    return new Promise((resolve, reject) => {
      PowerState.findOne({ order: [["time", "DESC"]] })
       .then((recent) => {
          resolve(recent);
        })
       .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;