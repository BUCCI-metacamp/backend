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
  }
}

module.exports = dao;