const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const { isLoggedIn, checkRole } = require('../lib/middleware');
const userService = require('../service/userService');

router.use(isLoggedIn);
router.use(checkRole(['admin', 'user']));

router.put('/users/:id/role', async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      role: req.body.role,
    }
    logger.info(`(admin.user.role.params) ${JSON.stringify(params)}`);
    const result = await userService.updateRole(params);
    logger.info(`(admin.user.updateRole.result) ${JSON.stringify(result)}`);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
})

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