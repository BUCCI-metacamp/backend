const logger = require('../lib/logger');
const CustomError = require('../error/CustomError');
const hashUtil = require('../lib/hashUtil');
const tokenUtil = require('../lib/tokenUtil');
const userDao = require('../dao/userDao.js');

const service = {
  // user 등록
  async reg(params) {
    let inserted = null;
    let hashPassword = null;
    try {
      hashPassword = await hashUtil.makePasswordHash(params.password);
      logger.debug(`userService.reg - hashPassword: ${JSON.stringify(hashPassword)}`);
    } catch (error) {
      logger.error(`userService.reg - hashPassword: ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
    const newParams = {
      ...params,
      password: hashPassword,
    };

    try {
      inserted = await userDao.insert(newParams);
      logger.debug(`(userService.reg) ${JSON.stringify(inserted)}`);
    } catch (error) {
      logger.error(`(userService.reg) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(new CustomError(400, 'Bad Request'));
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  // 모든 유저 조회
  async list(params) {
    let results = null;
    try {
      results = await userDao.findAll();
      logger.debug(`(userService.list) ${JSON.stringify(results)}`);
    } catch (error) {
      logger.error(`(userService.list) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(results);
    });
  },

  // 단일 유저 조회
  async detail(params) {
    let result = null;
    try {
      result = await userDao.findById(params);
      logger.debug(`(userService.detail) ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`(userService.detail) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  // 아이디 중복 체크
  async checkDuplicate(params) {
    let result = null;
    try {
      result = await userDao.findByUserId(params);
      if (result == null) {
        result = false;
      } else {
        result = true;
      }
      logger.debug(`(userService.checkDuplicate) ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`(userService.checkDuplicate) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(new CustomError(500, 'Internal Server Error'));
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  // 로그인
  async login(params) {
    let selected = null;
    let token = null;

    // 사용자 조회
    try {
      selected = await userDao.findByUserId(params);

      if (!selected) {
        throw new CustomError('401', '일치하는 유저 정보가 없습니다')
      }
    } catch (err) {
      logger.error(`(userService.login): ${err.message}`)
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    // params.password와 조회된 password랑 비교
    try {
      const checkPassword = await hashUtil.checkPasswordHash(
        params.password,
        selected.password,
      );
      // 패스워드 불일치시 에러
      if (!checkPassword) {
        const err = new Error(
          'userService.login, 패스워드가 일치하지 않습니다.',
        );
        throw err;
      }
    } catch (err) {
      logger.error(`(userService.login): ${err.message}`)
      return new Promise((resolve, reject) => {
        reject(new CustomError('401', '올바른 패스워드가 아닙니다.'))
      })
    }

    // 토큰발급
    try {
      token = await tokenUtil.makeToken({
        id: selected.id,
        name: selected.name,
        role: selected.role,
      });
      refreshToken = await tokenUtil.makeRefreshToken({
        id: selected.id,
        name: selected.name,
        role: selected.role,
      });
      if (!token || !refreshToken) {
        const err = new Error('userService.login, 토큰 발급 실패.');
        throw err;
      }
    } catch (err) {
      logger.error(`(userService.login): ${err.message}`)
      return new Promise((resolve, reject) => {
        reject(new CustomError('401', '토큰 발급 실패'))
      })
    }

    return new Promise((resolve) => {
      resolve({
        id: selected.id,
        name: selected.name,
        role: selected.role,
        token: token,
        refreshToken: refreshToken,
      });
    });
  },

  // 정보 조회
  async info(params) {
    let result = null;

    try {
      user = await userDao.findByPk(params);
      const { password, ...info } = user;
      result = info;
      logger.debug(`(userService.info) ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`(userService.info) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

  // 비밀번호 수정
  async updatePassword(params) {
    let updated = null;

    try {
      hashPassword = await hashUtil.makePasswordHash(params.password);
      logger.debug(`userService.updatePassword - hashPassword: ${JSON.stringify(hashPassword)}`);
      updated = await userDao.update({
        id: params.id,
        password: hashPassword,
      });
    } catch (error) {
      logger.error(`(userService.updatePassword) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(updated);
    });
  },

  // 유저 정보 수정
  async update(params) {
    let updated = null;

    try {
      let newParams = {
        id: params.id,
        name: params.name,
        role: params.role,
      }
      if (params.password != null) {
        hashPassword = await hashUtil.makePasswordHash(params.password);
        logger.debug(`userService.update - hashPassword: ${JSON.stringify(hashPassword)}`);
        newParams.password = hashPassword;
      }
      updated = await userDao.update(newParams);
    } catch (error) {
      logger.error(`(userService.updateRole) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(updated);
    });
  },

  // 회원 탈퇴
  async delete(params) {
    let deleted = null;

    try {
      deleted = await userDao.delete({
        id: params.id,
      });
    } catch (error) {
      logger.error(`(userService.delete) ${error.toString()}`);
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    return new Promise((resolve) => {
      resolve(deleted);
    });
  }
}

module.exports = service;