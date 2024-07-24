const logger = require('../lib/logger');
const powerStateDao = require('../dao/powerStateDao');
const socketHandler = require('../socket/socketHandler');

const service = {
  isProcessStart: false,
  previousPowerState: null,

  statusDataReceivedHandler(array) {
    // socket edukit room에 전송 할 데이터 tagId
    const edukitTagIds = ["6", "37", "3", "2", "26", "27", "28", "29", "25", "24" ]
    const time = array.find(obj => obj.tagId === "0");
    console.log(`시간: ${time.value}`);
    const startState = array.find(obj => obj.tagId === "1");
    if (startState.value === true) {

    }
  },

  powerDataReceivedHandler(data) {
    // data가 들어온 적 없거나 이전과 다를 경우
    if (this.previousPowerState == null || this.previousPowerState != data) {
      try {
        this.previousPowerState = data;
        powerStateDao.insert({
          value: data
        });
        socketHandler.emitToRoom('edukit', 'change_power', data);
        socketHandler.emitToRoom('production', 'change_power', data);
      } catch (error) {
        logger.error('(onDataReceivedHandler)', error);
      }
    }
  }
}

module.exports = service;