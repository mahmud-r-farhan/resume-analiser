const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const quotaController = require('../controllers/quotaController');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateEmailOnly,
  validateOtpSubmission,
  validateResetPassword,
} = require('../middleware/validation');

router.post('/register', validateRegister, authController.register);
router.post('/verify-email', validateOtpSubmission, authController.verifyEmail);
router.post('/resend-verification', validateEmailOnly, authController.resendVerification);
router.post('/login', validateLogin, authController.login);

router.post('/forgot-password', validateEmailOnly, authController.forgotPassword);
router.post('/forgot-password/verify', validateOtpSubmission, authController.verifyResetOtp);
router.post('/forgot-password/reset', validateResetPassword, authController.resetPassword);

router.get('/me', requireAuth, authController.getProfile);
router.get('/quota', requireAuth, quotaController.checkQuota);

module.exports = router;

