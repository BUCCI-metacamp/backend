const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const { isLoggedIn, checkRole } = require('../lib/middleware');
const reportService = require('../service/reportService');

// 업무 일지 등록
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const params = {
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content,
    }
    logger.info(`(report.reg.params) ${JSON.stringify(params)}`);

    if (!params.title || !params.content) {
      throw new CustomError(400, 'Bad Request');
    } else {
      logger.info(`(report.reg.params) ${JSON.stringify(params)}`);
      const result = await reportService.reg(params);
      logger.info(`(report.reg.result) ${JSON.stringify(result)}`);
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
})

// 업무 일지 리스트
router.get('/', isLoggedIn, checkRole(['admin']), async (req, res, next) => {
  try {
    const params = {
      limit: req.query.limit || 10,
      page: req.query.page || 1,
    }
    logger.info(`(report.list.params) ${JSON.stringify(params)}`);
    const result = await reportService.list(params);
    logger.info(`(report.list.result) ${JSON.stringify(result)}`);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

// 업무 일지 조회
router.get('/:id', isLoggedIn, checkRole(['admin']), async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
    }
    logger.info(`(report.detail.params) ${JSON.stringify(params)}`);
    const result = await reportService.detail(params);
    logger.info(`(report.detail.result) ${JSON.stringify(result)}`);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

module.exports = router;