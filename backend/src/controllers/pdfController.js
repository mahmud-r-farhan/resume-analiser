/**
 * PDF Controller
 * Handles resume PDF generation using PDFKit
 */

const { generatePDF } = require('../templates/PDFKitGenerator');
const ResumeParse = require('../models/ResumeParse');
const { saveParsedResumeAndGeneratePDF } = require('../services/pdfGeneratorService');

const templateList = ['classic', 'modern', 'functional', 'executive'];

const generateResumePDF = async (req, res, next) => {
  try {
    const { markdown, template = 'classic', fileName = 'resume', jobTitle, fitScore, model, resumeId } = req.body;

    if (!markdown || typeof markdown !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid markdown content' });
    }

    if (markdown.length > 50000) {
      return res.status(413).json({ error: 'Resume content too large (max 50000 chars)' });
    }

    if (!templateList.includes(template)) {
      return res.status(400).json({ error: `Invalid template: ${template}. Use classic, modern, or functional.` });
    }

    // If resumeId provided, retrieve from DB instead of regenerating
    if (resumeId) {
      // Require authentication for retrieving stored resumes
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required to access stored resumes' });
      }

      const existingResume = await ResumeParse.findById(resumeId);
      if (!existingResume || existingResume.userId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Resume not found or unauthorized' });
      }

      // If template changed, regenerate PDF with new template
      if (existingResume.template !== template) {
        const newPdfResult = await saveParsedResumeAndGeneratePDF(
          req.user.id,
          existingResume.rawMarkdown,
          existingResume.parsed,
          template,
          jobTitle,
          fitScore,
          model
        );

        const cleanFileName = `${fileName}_${template}_${Date.now()}`.replace(/\s+/g, '_').slice(0, 100);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}.pdf"`);
        res.setHeader('Content-Length', newPdfResult.pdfBuffer.length);
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
        return res.send(newPdfResult.pdfBuffer);
      }

      // Use existing PDF
      const cleanFileName = `${fileName}_${template}_${Date.now()}`.replace(/\s+/g, '_').slice(0, 100);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}.pdf"`);
      res.setHeader('Content-Length', existingResume.pdfBuffer.length);
      res.setHeader('Cache-Control', 'no-store, must-revalidate');
      return res.send(existingResume.pdfBuffer);
    }

    // Generate new PDF using PDFKit
    const pdfBuffer = await generatePDF(markdown, template);

    const cleanFileName = `${fileName}_${template}_${Date.now()}`.replace(/\s+/g, '_').slice(0, 100);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-store, must-revalidate');

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    next(error);
  }
};

module.exports = { generateResumePDF };
