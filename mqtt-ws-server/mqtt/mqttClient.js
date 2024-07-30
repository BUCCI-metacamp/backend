const mqtt = require('mqtt');
const awsIot = require('aws-iot-device-sdk');
const fs = require('fs');
const logger = require('../lib/logger');
const { statusDataReceivedHandler, powerDataReceivedHandler, simulationDataReceivedHandler, optimalRequestReceivedHandler } = require('../service/mqttService');

const client = mqtt.connect(process.env.IOT_ENDPOINT);

client.on('connect', () => {
  logger.info('MQTT client connected');
  client.subscribe(['edge/edukit/status', 'edge/edukit/power', 'simulation/data', 'simulation/optimal/request']);
});

client.on('message', async (topic, message) => {
  const messageString = message.toString();
  logger.info(`토픽 ${topic}에서 메시지 수신: ${messageString}`);
  switch (topic) {
    case 'edge/edukit/status':
      statusDataReceivedHandler(JSON.parse(messageString));
      break;
    case 'edge/edukit/power':
      powerDataReceivedHandler(JSON.parse(messageString));
      break;
    case 'simulation/data':
      simulationDataReceivedHandler(JSON.parse(messageString));
      break;
    case 'simulation/optimal/request':
      optimalRequestReceivedHandler();
      break;
    default:
      logger.info(`처리되지 않은 토픽: ${topic}`);
  }
});

client.on('close', () => {
  logger.info('MQTT client disconnected');
})

client.on('error', function(error) {
  logger.error('MQTT client Error:', error);
});

module.exports = client;
