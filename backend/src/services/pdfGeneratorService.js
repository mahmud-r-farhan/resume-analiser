/**
 * PDF Generator Service
 * Generates PDF resumes using PDFKit
 */

const { generatePDF } = require('../templates/PDFKitGenerator');
const { parseResumeMarkdown } = require('../templates/parser');
const ResumeParse = require('../models/ResumeParse');

/**
 * Generate PDF from parsed resume structure
 * @param {Object} parsedData - Parsed resume object with header, sections
 * @param {String} template - Template name (classic, modern, functional)
 * @returns {Buffer} - PDF buffer
 */
const generatePDFFromParsed = async (parsedData, template = 'classic') => {
  if (!parsedData || !parsedData.header) {
    throw new Error('Invalid parsed resume data');
  }

  const validTemplates = ['classic', 'modern', 'functional'];
  if (!validTemplates.includes(template)) {
    throw new Error(`Template '${template}' not found. Use: classic, modern, functional`);
  }

  // Reconstruct markdown from parsed data for template rendering
  const markdown = reconstructMarkdown(parsedData);

  try {
    const pdfBuffer = await generatePDF(markdown, template);
    return pdfBuffer;
  } catch (err) {
    console.error('PDF generation error:', err);
    throw new Error(`Failed to generate PDF: ${err.message}`);
  }
};

/**
 * Reconstruct markdown from parsed structure for rendering
 */
const reconstructMarkdown = (parsed) => {
  let markdown = '';

  // Header
  if (parsed.header.name) {
    markdown += `# ${parsed.header.name}\n\n`;
  }
  if (parsed.header.title) {
    markdown += `## ${parsed.header.title}\n\n`;
  }
  if (parsed.header.contact && parsed.header.contact.length > 0) {
    markdown += `${parsed.header.contact.join(' | ')}\n\n`;
  }

  // Sections
  if (parsed.sections && Array.isArray(parsed.sections)) {
    parsed.sections.forEach((section) => {
      markdown += `### ${section.title}\n\n`;

      if (Array.isArray(section.items)) {
        section.items.forEach((item) => {
          switch (item.type) {
            case 'job':
              markdown += `**${item.role}** at **${item.company}** | ${item.date}\n`;
              if (item.bullets && Array.isArray(item.bullets)) {
                item.bullets.forEach((bullet) => {
                  markdown += `- ${bullet}\n`;
                });
              }
              markdown += '\n';
              break;

            case 'education':
              markdown += `**${item.degree}** | ${item.institution} | ${item.date}\n\n`;
              break;

            case 'skill':
              markdown += `- ${item.text}\n`;
              break;

            case 'skill_category':
              markdown += `**${item.category}:** ${item.skills.join(', ')}\n\n`;
              break;

            case 'bullet':
              markdown += `- ${item.text}\n`;
              break;

            case 'text':
              markdown += `${item.text}\n\n`;
              break;
          }
        });
      }
    });
  }

  return markdown;
};

/**
 * Save parsed resume to DB and generate PDF
 */
const saveParsedResumeAndGeneratePDF = async (
  userId,
  rawMarkdown,
  parsedData,
  template = 'classic',
  jobTitle = null,
  fitScore = null,
  model = 'unknown'
) => {
  try {
    // Generate PDF buffer using PDFKit
    const pdfBuffer = await generatePDFFromParsed(parsedData, template);

    // Save to database
    const resumeParse = await ResumeParse.create({
      userId,
      rawMarkdown,
      parsed: parsedData,
      template,
      jobTitle,
      fitScore,
      model,
      pdfBuffer // Store PDF in DB for download history
    });

    return {
      success: true,
      resumeId: resumeParse._id,
      pdfBuffer,
      parsedData
    };
  } catch (err) {
    console.error('Save and generate error:', err);
    throw err;
  }
};

module.exports = {
  generatePDFFromParsed,
  reconstructMarkdown,
  saveParsedResumeAndGeneratePDF,
};
