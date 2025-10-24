require('dotenv').config();
const { OpenAI } = require('openai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromPDF } = require('../utils/pdfParser');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('cv');

const analyzeCV = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload error' });

    const { jobDescription, model = 'z-ai/glm-4-5-air:free' } = req.body;  // Default to GLM 4.5 Air; allow selection
    const cvPath = req.file.path;

    try {
      const cvText = await extractTextFromPDF(cvPath);
      fs.unlinkSync(cvPath);  // Delete temp file

      const prompt = `
        Analyze this CV text against the job description. Suggest changes, strengths, weaknesses, and give a fit score (0-100).
        CV: ${cvText}
        Job Description: ${jobDescription}
      `;

      const completion = await openai.chat.completions.create({
        model,  // e.g., 'z-ai/glm-4-5-air:free' or 'tng/deepseek-r1t2-chimera:free'
        messages: [{ role: 'user', content: prompt }],
      });

      const result = completion.choices[0].message.content;
      // Optionally save to MongoDB here
      res.json({ analysis: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Analysis failed' });
    }
  });
};

module.exports = { analyzeCV };