const logger = require('../lib/logger');
const socketHandler = require('../socket/socketHandler');
const powerStateDao = require('../dao/powerStateDao');
const productionDao = require('../dao/productionDao');

const service = {
  isProcessStart: false,
  previousPowerState: null,

  previousPassCount: null,
  previousFailCount: null,

  statusDataReceivedHandler(array) {
    sendEdukitData(array);
    const time = array.find(obj => obj.tagId === "0");

    const passCount = Number(array.find(obj => obj.tagId === "17").value);
    const failCount = Number(array.find(obj => obj.tagId === "44").value);

    console.log(passCount, failCount, service.previousPassCount, service.previousFailCount, );
    // 양품 불량 체크
    try {
      // 서버 시작 시 초기화
      if (service.previousPassCount === null) {
        service.previousPassCount = passCount;
      }
      if (service.previousFailCount === null) {
        service.previousFailCount = failCount;
      }
      // 양품 갯수가 증가 했을 때
      if (passCount && service.previousPassCount != null && passCount > service.previousPassCount) {
        productionDao.insert({
          time: time.value,
          type: 1,
          value: passCount - service.previousPassCount
        });
        service.previousPassCount = passCount;
      }
      if (passCount < service.previousPassCount) {
        service.previousPassCount = 0;
      }
      // 불량 갯수가 증가 했을 때
      if (failCount && service.previousFailCount != null && failCount > service.previousFailCount) {
        productionDao.insert({
          time: time.value,
          type: 0,
          value: failCount - service.previousFailCount
        });
        service.previousFailCount = failCount;
      }
      if (failCount < service.previousFailCount) {
        service.previousFailCount = 0;
      }
    } catch (error) {
      logger.error('(statusDataReceivedHandler)', error);
    }

    sendProductionData(passCount, failCount);
  },

  powerDataReceivedHandler(data) {
    // data가 들어온 적 없거나 이전과 다를 경우
    if (service.previousPowerState == null || service.previousPowerState != data) {
      try {
        service.previousPowerState = data;
        powerStateDao.insert({
          value: data
        });
        socketHandler.emitToRoom('edukit', 'change_power', data);
        socketHandler.emitToRoom('production', 'change_power', data);
      } catch (error) {
        logger.error('(powerDataReceivedHandler)', error);
      }
    }
  }
}

const sendEdukitData = (array) => {
  // socket edukit room에 전송 할 데이터 tagId
  const edukitTagIds = ["0", "6", "37", "3", "2", "26", "27", "28", "29", "25", "24", "5", "40", "21", "22"];

  // 데이터 전송
  const filteredArray = array.filter(obj => edukitTagIds.includes(obj.tagId));
  socketHandler.emitToRoom('edukit', 'edukit_data', filteredArray);
}

const sendProductionData = async (passCount, failCount) => {
  const recentPowerState = await powerStateDao.findRecent();
  if (recentPowerState.value) {
    const totalPassCount = await productionDao.sumValueAfterTimeByType({
      time: recentPowerState.time,
      type: 1
    });
    const totalFailCount = await productionDao.sumValueAfterTimeByType({
      time: recentPowerState.time,
      type: 0
    });
    socketHandler.emitToRoom('production', 'production_data', {
      passCount: passCount ? passCount : 0,
      failCount: failCount ? failCount : 0,
      totalPassCount: totalPassCount,
      totalFailCount: totalFailCount,
    })
  }
}

module.exports = service;