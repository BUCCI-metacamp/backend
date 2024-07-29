const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../../shared/config/connection');

module.exports = class SimulationResult extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        time: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
          primaryKey: true
        },
        M01Duration: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        M01Time: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        M02Duration: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        M02Time: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        M03Duration: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        M03Time: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        ConvSpeedRatio: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        BenefitPerTime: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        Benefit: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        Good: {
          type: DataTypes.DOUBLE,
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
      SELECT create_hypertable('simulation_results', 'time', if_not_exists => TRUE);
    `);
  }
};