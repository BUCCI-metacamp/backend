const express = require('express');
const router = express.Router();

const authRouter = require('./auth')
const userRouter = require('./user')
const adminRouter = require('./admin')
const reportRouter = require('./report')
const dashboardRouter = require('./dashboard')

router.get('/', function (req, res, next) {
  res.send('Hello World!');
});

router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/admin', adminRouter)
router.use('/reports', reportRouter)
router.use('/dashboard', dashboardRouter)

module.exports = router;
