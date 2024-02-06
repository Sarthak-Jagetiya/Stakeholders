const sendEmail = require('../utils/mailer');
const generateOTP = require('../utils/otp');

let generatedOTP;

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  generatedOTP = generateOTP();
  const { success, error } = await sendEmail(email, 'Your OTP', `Your OTP is: ${generatedOTP}`);
  if (success) {
    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully',
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Failed to send OTP',
      error: error,
    });
  }
};

exports.verifyOTP = (req, res) => {
  const { otp } = req.body;
  if (otp == generatedOTP) {
    res.status(200).json({
      status: 'success',
      message: 'OTP verified successfully.',
    });
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid OTP. Please try again.',
    });
  }
};
