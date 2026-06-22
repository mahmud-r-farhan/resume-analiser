const pdf = require('pdf-parse');

async function extractTextFromPDF(buffer) {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error('PDF file is empty');
    }
    const data = await pdf(buffer);
    if (!data.text || data.text.trim().length === 0) {
      const err = new Error('PDF appears to be empty or text could not be extracted. Ensure the PDF is text-based, not scanned (OCR is not yet supported).');
      err.statusCode = 400;
      throw err;
    }
    return data.text.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error.statusCode) throw error;
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

module.exports = { extractTextFromPDF };