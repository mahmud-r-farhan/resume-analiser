const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

// All profile routes require authentication
router.use(requireAuth);

// Profile data
router.get('/me', profileController.getProfile);
router.put('/me', profileController.updateProfile);

// Histories
router.get('/analyses', profileController.getUserAnalyses);
router.get('/optimizations', profileController.getUserOptimizations);
router.get('/downloads', profileController.getDownloadHistory);

// Delete/manage data
router.delete('/analyses/:analysisId', profileController.deleteAnalysis);
router.delete('/optimizations/:optimizationId', profileController.deleteOptimization);
router.get('/download/:resumeId', profileController.downloadResume);

// Stats/insights
router.get('/stats', profileController.getProfileStats);

module.exports = router;
