// mqttClient.js
const mqtt = require('mqtt');
const logger = require('../lib/logger');
const { statusDataReceivedHandler, powerDataReceivedHandler } = require('../service/mqttService');

const client = mqtt.connect('mqtt://192.168.0.64:1883');

client.on('connect', () => {
  logger.info('MQTT client connected');
  client.subscribe(['edge/edukit/status', 'edge/edukit/power']);
});

client.on('message', async (topic, message) => {
  const messageString = message.toString();
  // logger.info(`토픽 ${topic}에서 메시지 수신: ${messageString}`);
  switch (topic) {
    case 'edge/edukit/status':
      statusDataReceivedHandler(JSON.parse(messageString));
      break;
    case 'edge/edukit/power':
      powerDataReceivedHandler(JSON.parse(messageString));
      break;
    default:
      console.warn(`처리되지 않은 토픽: ${topic}`);
  }
});

module.exports = client;
