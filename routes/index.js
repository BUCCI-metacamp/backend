const express = require('express');
const router = express.Router();

const authRouter = require('./auth')

router.get('/', function (req, res, next) {
  res.send('Hello World!');
});

router.use('/auth', authRouter)

module.exports = router;
