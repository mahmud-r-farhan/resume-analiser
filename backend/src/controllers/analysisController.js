const aiService = require('../services/aiService');
const Analysis = require('../models/Analysis');
const ResumeParse = require('../models/ResumeParse');
const { extractTextFromPDF } = require('../utils/pdfParser');
const User = require('../models/User');
const { ensureResumeQuota } = require('../utils/security');
const { parseResumeMarkdown } = require('../templates/parser');
const { saveParsedResumeAndGeneratePDF } = require('../services/pdfGeneratorService');

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

    // Save analysis log
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
        // Don't fail the request
      }
    }

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

    // Get optimized markdown from LLM
    console.log('Calling AI service to optimize CV...');
    const optimizedResult = await aiService.optimizeCV(cvText, jobDescription, analysis, model, template);
    const optimizedMarkdown = optimizedResult.optimized;

    console.log('Optimized markdown received. Length:', optimizedMarkdown.length);
    console.log('First 500 chars:', optimizedMarkdown.slice(0, 500));

    // CRITICAL: Parse & validate markdown structure
    const parseResult = parseResumeMarkdown(optimizedMarkdown);
    
    console.log('Parse result:', {
      isValid: parseResult.isValid,
      errors: parseResult.errors,
      warnings: parseResult.warnings,
      headerName: parseResult.header.name,
      sectionsCount: parseResult.sections.length
    });

    if (!parseResult.isValid) {
      console.error('Parsing failed:', parseResult.errors);
      
      // RETRY LOGIC: If parsing failed, try to fix it
      console.log('Attempting to fix markdown...');
      const fixedMarkdown = fixMarkdownFormat(optimizedMarkdown);
      const parseRetry = parseResumeMarkdown(fixedMarkdown);
      
      if (!parseRetry.isValid) {
        return res.status(400).json({
          error: 'Failed to parse optimized resume',
          details: parseRetry.errors,
          message: 'The LLM response could not be properly structured. Please try again with a different model.',
          debug: {
            receivedLength: optimizedMarkdown.length,
            firstLine: optimizedMarkdown.split('\n')[0]
          }
        });
      }

      // Use fixed version
      const pdfResult = await saveParsedResumeAndGeneratePDF(
        req.user.id,
        fixedMarkdown,
        parseRetry,
        template,
        null,
        null,
        model
      );

      // Increment quota
      if (!isPremium) {
        user.resumeQuota.count += 1;
        await user.save();
      }

      return res.status(200).json({
        success: true,
        optimizedCV: fixedMarkdown,
        resumeId: pdfResult.resumeId.toString(),
        model: optimizedResult.model,
        parseWarnings: parseRetry.warnings,
        metadata: { 
          fileName: req.file.originalname, 
          fileSize: req.file.size, 
          tokensUsed: optimizedResult.tokensUsed,
          note: 'Markdown was auto-corrected'
        }
      });
    }

    // CRITICAL: Save parsed data + generate PDF from it
    const pdfResult = await saveParsedResumeAndGeneratePDF(
      req.user.id,
      optimizedMarkdown,
      parseResult,
      template,
      null,
      null,
      model
    );

    // Increment quota
    if (!isPremium) {
      user.resumeQuota.count += 1;
      await user.save();
    }

    // Return to frontend: markdown + resumeId (for later downloads)
    res.status(200).json({
      success: true,
      optimizedCV: optimizedMarkdown,
      resumeId: pdfResult.resumeId.toString(),
      model: optimizedResult.model,
      parseWarnings: parseResult.warnings,
      metadata: { 
        fileName: req.file.originalname, 
        fileSize: req.file.size, 
        tokensUsed: optimizedResult.tokensUsed 
      }
    });
  } catch (error) {
    console.error('Optimization error:', error);
    next(error);
  }
};

// Helper function to fix common markdown issues
const fixMarkdownFormat = (markdown) => {
  let fixed = markdown
    .replace(/```markdown\n?/g, '') // Remove markdown code blocks
    .replace(/```\n?/g, '')
    .trim();

  // Ensure starts with # if missing
  if (!fixed.startsWith('#')) {
    const lines = fixed.split('\n');
    const firstContent = lines[0] || 'Resume';
    fixed = `# ${firstContent}\n${lines.slice(1).join('\n')}`;
  }

  // Fix common heading issues
  fixed = fixed
    .replace(/^### /gm, '### ') // Normalize section headings
    .replace(/^\*\*(.+?)\*\*$/gm, '### $1'); // Convert bold to headings if they're alone on a line

  return fixed;
};

module.exports = { analyzeCV, optimizeCV };