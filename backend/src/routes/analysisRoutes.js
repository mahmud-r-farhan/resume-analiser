const express = require('express');
const { analyzeCV, optimizeCV } = require('../controllers/analysisController');
const { generateResumePDF } = require('../controllers/pdfController');
const upload = require('../middleware/uploadMiddleware');
const { validateAnalysisRequest } = require('../middleware/validation');
const { validateModelAccess } = require('../middleware/modelAccessControl');
const uploadLimiter = require('../middleware/uploadLimiter');
const UploadLog = require('../models/UploadLog');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Analyze endpoint - public (with rate limiting)
router.post(
  '/analyze',
  uploadLimiter(),
  upload.single('cv'),
  validateAnalysisRequest,
  validateModelAccess,
  async (req, res, next) => {
    try {
      await analyzeCV(req, res, next);
      if (req._uploadUserIdentifier) {
        await UploadLog.create({ userIdentifier: req._uploadUserIdentifier });
      }
    } catch (error) {
      next(error);
    }
  },
);

// Optimize endpoint - requires authentication
router.post(
  '/optimize',
  requireAuth,
  uploadLimiter(),
  upload.single('cv'),
  validateAnalysisRequest,
  validateModelAccess,
  async (req, res, next) => {
    try {
      await optimizeCV(req, res, next);
      if (req._uploadUserIdentifier) {
        await UploadLog.create({ userIdentifier: req._uploadUserIdentifier });
      }
    } catch (error) {
      next(error);
    }
  },
);

// PDF Generation endpoint - requires authentication
router.post('/generate-pdf', requireAuth, generateResumePDF);

// Get analysis history
router.get('/history', async (req, res, next) => {
  try {
    const Analysis = require('../models/Analysis');
    const analyses = await Analysis.find().select('-__v').sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: analyses });
  } catch (error) {
    next(error);
  }
});

// Get available models based on user subscription
router.get('/models', async (req, res, next) => {
  try {
    const { getAvailableModels, getDefaultModel } = require('../models/LLMmodels');

    // Check if user is authenticated
    let isPremium = false;
    if (req.headers.authorization) {
      try {
        const authMiddleware = requireAuth;
        await new Promise((resolve, reject) => {
          authMiddleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        isPremium = user?.isPremium && (!user.premiumExpiresAt || user.premiumExpiresAt > new Date());
      } catch (err) {
        // Not authenticated or error - just use free models
        isPremium = false;
      }
    }

    const models = getAvailableModels(isPremium);
    const defaultModel = getDefaultModel(isPremium);

    res.json({
      success: true,
      models,
      defaultModel,
      isPremium,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;