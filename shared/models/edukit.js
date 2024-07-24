const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/connection');

module.exports = class Edukit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        time: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
          primaryKey: true
        },
        tagId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false
        },
        value: {
          type: DataTypes.TEXT,
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
      SELECT create_hypertable('edukits', 'time', if_not_exists => TRUE);
    `);
  }
};