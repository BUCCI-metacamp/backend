const { Op } = require("sequelize");
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
    // 검색 조건
    const whereConditions = {};
    if (params.user.role !== 'admin') {
      whereConditions.userId = params.user.id;
    }
    if (params.title) {
      whereConditions.title = { [Op.like]: `%${params.title}%` };
    }
    if (params.content) {
      whereConditions.content = { [Op.like]: `%${params.content}%` };
    }

    const includeConditions = [{
      model: User,
      as: 'author',
      attributes: ['id', 'name', 'userId']
    }];
    if (params.userName) {
      includeConditions[0].where = { name: params.userName };
    }

    const offset = (params.page - 1) * params.limit;
    return new Promise((resolve, reject) => {
      Report.findAndCountAll({
        limit: params.limit,
        offset: offset,
        order: [["createdAt", "DESC"]],
        attributes: ["id", "title", "createdAt", "updatedAt"],
        where: whereConditions,
        include: includeConditions
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
  },

  delete(params) {
    return new Promise((resolve, reject) => {
      Report.destroy({ where: { id: params.id } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = dao;