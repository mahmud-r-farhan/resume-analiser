const { body, validationResult } = require('express-validator');

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
    .isIn([
      'deepseek/deepseek-v3-base:free',
      'google/gemini-2.5-pro-exp-03-25:free',
      'mistralai/mistral-small-3.1-24b-instruct:free',
      'meta-llama/llama-4-maverick:free'
    ])
    .withMessage('Invalid model selected'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }
    next();
  }
];

module.exports = { validateAnalysisRequest };