const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const { isLoggedIn, checkRole } = require('../lib/middleware');
const userService = require('../service/userService');

router.use(isLoggedIn);
router.use(checkRole(['admin']));

// 단일 유저 조회
router.get('/users/:id', async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
    }
    logger.info(`(admin.user.detail.params) ${JSON.stringify(params)}`)
    const result = await userService.detail(params);
    logger.info(`(admin.user.detail.result) ${JSON.stringify(result)}`)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

// 전체 유저 조회
router.get('/users', async (req, res, next) => {
  try {
    const result = await userService.list();
    logger.info(`(admin.user.list) ${JSON.stringify(result)}`)
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

// 유저 권한 수정
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      name: req.body.name,
      password: req.body.password || null,
      role: req.body.role,
    }

    if (!params.role || !params.name || !req.params.id) {
      throw new CustomError(400, 'Bad Request');
    } else {
      logger.info(`(admin.user.role.params) ${JSON.stringify(params)}`);
      const result = await userService.update(params);
      logger.info(`(admin.user.updateRole.result) ${JSON.stringify(result)}`);
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
})

// 유저 삭제
router.delete('/users/:id', async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
    }
    logger.info(`(admin.user.delete.params) ${JSON.stringify(params)}`);
    const result = await userService.delete(params);
    logger.info(`(admin.user.delete.result) ${JSON.stringify(result)}`);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

module.exports = router;