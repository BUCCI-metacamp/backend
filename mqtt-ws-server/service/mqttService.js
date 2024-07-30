const axios = require('axios');
const logger = require('../lib/logger');
const socketHandler = require('../socket/socketHandler');
const powerStateDao = require('../dao/powerStateDao');
const productionDao = require('../dao/productionDao');
const simulationResultDao = require('../dao/simulationResultDao');

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
  },

  simulationDataReceivedHandler(data) {
    try {
      // 데이터 변환 전처리
      // {
      //   M01Duration(1호기 푸셔 속도): float,
      //   M01Time(1호기 동작 간격): float,
      //   M02Duration(2호기 푸셔 속도): float,
      //   M02Time(2호기 작동 시간): float,
      //   M03Duration(3호기 푸셔 속도): float,
      //   M03Time(3호기 작동 시간): float,
      //   ConvSpeedRatio(컨베이어 속도): float,
      //   BenefitPerTime(시간당수익): float,
      //   Benefit(총 수익): float,
      //   Good(양품률 0~1사이): float,
      // }

      removeOutliersAndSendData(data);
    } catch (error) {
      logger.error('(simulationDataReceivedHandler)', error);
    }
  },

  optimalRequestReceivedHandler() {
    axios.get(`${process.env.AI_ENDPOINT}/predict`)
      .then(response => {
        logger.info('(optimalRequestReceivedHandler) Data sent to API:', response.data);
      })
      .catch(error => {
        logger.error('(optimalRequestReceivedHandler) API request error:', error);
      });
  }
}

const sendEdukitData = (array) => {
  // socket edukit room에 전송 할 데이터 tagId
  const edukitTagIds = ["0", "4", "6", "37", "3", "2", "26", "27", "28", "29", "25", "24", "5", "40", "21", "22"];

  // 데이터 전송
  const filteredArray = array.filter(obj => edukitTagIds.includes(obj.tagId));
  socketHandler.emitToRoom('edukit', 'edukit_data', filteredArray);
}

const sendProductionData = async (passCount, failCount) => {
  const recentPowerState = await powerStateDao.findRecent();
  if (recentPowerState && recentPowerState.value) {
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
      totalPassCount: totalPassCount ? totalPassCount : 0,
      totalFailCount: totalFailCount ? totalFailCount : 0,
    })
  }
}

const removeOutliersAndSendData = async (data) => {
  try {
    logger.info(`(removeOutliersAndSendData) data: ${data}`);

    // db에 저장
    await simulationResultDao.insert(data);

    const dataArray = await simulationResultDao.findAllByValues(data);

    const goodValues = dataArray.map(value => value.GoodProductRatio);
    const mean = goodValues.reduce((acc, val) => acc + val, 0) / goodValues.length;
    const variance = goodValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / goodValues.length;
    const stdDev = Math.sqrt(variance);

    const lowerBound = mean - 1.4 * stdDev;
    const upperBound = mean + 1.4 * stdDev;

    logger.info(`(removeOutliersAndSendData) lowerBound: ${lowerBound}, upperBound: ${upperBound}`);

    if (data.GoodProductRatio >= lowerBound && data.GoodProductRatio <= upperBound) {
      const requestData = {
        "values": {
          "M01Duration": data.M01Duration,
          "M01Time": data.M01Time,
          "M02Duration": data.M02Duration,
          "M02Time": data.M02Time,
          "M03Duration": data.M03Duration,
          "M03Time": data.M03Time,
          "ConvSpeedRatio": data.ConvSpeedRatio,
        },
        "targets": {
          "BenefitPerTime": data.BenefitPerTime,
          "Benefit": data.Benefit,
          "GoodProductRatio": data.GoodProductRatio,
          "Line01GoodProductRatio": data.Line01GoodProductRatio,
          "Line02GoodProductRatio": data.Line02GoodProductRatio,
          "Line03GoodProductRatio": data.Line03GoodProductRatio,
        }
      }
      // API 요청을 통해 ai 학습 서버로 데이터 전송
      axios.post(`${process.env.AI_ENDPOINT}/train`, requestData)
        .then(response => {
          logger.info('(simulationDataReceivedHandler) Data sent to API:', response.data);
        })
        .catch(error => {
          logger.error('(simulationDataReceivedHandler) API request error:', error);
        });
    } else {
      logger.info(`(removeOutliersAndSendData) Outlier detected. GoodProductRatio: ${GoodProductRatio}.`);
    }
  } catch (error) {
    logger.error(`(removeOutliersAndSendData) error: ${error.toString()}`)
  }
}

module.exports = service;