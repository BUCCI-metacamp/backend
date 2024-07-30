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
        GoodProductRatio: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        Line01GoodProductRatio: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        Line02GoodProductRatio: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        Line03GoodProductRatio: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: false,
        indexes: [
          {
            name: 'idx_m01_m02_m03_conv',
            fields: [
              'm01_duration',
              'm01_time',
              'm02_duration',
              'm02_time',
              'm03_duration',
              'm03_time',
              'conv_speed_ratio'
            ],
            unique: false
          }
        ]
      }
    );
  }

  static async createHypertable() {
    await sequelize.query(`
      SELECT create_hypertable('simulation_results', 'time', if_not_exists => TRUE);
    `);
  }
};