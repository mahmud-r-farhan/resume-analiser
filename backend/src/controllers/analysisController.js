const aiService = require('../services/aiService');
const Analysis = require('../models/Analysis');
const { extractTextFromPDF } = require('../utils/pdfParser');
const User = require('../models/User');
const { ensureResumeQuota } = require('../utils/security');

const analyzeCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded', message: 'Please upload a PDF file' });
    }

    const { jobDescription, model = 'deepseek/deepseek-chat-v3.1:free' } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: 'Missing job description' });
    }

    const cvText = await extractTextFromPDF(req.file.buffer);

    console.log(`Analyzing with model: ${model}`);
    const result = await aiService.analyzeCV(cvText, jobDescription, model);

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
        // Optionally throw or handle further
      }
    }

    res.status(200).json({
      success: true,
      analysis: result.analysis,
      fitScore: result.fitScore,
      model: result.model,
      metadata: { fileName: req.file.originalname, fileSize: req.file.size, tokensUsed: result.tokensUsed }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    next(error);
  }
};

const optimizeCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded', message: 'Please upload a PDF file' });
    }

    const { jobDescription, analysis, model = 'deepseek/deepseek-chat-v3.1:free', template = 'classic' } = req.body;
    if (!jobDescription || !analysis) {
      return res.status(400).json({ error: 'Missing required fields: jobDescription and analysis are required' });
    }

    const cvText = await extractTextFromPDF(req.file.buffer);

    console.log(`Optimizing with model: ${model}, template: ${template}`);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Email verification required to generate resumes' });
    }

    ensureResumeQuota(user);
    const isPremium = user.isPremium && (!user.premiumExpiresAt || user.premiumExpiresAt > new Date());
    const maxResumes = isPremium ? Infinity : 3;

    if (!isPremium && user.resumeQuota.count >= maxResumes) {
      const resetDate = new Date(user.resumeQuota.windowStart);
      resetDate.setUTCDate(resetDate.getUTCDate() + 7);
      return res.status(403).json({
        error: 'Weekly resume limit reached',
        message: 'You can generate up to 3 optimized resumes per week. Upgrade to Premium for unlimited resumes.',
        resetAt: resetDate,
        quotaExceeded: true,
      });
    }

    const optimizedResult = await aiService.optimizeCV(cvText, jobDescription, analysis, model, template);

    // Increment quota for non-premium users after successful optimization
    if (!isPremium) {
      user.resumeQuota.count += 1;
      await user.save();
    }

    // Return payload using key expected by frontend (optimizedCV)
    res.status(200).json({
      success: true,
      optimizedCV: optimizedResult.optimized,
      model: optimizedResult.model,
      metadata: { fileName: req.file.originalname, fileSize: req.file.size, tokensUsed: optimizedResult.tokensUsed }
    });
  } catch (error) {
    console.error('Optimization error:', error);
    next(error);
  }
};

module.exports = { analyzeCV, optimizeCV };