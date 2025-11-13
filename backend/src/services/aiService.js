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
        'HTTP-Referer': process.env.APP_URL || 'https://resumeanalizer.vercel.app',
        'X-Title': 'CV Optimizer'
      }
    });
  }

  buildAnalysisPrompt(cvText, jobDescription) {
    return `Analyze the following CV against this job description. Provide a detailed analysis including strengths, weaknesses, missing skills, and a fit score from 0-100.

CV:
${cvText}

Job Description:
${jobDescription}`;
  }

  buildOptimizationPrompt(cvText, jobDescription, analysis, template) {
    return `Using the provided template, optimize and rewrite the CV to match the job description. Incorporate the analysis insights, add relevant keywords, use action verbs, quantify achievements, and ensure ATS compatibility.

CV:
${cvText}

Job Description:
${jobDescription}

Analysis:
${analysis}

Template:
${template}`;
  }

  extractFitScore(analysis) {
    const match = analysis.match(/fit score\D*(\d+)/i);
    return match ? parseInt(match[1], 10) : 50; // Default to 50 if no score found
  }

  async analyzeCV(cvText, jobDescription, model) {
    const prompt = this.buildAnalysisPrompt(cvText, jobDescription);
    const effectiveModel = model;

    try {
      const completion = await this.openai.chat.completions.create({
        model: effectiveModel,
        messages: [
          { role: 'system', content: 'You are a premium career coach and ATS expert. Provide detailed, professional analysis with actionable insights.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 3000
      });

      const analysis = completion.choices[0].message.content?.trim();
      const fitScore = this.extractFitScore(analysis);

      return { analysis, fitScore, model: effectiveModel, tokensUsed: completion.usage?.total_tokens || 0 };
    } catch (error) {
      this.handleAIError(error, effectiveModel);
    }
  }

  async optimizeCV(cvText, jobDescription, analysis, model, template) {
    const prompt = this.buildOptimizationPrompt(cvText, jobDescription, analysis, template);
    const effectiveModel = model;

    try {
      const completion = await this.openai.chat.completions.create({
        model: effectiveModel,
        messages: [
          { role: 'system', 
            content: 'You are a premium resume writer and ATS optimizer. Rewrite the CV to be ATS-friendly, keyword-rich, and perfectly matched to the job. Use professional formatting with standard sections, bullet points, quantifiable achievements, and action verbs.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 3000
      });

      const optimized = completion.choices[0].message.content?.trim();

      return { optimized, model: effectiveModel, tokensUsed: completion.usage?.total_tokens || 0 };
    } catch (error) {
      this.handleAIError(error, effectiveModel);
    }
  }

  handleAIError(error, model) {
    console.error('AI Service Error:', error);
    if (error.status === 401) throw new Error('Invalid API key');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again later.');
    if (error.status === 500) throw new Error('AI service is temporarily unavailable');
    if (error.status === 404) {
      if (error.message.includes('data policy')) {
        throw new Error('OpenRouter data policy issue: Enable "free endpoints that may publish prompts" in https://openrouter.ai/settings/privacy');
      } else {
        throw new Error(`Model not found: ${model}. Try alternatives.`);
      }
    }
    if (error.status === 400 && error.message.includes('not a valid model ID')) throw new Error(`Invalid model ID: ${model}`);
    throw new Error(`AI failed: ${error.message}`);
  }
}

module.exports = new AIService();