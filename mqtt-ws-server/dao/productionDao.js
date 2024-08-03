const { Op } = require("sequelize");
const { Production } = require("../../shared/models/index");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      Production.create(params)
        .then((inserted) => {
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 지정 시간 이후의 특정 type인 모든 데이터 value의 합
  sumValueAfterTimeByType(params) {
    return new Promise((resolve, reject) => {
      Production.sum('value', {
        where: {
          type: params.type,
          time: {
            [Op.gt]: params.time
          }
        }
      })
        .then((sum) => {
          resolve(sum);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 지정 시간 범위 내의 특정 type인 모든 데이터 value의 합
  sumValueBetweenTimesByType(params) {
    return new Promise((resolve, reject) => {
      Production.sum('value', {
        where: {
          type: params.type,
          time: {
            [Op.between]: [params.startTime, params.endTime]
          }
        }
      })
        .then((sum) => {
          resolve(sum);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 특정 시간 사이의 모든 데이터 조회
  findAllAfterTime(params) {
    return new Promise((resolve, reject) => {
      const { startTime } = params;

      Production.findAll({
        where: {
          time: {
            [Op.gte]: startTime
          }
        }
      })
        .then(data => resolve(data.map(o => o.toJSON())))
        .catch(error => reject(error));
    });
  }
}

module.exports = dao;