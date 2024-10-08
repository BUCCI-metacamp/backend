const CustomError = require("../error/CustomError");
const tokenUtil = require("./tokenUtil");

const middleware = {
  // 로그인 확인
  isLoggedIn(req, res, next) {
    console.log('aaa');
    const loginToken = req.headers && req.headers.authorization;
    try {
      if (loginToken) {
        console.log(loginToken);
        // 토큰 유효한지 확인
        const token = loginToken.split('Bearer ')[1];
        const decoded = tokenUtil.verifyToken(token);

        if (decoded) {
          req.user = {
            id: decoded.id,
            role: decoded.role
          }

          next();
        } else {
          throw new CustomError(401, 'Unauthorized')
        }
      } else {
        throw new CustomError(401, 'Unauthorized')
      }
    } catch (err) {
      next(err);
    }
  },

  // 권한 체크
  checkRole(roles) {
    return function (req, res, next) {
      currentUser = req.user;

      if (currentUser && roles.includes(currentUser.role)) {
        return next();
      } else {
        return next(new CustomError(403, 'Forbidden'));
      }
    };
  }
}

module.exports = middleware;