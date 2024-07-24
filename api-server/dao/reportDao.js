const { Report, User } = require("../../shared/models/index");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      Report.create(params)
        .then((inserted) => {
          resolve(inserted?.toJSON());
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 리스트 조회
  list(params) {
    const offset = (params.page - 1) * params.limit;
    return new Promise((resolve, reject) => {
      Report.findAndCountAll({
        limit: params.limit,
        offset: offset,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "title", "createdAt", "updatedAt"],
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "name", "userId"]
          }
        ]
      })
        .then((result) => {
          resolve({
            data: result.rows.map((row) => row.toJSON()),
            totalCount: result.count
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  info(params) {
    return new Promise((resolve, reject) => {
      Report.findByPk(params.id, {
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "name", "userId"]
          }
        ]
      })
        .then((report) => {
          resolve(report?.toJSON());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;