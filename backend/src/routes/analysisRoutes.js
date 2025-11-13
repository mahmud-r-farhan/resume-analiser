const express = require('express');
const { analyzeCV, optimizeCV } = require('../controllers/analysisController');
const upload = require('../middleware/uploadMiddleware');
const { validateAnalysisRequest } = require('../middleware/validation');
const uploadLimiter = require('../middleware/uploadLimiter');
const UploadLog = require('../models/UploadLog');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/analyze',
  uploadLimiter(),
  upload.single('cv'),
  validateAnalysisRequest,
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

router.post(
  '/optimize',
  requireAuth,
  uploadLimiter(),
  upload.single('cv'),
  validateAnalysisRequest,
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

router.get('/history', async (req, res, next) => {
  try {
    const Analysis = require('../models/Analysis');
    const analyses = await Analysis.find().select('-__v').sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: analyses });
  } catch (error) {
    next(error);
  }
});

module.exports = router;