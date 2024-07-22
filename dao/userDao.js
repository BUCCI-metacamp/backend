const { User } = require("../models/index");
const { findByPk } = require("../models/user");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      User.create(params)
        .then((inserted) => {
          // password는 제외하고 리턴함
          const { password, ...newInserted } = inserted?.toJSON();
          resolve(newInserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 아이디 조회
  findByUserId(params) {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: { userId: params.userId },
      })
        .then((user) => {
          resolve(user?.toJSON());
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // pk(id)로 조회
  findByPk(params) {
    return new Promise((resolve, reject) => {
      User.findByPk(params.id)
        .then((user) => {
          resolve(user?.toJSON());
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updatePassword(params) {
    return new Promise((resolve, reject) => {
      User.update(params, {
        where: { id: params.id },
      })
        .then(([updated]) => {
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;