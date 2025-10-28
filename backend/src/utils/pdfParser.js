const fs = require('fs').promises;
const pdf = require('pdf-parse');

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or text could not be extracted');
    }
    
    return data.text.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Clean up uploaded file
 * @param {string} filePath - Path to file
 */
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`Cleaned up file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
}

module.exports = { 
  extractTextFromPDF, 
  cleanupFile 
};