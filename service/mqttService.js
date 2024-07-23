const logger = require('../lib/logger');
const powerStateDao = require('../dao/powerStateDao');

const service = {
  previousPowerState: null,

  statusDataReceivedHandler(array) {
    const time = array.find(obj => obj.tagId === "0");
    console.log(`시간: ${time.value}`);
  },

  powerDataReceivedHandler(data) {
    if (this.previousPowerState == null || this.previousPowerState != data) {
      try {
        this.previousPowerState = data;
        powerStateDao.insert({
          value: data
        });
      } catch (error) {
        logger.error('(onDataReceivedHandler)', error);
      }
    }
  }
}

module.exports = service;