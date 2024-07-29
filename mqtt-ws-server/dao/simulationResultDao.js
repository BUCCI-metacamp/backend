const { SimulationResult } = require("../../shared/models/index");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      SimulationResult.create(params)
        .then((inserted) => {
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
}

module.exports = dao;