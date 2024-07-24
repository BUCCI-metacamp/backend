const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/connection');

module.exports = class Production extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        time: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
          primaryKey: true
        },
        // 1은 양품 0은 불량
        type: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: false,
      }
    );
  }

  static async createHypertable() {
    await sequelize.query(`
      SELECT create_hypertable('productions', 'time', if_not_exists => TRUE);
    `);
  }
};