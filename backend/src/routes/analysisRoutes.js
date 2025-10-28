const express = require('express');
const { analyzeCV } = require('../controllers/analysisController');
const upload = require('../middleware/uploadMiddleware');
const { validateAnalysisRequest } = require('../middleware/validation');

const router = express.Router();

// POST /api/analyze
router.post(
  '/analyze',
  upload.single('cv'),
  validateAnalysisRequest,
  analyzeCV
);

// GET /api/history (optional - if using MongoDB)
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