const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const reportDao = require('../dao/reportDao');

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
  }
}

module.exports = service;