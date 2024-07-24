const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING(50),
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: true, // createAt, updatedAt
        paranoid: true, // deletedAt
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Report, { foreignKey: { name: 'userId' }, onDelete: 'SET NULL', as: 'Report' });
  }
};
