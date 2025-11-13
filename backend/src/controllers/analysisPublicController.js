const Analysis = require('../models/analysis');

// Get ALL analyses (public)
exports.getAllAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });

    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analyses", error: error.message });
  }
};

// Get COUNT of all analyses (public)
exports.getAnalysisCount = async (req, res) => {
  try {
    const count = await Analysis.countDocuments();

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analysis count", error: error.message });
  }
};