const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const { isLoggedIn } = require('../lib/middleware');
const service = require('../service/dashboardService');

router.use(isLoggedIn);

router.get('/uptime', async (req, res, next) => {
  try {
    const result = await service.getUptime();
    logger.info(`(dashboard.uptime.result) ${JSON.stringify(result)}`);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

module.exports = router;