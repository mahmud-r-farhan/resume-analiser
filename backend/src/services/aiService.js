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
    return `You are a professional resume writer. Create an optimized resume in MARKDOWN format.

IMPORTANT: Start with the candidate's name as a heading (# First Last Name).
Then include their professional title (## Senior Software Engineer or similar).
Then their contact info (email | phone | location | linkedin).

Follow this structure:
# Candidate Full Name
## Professional Title
email@example.com | +1-555-0123 | City, State | linkedin.com/in/profile

### Summary
[2-3 sentences about professional background]

### Experience
[Job Title] at [Company] | [Start Date - End Date]
- Achievement with quantifiable result
- [More bullets]

### Skills
[Key technical skills separated by commas or organized by category]

### Education
[Degree] | [University] | [Year]

ORIGINAL CV:
${cvText}

TARGET JOB DESCRIPTION:
${jobDescription}

ANALYSIS INSIGHTS:
${analysis}

REQUIREMENTS:
- Incorporate all feedback from the analysis
- Add ATS keywords from the job description naturally
- Use strong action verbs
- Quantify achievements (numbers, percentages, dollar amounts)
- Keep roles and companies accurate
- DO NOT fabricate experience
- Ensure markdown is properly formatted with # ## and ### headings
- Include name, title, and contact info at the top

Create the optimized resume now:`;
  }

  extractFitScore(analysis) {
    const match = analysis.match(/fit score[:\s]*(\d+)/i) || 
                  analysis.match(/(\d+)\s*\/\s*100/i) ||
                  analysis.match(/(\d{2,3})\s*(?:out of|%)?/i);
    
    if (match) {
      const score = parseInt(match[1], 10);
      return Math.max(0, Math.min(100, score));
    }
    return 50; // Default safe value
  }

  async analyzeCV(cvText, jobDescription, model) {
    const prompt = this.buildAnalysisPrompt(cvText, jobDescription);
    const effectiveModel = model || 'deepseek/deepseek-chat-v3.1:free';

    try {
      const completion = await this.openai.chat.completions.create({
        model: effectiveModel,
        messages: [
          { 
            role: 'system', 
            content: 'You are a premium career coach and ATS expert. Provide detailed, professional analysis with actionable insights.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const analysis = completion.choices[0].message.content?.trim() || '';
      const fitScore = this.extractFitScore(analysis);

      if (!analysis) {
        throw new Error('No analysis content returned from LLM');
      }

      return { 
        analysis, 
        fitScore, 
        model: effectiveModel, 
        tokensUsed: completion.usage?.total_tokens || 0 
      };
    } catch (error) {
      this.handleAIError(error, effectiveModel);
    }
  }

  async optimizeCV(cvText, jobDescription, analysis, model, template) {
    const prompt = this.buildOptimizationPrompt(cvText, jobDescription, analysis, template);
    const effectiveModel = model || 'deepseek/deepseek-chat-v3.1:free';

    try {
      const completion = await this.openai.chat.completions.create({
        model: effectiveModel,
        messages: [
          { 
            role: 'system', 
            content: `You are a professional resume writer. Your task is to rewrite the CV in clean, well-structured MARKDOWN.

CRITICAL RULES:
1. ALWAYS start with: # [Full Name]
2. ALWAYS follow with: ## [Professional Title]
3. ALWAYS include contact info: email | phone | location
4. ALWAYS use proper markdown headings (### for sections like Experience, Skills, Education)
5. ALWAYS include bullet points for achievements
6. NEVER make up experience - only enhance what's provided
7. ALWAYS be ATS-friendly with clear formatting
8. Return ONLY the markdown resume, nothing else` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 2500
      });

      const optimized = completion.choices[0].message.content?.trim() || '';

      if (!optimized) {
        throw new Error('No optimized content returned from LLM');
      }

      // Clean up common issues
      let cleaned = optimized
        .replace(/```markdown\n?/g, '') // Remove markdown code blocks
        .replace(/```\n?/g, '')
        .trim();

      // Ensure starts with # if missing
      if (!cleaned.startsWith('#')) {
        cleaned = `# Resume\n\n${cleaned}`;
      }

      return { 
        optimized: cleaned, 
        model: effectiveModel, 
        tokensUsed: completion.usage?.total_tokens || 0 
      };
    } catch (error) {
      this.handleAIError(error, effectiveModel);
    }
  }

  handleAIError(error, model) {
    console.error('AI Service Error:', error);
    
    if (error.status === 401) throw new Error('Invalid API key - check OPENROUTER_API_KEY');
    if (error.status === 429) throw new Error('Rate limit exceeded. Please try again in a few moments.');
    if (error.status === 500) throw new Error('AI service is temporarily unavailable. Please try again.');
    if (error.status === 404) {
      if (error.message.includes('data policy')) {
        throw new Error('OpenRouter data policy issue: Enable "free endpoints" in https://openrouter.ai/settings/privacy');
      }
      throw new Error(`Model not found: ${model}. Please select a different model.`);
    }
    if (error.status === 400) {
      throw new Error(`Invalid request. ${error.message}`);
    }
    
    throw new Error(`AI Error: ${error.message}`);
  }
}

module.exports = new AIService();