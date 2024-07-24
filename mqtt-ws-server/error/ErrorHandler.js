const logger = require('../lib/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500; // 기본 상태 코드를 500으로 설정
  res.status(statusCode).json({ message: err.message });
};

module.exports = errorHandler;