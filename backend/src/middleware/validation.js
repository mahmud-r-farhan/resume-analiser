const { body, validationResult } = require('express-validator');
const { AI_MODELS } = require('../models/LLMmodels');

// Get all valid model IDs (both free and premium)
const getAllValidModelIds = () => {
  const freeModelIds = AI_MODELS.free.map(m => m.id);
  const premiumModelIds = AI_MODELS.premium.map(m => m.id);
  return [...freeModelIds, ...premiumModelIds];
};

const validateAnalysisRequest = [
  body('jobDescription')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50, max: 10000 })
    .withMessage('Job description must be between 50 and 10000 characters'),

  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model selection is required')
    .isIn(getAllValidModelIds())
    .withMessage('Invalid model selected'),

  body('template')
    .optional()
    .trim()
    .isIn(['classic', 'modern', 'functional'])
    .withMessage('Invalid template selected'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    next();
  },
];

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage('Username can contain letters, numbers, dots, underscores, and hyphens'),
  body('fullName')
    .trim()
    .isLength({ min: 3, max: 60 })
    .withMessage('Full name must be between 3 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

const validateEmailOnly = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateOtpSubmission = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .matches(/^\d+$/)
    .withMessage('OTP must contain only digits'),
];

const validateResetPassword = [
  body('resetToken').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

module.exports = {
  validateAnalysisRequest,
  validateRegister,
  validateLogin,
  validateEmailOnly,
  validateOtpSubmission,
  validateResetPassword,
};