const aiService = require('../services/aiService');
const Analysis = require('../models/Analysis');
const { extractTextFromPDF, cleanupFile } = require('../utils/pdfParser');

const analyzeCV = async (req, res, next) => {
  let filePath = null;

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No CV file uploaded',
        message: 'Please upload a PDF file' 
      });
    }

    filePath = req.file.path;
    const { jobDescription, model = 'z-ai/glm-4-5-air:free' } = req.body;

    // Extract text from PDF
    console.log(`Processing CV: ${req.file.originalname}`);
    const cvText = await extractTextFromPDF(filePath);

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
  } finally {
    // Always cleanup the uploaded file
    if (filePath) {
      await cleanupFile(filePath);
    }
  }
};

module.exports = { analyzeCV };