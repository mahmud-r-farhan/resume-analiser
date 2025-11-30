const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOtpEmail } = require('../services/emailService');
const { createOtpPayload, compareHash, hashPassword, startOfCurrentWeek, ensureResumeQuota } = require('../utils/security');
const { signToken, signResetToken, verifyToken } = require('../utils/token');

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  fullName: user.fullName,
  emailVerified: user.emailVerified,
  resumeQuota: user.resumeQuota,
  isPremium: user.isPremium,
  premiumExpiresAt: user.premiumExpiresAt,
  createdAt: user.createdAt,
});

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    const err = new Error(first.msg);
    err.status = 422;
    throw err;
  }
};

const register = async (req, res, next) => {
  try {
    handleValidation(req);

    const { username, fullName, email, password } = req.body;
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashedPassword = await hashPassword(password);
    const { otp, payload } = await createOtpPayload();

    const user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      emailVerified: false,
      emailOtp: payload,
      resumeQuota: {
        count: 0,
        windowStart: startOfCurrentWeek(),
      },
    });

    await sendOtpEmail({
      to: email,
      subject: 'Verify your Premium Resume Optimizer account',
      otp,
      template: 'verification',
    });

    res.status(201).json({
      success: true,
      message: 'Account created. Enter the OTP sent to your email.',
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'Account not found' });
    if (!user.emailOtp?.codeHash) {
      return res.status(400).json({ error: 'No OTP pending for this account' });
    }
    if (user.emailOtp.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired. Request a new one.' });
    }

    const valid = await compareHash(otp, user.emailOtp.codeHash);
    if (!valid) return res.status(400).json({ error: 'Invalid OTP' });

    user.emailVerified = true;
    user.emailOtp = undefined;
    ensureResumeQuota(user);
    await user.save();

    const token = signToken({ userId: user._id });

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const passwordMatch = await compareHash(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Verify your email before logging in' });
    }

    ensureResumeQuota(user);
    await user.save();

    const token = signToken({ userId: user._id });

    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'Account not found' });
    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    const { otp, payload } = await createOtpPayload();
    user.emailOtp = payload;
    await user.save();

    await sendOtpEmail({
      to: user.email,
      subject: 'Your new verification code',
      otp,
      template: 'verification',
    });

    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If the email exists, an OTP was sent' });
    }

    const { otp, payload } = await createOtpPayload();
    user.resetOtp = payload;
    await user.save();

    await sendOtpEmail({
      to: user.email,
      subject: 'Reset your Premium Resume Optimizer password',
      otp,
      template: 'reset',
    });

    res.json({ success: true, message: 'Reset OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

const verifyResetOtp = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOtp?.codeHash) {
      return res.status(400).json({ error: 'Invalid OTP verification request' });
    }
    if (user.resetOtp.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }
    const valid = await compareHash(otp, user.resetOtp.codeHash);
    if (!valid) return res.status(400).json({ error: 'Invalid OTP' });

    const resetToken = signResetToken({ userId: user._id, email: user.email, scope: 'password_reset' });
    res.json({ success: true, resetToken });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    handleValidation(req);
    const { resetToken, password } = req.body;
    if (!resetToken) return res.status(400).json({ error: 'Reset token required' });

    let payload;
    try {
      payload = verifyToken(resetToken);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    if (payload.scope !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token scope' });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ error: 'Account not found' });

    user.password = await hashPassword(password);
    user.resetOtp = undefined;
    await user.save();

    const token = signToken({ userId: user._id });

    res.json({
      success: true,
      message: 'Password updated successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Account not found' });
    ensureResumeQuota(user);
    await user.save();
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getProfile,
};

