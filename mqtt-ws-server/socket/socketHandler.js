const logger = require("../lib/logger");
const tokenUtil = require("../lib/tokenUtil");

let ioInstance;

const socketHandler = (io) => {
  ioInstance = io;

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      const loginToken = socket.handshake.query.token;
      try {
        console.log(loginToken);
        // 토큰 유효한지 확인
        const token = loginToken.split('Bearer ')[1];
        const decoded = tokenUtil.verifyToken(token);

        socket.decoded = decoded;
        next();
      } catch (error) {
        return next(new Error('Authentication error'));
      }
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('새로운 클라이언트가 연결되었습니다.');

    // 방에 연결
    socket.on('request_join_room', (roomName) => {
      logger.info(`${roomName} joined`);
      socket.join(roomName);
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('클라이언트가 연결을 끊었습니다.');
    });

  });
}

socketHandler.emitToRoom = (room, event, data) => {
  if (ioInstance) {
    logger.info(`room:${room} - ${event} : ${data}`)
    ioInstance.to(room).emit(event, data);
  }
};

module.exports = socketHandler;