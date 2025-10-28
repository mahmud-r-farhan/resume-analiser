const aiService = require('../services/aiService');
const Analysis = require('../models/Analysis');
const { extractTextFromPDF } = require('../utils/pdfParser');  // Removed cleanupFile since we're using memory storage

const analyzeCV = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No CV file uploaded',
        message: 'Please upload a PDF file'
      });
    }

    const { jobDescription, model = 'deepseek/deepseek-chat-v3.1:free' } = req.body;

    // Extract text from PDF buffer (updated for memory storage)
    console.log(`Processing CV: ${req.file.originalname}`);
    const cvText = await extractTextFromPDF(req.file.buffer);  // Pass buffer instead of path

    // Analyze with AI
    console.log(`Analyzing with model: ${model}`);
    const result = await aiService.analyzeCV(cvText, jobDescription, model);

    // Save to database (optional)
    if (process.env.MONGO_URI) {
      try {
        await Analysis.create({
          cvFileName: req.file.originalname,
          jobDescription,
          model,
          analysis: result.analysis,
          fitScore: result.fitScore
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue even if DB save fails
      }
    }

    // Send response
    res.status(200).json({
      success: true,
      analysis: result.analysis,
      fitScore: result.fitScore,
      model: result.model,
      metadata: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        tokensUsed: result.tokensUsed
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    next(error);
  }
};

module.exports = { analyzeCV };