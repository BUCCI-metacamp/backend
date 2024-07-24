const crypto = require('crypto');
const { resolve } = require('path');

const iterations = process.env.CRYPTO_ITERATIONS ? Number(process.env.CRYPTO_ITERATIONS) : 1000;

const hashUtil = {
  // hash 생성 함수
  makePasswordHash(password) {
    return new Promise((resolve, reject) => {
      if(!password) {
        reject(new Error('입력한 패스워드가 없습니다.'));
      }

      // 1. salt 생성
      const salt = crypto.randomBytes(64).toString('base64');

      // 2. hash 생성
      crypto.pbkdf2(password, salt, iterations, 64, 'sha256', (err, derivedKey) => {
        if (err) throw err;
        const hash = derivedKey.toString('hex');
        const encryptedPassword = `${salt}.${hash}`;

        resolve(encryptedPassword);
      });
    });
  },
  checkPasswordHash(password, encryptedPassword) {
    return new Promise((resolve, reject) => {
      if (!password || !encryptedPassword) {
        reject(new Error('패스워드나 암호화된 hash 값이 없습니다.'));
      }

      // 1. salt 값 추출
      const encryptedPasswordSplit = encryptedPassword.split('.');
      if (!(encryptedPasswordSplit && encryptedPasswordSplit.length === 2)) {
        reject(new Error('encryptedPasswordSplit의 길이가 2가 아닙니다.'));
      }
      const salt = encryptedPasswordSplit[0];
      const hash = encryptedPasswordSplit[1];
      
      // 2. hash 함수 돌리기
      crypto.pbkdf2(password, salt, iterations, 64, 'sha256', (err, derivedKey) => {
        if (err) throw err;
        
        const newHash = derivedKey.toString('hex');

        // 3. encryptedPassword와 일치하는지 확인
        if (hash === newHash) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    })
  }
}

module.exports = hashUtil;