const express = require('express');
const { analyzeCV } = require('../controllers/analysisController');
const upload = require('../middleware/uploadMiddleware');
const { validateAnalysisRequest } = require('../middleware/validation');
const uploadLimiter = require('../middleware/uploadLimiter');
const UploadLog = require('../models/UploadLog');

const router = express.Router();

router.post(
  '/analyze',
  uploadLimiter(),
  upload.single('cv'),      
  validateAnalysisRequest,    
  async (req, res, next) => {
    try {
      await analyzeCV(req, res, next);  // Call analyzeCV, which handles res if success
      // Log successful upload attempt (only if no error thrown)
      if (req._uploadUserIdentifier) {
        await UploadLog.create({ userIdentifier: req._uploadUserIdentifier });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get('/history', async (req, res, next) => {
  try {
    const Analysis = require('../models/Analysis');
    const analyses = await Analysis.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: analyses });
  } catch (error) {
    next(error);
  }
});

module.exports = router;