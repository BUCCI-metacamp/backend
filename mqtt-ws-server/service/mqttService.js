const axios = require('axios');
const logger = require('../lib/logger');
const socketHandler = require('../socket/socketHandler');
const powerStateDao = require('../dao/powerStateDao');
const productionDao = require('../dao/productionDao');
const simulationResultDao = require('../dao/simulationResultDao');
const operationDao = require('../dao/operationDao');

const service = {
  isProcessStart: false,
  previousPowerState: null,

  previousPassCount: null,
  previousFailCount: null,

  statusDataReceivedHandler(array) {
    sendEdukitData(array);
    const time = array.find(obj => obj.tagId === "0");

    const startState = array.find(obj => obj.tagId === "1").value;

    const passCount = Number(array.find(obj => obj.tagId === "17").value);
    const failCount = Number(array.find(obj => obj.tagId === "44").value);
    try {
      // 공정 상태 변경 처리
      if (service.isProcessStart ^ startState) {
        operationDao.insert({
          value: startState,
        });
        service.isProcessStart = startState;
      }
    } catch (error) {
      logger.error(`(statusDataReceivedHandler)-startState ${error.toString()}`);
    }
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
      logger.error(`(statusDataReceivedHandler) ${error.toString()}`);
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
        logger.error(`(powerDataReceivedHandler) ${error.toString()}`);
      }
    }
  },

  simulationDataReceivedHandler(data) {
    try {
      removeOutliersAndSendData(data);
    } catch (error) {
      logger.error(`(simulationDataReceivedHandler) ${error.toString()}`);
    }
  },

  simulationRequestReceivedHandler(data, client) {
    logger.info(`(simulationRequestReceivedHandler) ${data.toString()}`);
    try {
      const tag = parseInt(data.request);
      if (tag === 0) {
        sendOptimalData(client);
      }
      else if (tag === 1) {
        resetAIModel();
      }
    } catch (error) {
      logger.error(`(simulationRequestReceivedHandler) ${error.toString()}`);
    }
  }
}

const sendEdukitData = (array) => {
  // socket edukit room에 전송 할 데이터 tagId
  const edukitTagIds = ["0", "4", "6", "9", "10", "11", "35", "37", "3", "2", "26", "27", "28", "29", "25", "24", "5", "40", "21", "22"];

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
    const totalCountLog = [];
    const failCountLog = [];

    const recentOperations = await operationDao.findRecentWithLimit(20);

    let count = 0;
    for (const [i, operation] of recentOperations.entries()) {
      console.log(operation);
      if (i > 0 && !recentOperations[i - 1].value && operation.value) {
        const startTime = recentPowerState.time
        const endTime = recentOperations[i - 1].time;

        console.log(startTime, '~', endTime, startTime > endTime);

        if (startTime > endTime) break;


        // true ~ false 인 시간 동안의 pass와 fail count를 productionDao를 통해 조회
        const passCount = await productionDao.sumValueBetweenTimesByType({
          startTime,
          endTime,
          type: 1
        });
        const failCount = await productionDao.sumValueBetweenTimesByType({
          startTime,
          endTime,
          type: 0
        });

        // 배열에 담기
        totalCountLog.push({ time: endTime, totalCount: passCount + failCount });
        failCountLog.push({ time: endTime, totalCount: failCount });

        count++;
        if (count === 5) break;
      }
    }

    socketHandler.emitToRoom('production', 'production_data', {
      passCount: passCount ? passCount : 0,
      failCount: failCount ? failCount : 0,
      totalPassCount: totalPassCount ? totalPassCount : 0,
      totalFailCount: totalFailCount ? totalFailCount : 0,
      totalCountLog: totalCountLog,
      failCountLog: failCountLog,
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

const sendOptimalData = async (client) => {
  const dict = {
    "BenefitPerTime": 0,
    "Benefit": 1,
    "GoodProductRatio": 2
  }
  axios.get(`${process.env.AI_ENDPOINT}/predict`)
    .then(response => {
      const inputData = response.data
      let transformedData = [];
      for (const [key, values] of Object.entries(inputData)) {
        transformedData.push({
          target: dict[key],
          targetValue: (key == "GoodProductRatio" ? (values.best_target_value * 100).toFixed(2) : values.best_target_value.toFixed(2)),
          M01Duration: values.best_values.M01Duration.toFixed(2),
          M01Time: values.best_values.M01Time.toFixed(2),
          M02Duration: values.best_values.M02Duration.toFixed(2),
          M02Time: values.best_values.M02Time.toFixed(2),
          M03Duration: values.best_values.M03Duration.toFixed(2),
          M03Time: values.best_values.M03Time.toFixed(2),
          ConvSpeedRatio: values.best_values.ConvSpeedRatio.toFixed(2),
          Line01GoodProductRatio: (values.best_values.Line01GoodProductRatio * 100).toFixed(2),
          Line02GoodProductRatio: (values.best_values.Line02GoodProductRatio * 100).toFixed(2),
          Line03GoodProductRatio: (values.best_values.Line03GoodProductRatio * 100).toFixed(2),
        });
      }
      client.publish('simulation/optimal/data', JSON.stringify(transformedData))
      logger.info(`(simulationRequestReceivedHandler) Data: ${transformed_data}`);
    })
    .catch(error => {
      logger.error(`(simulationRequestReceivedHandler) API request error: ${error.toString()}`);
    });
}

const resetAIModel = async () => {
  logger.info('reset model');
  // axios.post(`${process.env.AI_ENDPOINT}/reset`)
  //   .then(response => {
  //     logger.info('(simulationDataReceivedHandler) Data sent to API:', response.data);
  //   })
  //   .catch(error => {
  //     logger.error('(simulationDataReceivedHandler) API request error:', error);
  //   });
}

module.exports = service;