const mqtt = require('mqtt');
const awsIot = require('aws-iot-device-sdk');
const fs = require('fs');
const logger = require('../lib/logger');
const { statusDataReceivedHandler, powerDataReceivedHandler, simulationDataReceivedHandler, simulationRequestReceivedHandler } = require('../service/mqttService');

const client = mqtt.connect(process.env.IOT_ENDPOINT);

client.on('connect', () => {
  logger.info('MQTT client connected');
  client.subscribe(['edge/edukit/status', 'edge/edukit/power', 'simulation/data', 'simulation/request']);
});

client.on('message', async (topic, message) => {
  const messageString = message.toString();
  logger.info(`토픽 ${topic}에서 메시지 수신: ${messageString}`);
  try {
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
      case 'simulation/request':
        simulationRequestReceivedHandler(JSON.parse(messageString), client);
        break;
      default:
        logger.info(`처리되지 않은 토픽: ${topic}`);
    }
  } catch (error) {
    logger.error(`(mqttClient.onMessage) Error: ${error}`);
  }
});

client.on('close', () => {
  logger.info('MQTT client disconnected');
})

client.on('error', function (error) {
  logger.error('MQTT client Error:', error);
});

const publishMessage = (topic, message) => {
  client.publish(topic, JSON.stringify(message), (err) => {
    if (err) {
      logger.error(`Failed to publish message to ${topic}: ${err}`);
    } else {
      logger.info(`Message published to ${topic}`);
    }
  });
};

module.exports = { client, publishMessage };
