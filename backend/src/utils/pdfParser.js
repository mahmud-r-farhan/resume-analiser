const pdf = require('pdf-parse');

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or text could not be extracted');
    }
    
    return data.text.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}


module.exports = {
  extractTextFromPDF
};