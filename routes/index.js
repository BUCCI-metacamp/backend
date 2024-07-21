const express = require('express');
const router = express.Router();

const authRouter = require('./auth')
const userRouter = require('./user')
const adminRouter = require('./admin')

router.get('/', function (req, res, next) {
  res.send('Hello World!');
});

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/admin', adminRouter)

module.exports = router;
