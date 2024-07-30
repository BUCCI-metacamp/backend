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

  // input values가 같은 값들 조회
  findAllByValues(params) {
    return new Promise((resolve, reject) => {
      SimulationResult.findAll({
        where: {
          M01Duration: params.M01Duration,
          M01Time: params.M01Time,
          M02Duration: params.M02Duration,
          M02Time: params.M02Time,
          M03Duration: params.M03Duration,
          M03Time: params.M03Time,
          ConvSpeedRatio: params.ConvSpeedRatio
        }
      })
        .then((selected) => {
          const results = selected.map(data => data?.toJSON());
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;