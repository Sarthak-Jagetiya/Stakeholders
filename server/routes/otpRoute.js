const express = require('express');
const otpController = require('../controllers/otpController');

const router = express.Router();

router.post('/send', otpController.sendOTP);
router.post('/verify', otpController.verifyOTP);

module.exports = router;
