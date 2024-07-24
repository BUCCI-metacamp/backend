const jwt = require('jsonwebtoken');

const secretKey = process.env.TOKEN_SECRET || 'TB5E1sbMDFbEb1KhFyGAM10HjgTsz5mC';
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET || 'TB5E1sbMDFbEb1KhFyGAM10HjgTsz5mC';

const options = {
  expiresIn: process.env.TOKEN_EXPIRESIN || '20h',
};
const refreshOptions = {
  expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN || '14d',
}

const tokenUtil = {
  makeToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(payload, secretKey, options);
    
    return token;
  },
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (err) {
      return null;
    }
  },
  makeRefreshToken(user) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(payload, refreshSecretKey, refreshOptions);
    
    return token;
  },
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, refreshSecretKey);
      return decoded;
    } catch (err) {
      return null;
    }
  },
};

module.exports = tokenUtil;
