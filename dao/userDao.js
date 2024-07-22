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

  // 유저 정보 갱신
  update(params) {
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
  }, 

  // 유저 삭제
  delete(params) {
    return new Promise((resolve, reject) => {
      User.destroy({
        where: { id: params.id },
      })
        .then((deleted) => {
          resolve({ deletedCount: deleted });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;