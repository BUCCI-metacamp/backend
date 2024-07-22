// mqttClient.js
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://192.168.0.64:1883');

client.on('connect', () => {
  console.log('MQTT 브로커에 연결됨');
  client.subscribe('edge/edukit/status');
});

client.on('message', async (topic, message) => {
  console.log(`토픽 ${topic}에서 메시지 수신: ${message.toString()}`);
  
});

module.exports = client;
