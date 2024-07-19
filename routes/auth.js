const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const userService = require('../service/userService');

// 회원 생성
router.post("/signup", async (req, res, next) => {
  try {
    const params = {
      userId: req.body.userId,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
    };
    logger.info(`(auth.signup.params) ${JSON.stringify(params)}`);

    if (
      !params.userId
      || !params.password
      || !params.name
      || !params.role
    ) {
      throw new CustomError(400, 'Bad Request');
    } else {
      const result = await userService.reg(params);
      logger.info(`(user.reg.result) ${JSON.stringify(result)}`);

      res.sendStatus(201);
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
})

// 아이디 중복 체크
router.get("/duplicate-check", async (req, res, next) => {
  try {
    const params = {
      userId: req.query.userId,
    }
    logger.info(`(auth.duplicate-check.params) ${JSON.stringify(params)}`);

    const result = await userService.checkDuplicate(params);
    logger.info(`(user.checkDuplicate.result) ${JSON.stringify(result)}`);

    if (result == true) {
      res.status(409).json({"available": false});
    } else {
      res.status(200).json({"available": true});
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
})

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    const params = {
      userId: req.body.userId,
      password: req.body.password,
    };
    logger.info(`(user.login.params) ${JSON.stringify(params)}`);
    const {refreshToken, ...result} = await userService.login(params);
    logger.info(`(user.login.params) ${JSON.stringify(result)}`);

    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.status(200).json(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
})

module.exports = router;