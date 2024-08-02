const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/connection');

module.exports = class Operation extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        time: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
          primaryKey: true
        },
        value: {
          type: DataTypes.BOOLEAN,
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
      SELECT create_hypertable('operations', 'time', if_not_exists => TRUE);
    `);
  }
};