const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const reportDao = require('../dao/reportDao');
const powerStateDao = require('../dao/powerStateDao');
const productionDao = require('../dao/productionDao');

const service = {
  // 업무 일지 등록
  async reg(params) {
    let inserted = null;
    try {
      inserted = await reportDao.insert(params);
      logger.debug(`(reportService.reg) ${JSON.stringify(inserted)}`);
    } catch (error) {
      logger.error(`(reportService.reg) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  // 업무 일지 리스트 조회
  async list(params) {
    let results = null;
    try {
      results = await reportDao.list(params);
      logger.debug(`(reportService.list) ${JSON.stringify(results)}`);
    } catch (error) {
      logger.error(`(reportService.list) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(results);
    });
  },

  // 업무 일지 상세 조회
  async detail(params) {
    let result = null;
    try {
      result = await reportDao.info(params);
      logger.debug(`(reportService.detail) ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`(reportService.detail) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  },

  // 업무 일지 데이터 조회
  async productData(params) {
    let result = {};
    try {
      const uptime = await powerStateDao.findRecent();
      if (uptime.value) {
        result.uptime = uptime.time;
        result.endTime = null;
        result.good = await productionDao.sumValueAfterTimeByType({ type: 1, time: uptime.time });
        result.bad = await productionDao.sumValueAfterTimeByType({ type: 0, time: uptime.time });
      }
      else {
        const recentOnTime = await powerStateDao.findOnRecent();
        result.uptime = recentOnTime.time;
        result.endTime = uptime.time;
        result.good = await productionDao.sumValueAfterTimeByType({ type: 1, time: result.uptime })
          - await productionDao.sumValueAfterTimeByType({ type: 1, time: uptime.time });
        result.bad = await productionDao.sumValueAfterTimeByType({ type: 0, time: result.uptime })
          - await productionDao.sumValueAfterTimeByType({ type: 0, time: uptime.time });
      }

      logger.debug(`(reportService.productData) ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`(reportService.productData) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    return new Promise((resolve) => {
      resolve(result);
    });
  }
}

module.exports = service;