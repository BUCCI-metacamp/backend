const Sequelize = require("sequelize");

module.exports = class Report extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        startTime: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        uptime: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        finalTime: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        good: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        bad: {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
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
    db.Report.belongsTo(db.User, { foreignKey: { name: "userId" }, onDelete: "SET NULL", as: "author", });
  }
};
