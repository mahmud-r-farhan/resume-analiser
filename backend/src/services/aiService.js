const { OpenAI } = require('openai');

class AIService {
  constructor() {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }

    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.APP_URL  || 'https://resumeanalizer.vercel.app' || 'https://resumeanaliser.vercel.app/' || 'https://resume-analiser.vercel.app' || 'https://cvoptimizer.vercel.app',
        'X-Title': 'CV Optimizer'
      }
    });
  }

  /**
   * Analyze CV against job description
   * @param {string} cvText - Extracted CV text
   * @param {string} jobDescription - Job description
   * @param {string} model - AI model to use
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeCV(cvText, jobDescription, model) {
    const prompt = this.buildPrompt(cvText, jobDescription);
    // Fallback to a valid default if needed (optional safety net)
    const effectiveModel = model || 'deepseek/deepseek-v3-base:free';

    try {
      const completion = await this.openai.chat.completions.create({
        model: effectiveModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert career coach and ATS specialist. Provide detailed, actionable CV analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const analysis = completion.choices[0].message.content;
      const fitScore = this.extractFitScore(analysis);

      return {
        analysis,
        fitScore,
        model: effectiveModel,
        tokensUsed: completion.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      
      if (error.status === 401) {
        throw new Error('Invalid API key');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.status === 500) {
        throw new Error('AI service is temporarily unavailable');
      } else if (error.status === 400 && error.message.includes('not a valid model ID')) {
        throw new Error(`Invalid model ID: ${model}. Please select a valid model.`);
      }
      
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Build analysis prompt
   */
  buildPrompt(cvText, jobDescription) {
    return `
Analyze this CV against the provided job description and provide a comprehensive analysis.

**CV Content:**
${cvText.substring(0, 8000)} ${cvText.length > 8000 ? '...(truncated)' : ''}

**Job Description:**
${jobDescription}

**Please provide:**
1. **Fit Score (0-100):** Start your response with "FIT SCORE: XX" where XX is a number from 0-100
2. **Key Strengths:** What matches well with the job requirements
3. **Gaps & Weaknesses:** What's missing or doesn't align
4. **Specific Improvements:** Actionable suggestions to improve the CV
5. **Keywords to Add:** Important keywords from the job description missing in the CV
6. **ATS Optimization Tips:** How to make the CV more ATS-friendly

Format your response clearly with sections and bullet points for easy reading.
    `.trim();
  }

  /**
   * Extract fit score from analysis text
   */
  extractFitScore(analysisText) {
    const match = analysisText.match(/FIT\s*SCORE:?\s*(\d+)/i);
    if (match && match[1]) {
      const score = parseInt(match[1], 10);
      return Math.min(Math.max(score, 0), 100); // Clamp between 0-100
    }
    return null;
  }
}

module.exports = new AIService();