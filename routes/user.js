const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const { isLoggedIn } = require('../lib/middleware');
const userService = require('../service/userService');

// 마이페이지 조회
router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
    }
    logger.info(`(user.info.params) ${JSON.stringify(params)}`);

    // 로그인 본인인지 확인
    if (Number(req.user.id) === Number(req.params.id)) {
      const result = await userService.info(params);
      logger.info(`(user.info.result) ${JSON.stringify(result)}`);

      // 최종 응답
      res.status(200).json(result);
    } else {
      const err = new CustomError(403, 'Forbidden');
      logger.error(err.toString());
      throw err;
    }
  } catch (error) {
    next(error);
  }
})

// 비밀번호 수정
router.put('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      password: req.body.password,
    }
    logger.info(`(user.password.params) ${JSON.stringify(params)}`);
    // 로그인 본인인지 확인
    if (Number(req.user.id) === Number(req.params.id)) {
      const result = await userService.updatePassword(params);
      logger.info(`(user.updatePassword.result) ${JSON.stringify(result)}`);
  
      // 최종 응답
      res.status(200).json(result);
    } else {
      const err = new CustomError(403, 'Forbidden');
      logger.error(err.toString());
      throw err;
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;