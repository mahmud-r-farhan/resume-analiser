const express = require('express');
const { analyzeCV } = require('../controllers/analysisController');
const router = express.Router();

router.post('/analyze', analyzeCV);

module.exports = router;