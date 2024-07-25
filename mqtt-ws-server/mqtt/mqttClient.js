const mqtt = require('mqtt');
const awsIot = require('aws-iot-device-sdk');
const fs = require('fs');
const logger = require('../lib/logger');
const { statusDataReceivedHandler, powerDataReceivedHandler } = require('../service/mqttService');

const privateKey = fs.readFileSync('/run/secrets/aws_iot_private_key', 'utf8');
const certificate = fs.readFileSync('/run/secrets/aws_iot_certificate', 'utf8');
const rootCA = fs.readFileSync('/run/secrets/aws_iot_root_ca', 'utf8');

const client = awsIot.device({
  privateKey: Buffer.from(privateKey),
  clientCert: Buffer.from(certificate),
  caCert: Buffer.from(rootCA),
  clientId: process.env.AWS_IOT_CLIENT_ID,
  host: process.env.AWS_IOT_ENDPOINT
});

// const client = awsIot.device({
//   keyPath: process.env.AWS_IOT_PRIVATE_KEY_PATH,
//   certPath: process.env.AWS_IOT_CERTIFICATE_PATH,
//   caPath: process.env.AWS_IOT_ROOT_CA_PATH,
//   clientId: process.env.AWS_IOT_CLIENT_ID,
//   host: process.env.AWS_IOT_ENDPOINT
// });

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
      logger.info(`처리되지 않은 토픽: ${topic}`);
  }
});

client.on('error', function(error) {
  logger.error('MQTT client Error:', error);
});

module.exports = client;
