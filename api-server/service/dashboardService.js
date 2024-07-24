const logger = require('../lib/logger');
const powerStateDao = require('../dao/powerStateDao');
const CustomError = require('../error/CustomError');

const service = {
  // 제일 최근 가동 시간
  async getUptime() {
    let result = null;
    try {
      result = await powerStateDao.findRecent();
      logger.debug(`(dashboardService.getUptime) ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`(dashboardService.getUptime) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(new CustomError(500, 'Internal Server Error'));
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  }
}

module.exports = service;