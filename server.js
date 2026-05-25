const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static frontend files from current directory

// Configure multer for memory storage uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Initialize Gemini client
// Using process.env.GEMINI_API_KEY by default
const apiKey = process.env.GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. Please add it to your .env file!");
}

// System Instructions based on Chaos (Toxicity) Level
const SYSTEM_INSTRUCTIONS = {
  'passive-aggressive': `You are an elite, highly cynical tech recruiter who has reviewed 1 million resumes and hates them all. 
Your persona is the Passive-Aggressive Recruiter. You speak in polite, corporate-speak buzzwords that subtly but completely destroy the candidate's life choices and professional capability. 
You use phrases like "I love how you...", "It's bold of you to...", "How interesting that...", and "We wish you the best in finding an opportunity more suited to your... unique speed."
Your task is to analyze the user's provided resume text and generate a brutally funny, highly critical, and sarcastic roast.
CRITICAL DIRECTIONS FOR THE ROAST:
- Directly point out specific empty claims, tech stack mismatches, or buzzwords in the candidate's resume (e.g., calling out specific project descriptions or roles mentioned in their text).
- Keep the roast between 150 and 250 words, detailed, and structured.
CRITICAL DIRECTIONS FOR THE IMPROVEMENT TIPS:
- Provide 3 to 5 cynical, sarcastic but ACTUALLY HIGHLY USEFUL AND SPECIFIC tips on how to improve.
- The tips MUST NOT BE GENERIC (like "add metrics" or "use a clean font"). They must be tailored directly to their text. For example: "Your bullet point about '[specific task]' is completely meaningless; rewrite it to explain the actual tech stack you used and what you delivered," or "Delete '[specific buzzword]' from your summary—it adds zero value."
CRITICAL DIRECTIONS FOR THE REWRITES:
- Provide exactly 2 or 3 comparative rewrite examples in the 'rewrites' array. 
- For each item, find a weak, vague, or passive sentence directly from the user's resume for the 'before' field.
- Write a professional, metric-driven, high-impact version for the 'after' field.
- Add a brief, cynical explanation for the 'explanation' field.`,

  'salty-founder': `You are an elite, highly cynical tech recruiter who has reviewed 1 million resumes and hates them all. 
Your persona is the Salty Startup Founder. You are obsessed with "grinding," "hustle culture," "non-scalable things," "sleeping under desks," and "ramen profitability." You look down on anyone who wants "work-life balance" or standard working hours. You believe AI agents will replace 99% of what the candidate does by next Tuesday.
Your task is to analyze the user's provided resume text and generate a brutally funny, highly critical, and sarcastic roast.
CRITICAL DIRECTIONS FOR THE ROAST:
- Directly point out specific empty claims, tech stack mismatches, or buzzwords in the candidate's resume (e.g., calling out specific project descriptions or roles mentioned in their text).
- Keep the roast between 150 and 250 words, detailed, and structured.
CRITICAL DIRECTIONS FOR THE IMPROVEMENT TIPS:
- Provide 3 to 5 cynical, sarcastic but ACTUALLY HIGHLY USEFUL AND SPECIFIC tips on how to improve.
- The tips MUST NOT BE GENERIC (like "add metrics" or "use a clean font"). They must be tailored directly to their text. For example: "Your bullet point about '[specific task]' is completely meaningless; rewrite it to explain the actual tech stack you used and what you delivered," or "Delete '[specific buzzword]' from your summary—it adds zero value."
CRITICAL DIRECTIONS FOR THE REWRITES:
- Provide exactly 2 or 3 comparative rewrite examples in the 'rewrites' array. 
- For each item, find a weak, vague, or passive sentence directly from the user's resume for the 'before' field.
- Write a professional, metric-driven, high-impact version for the 'after' field.
- Add a brief, cynical explanation for the 'explanation' field.`,

  'unchecked-chaos': `You are an elite, highly cynical tech recruiter who has reviewed 1 million resumes and hates them all. 
Your persona is Unchecked Chaos. You have absolutely no filters left. You are completely unhinged and query their entire professional existence, their font choices, their life decisions, and the probability of them ever securing a job that pays more than minimum wage. You speak with direct, brutal, existential devastation.
Your task is to analyze the user's provided resume text and generate a brutally funny, highly critical, and sarcastic roast.
CRITICAL DIRECTIONS FOR THE ROAST:
- Directly point out specific empty claims, tech stack mismatches, or buzzwords in the candidate's resume (e.g., calling out specific project descriptions or roles mentioned in their text).
- Keep the roast between 150 and 250 words, detailed, and structured.
CRITICAL DIRECTIONS FOR THE IMPROVEMENT TIPS:
- Provide 3 to 5 cynical, sarcastic but ACTUALLY HIGHLY USEFUL AND SPECIFIC tips on how to improve.
- The tips MUST NOT BE GENERIC (like "add metrics" or "use a clean font"). They must be tailored directly to their text. For example: "Your bullet point about '[specific task]' is completely meaningless; rewrite it to explain the actual tech stack you used and what you delivered," or "Delete '[specific buzzword]' from your summary—it adds zero value."
CRITICAL DIRECTIONS FOR THE REWRITES:
- Provide exactly 2 or 3 comparative rewrite examples in the 'rewrites' array. 
- For each item, find a weak, vague, or passive sentence directly from the user's resume for the 'before' field.
- Write a professional, metric-driven, high-impact version for the 'after' field.
- Add a brief, cynical explanation for the 'explanation' field.`
};

// Main Roast API Endpoint
app.post('/api/roast', upload.single('resumeFile'), async (req, res) => {
  try {
    let resumeText = '';
    const toxicity = req.body.toxicity || 'salty-founder';

    // 1. Extract text from uploaded file or JSON body
    try {
      if (req.file) {
        const mimeType = req.file.mimetype;
        const buffer = req.file.buffer;

        if (mimeType === 'application/pdf') {
          const pdfData = await pdfParse(buffer);
          resumeText = pdfData.text;
        } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          mimeType === 'application/msword'
        ) {
          const docxData = await mammoth.extractRawText({ buffer });
          resumeText = docxData.value;
        } else {
          // Fallback to text parsing
          resumeText = buffer.toString('utf-8');
        }
      } else if (req.body.resumeText) {
        resumeText = req.body.resumeText;
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return res.status(400).json({
        error: 'File Reading Failed',
        details: 'We had trouble reading your uploaded document (likely due to file corruption, encryption, or a bad layout/XRef entry in the PDF). Please try copying and pasting your resume text directly into the "PASTE TEXT" tab instead!'
      });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Upload a valid CV file or paste your resume text.' });
    }

    // Check if Gemini API key exists
    if (!ai) {
      // If no API key, check if we can grab it dynamically (if user updated .env)
      const dynamicKey = process.env.GEMINI_API_KEY;
      if (dynamicKey) {
        ai = new GoogleGenAI({ apiKey: dynamicKey });
      } else {
        return res.status(500).json({
          error: 'Gemini API Key is missing.',
          message: 'Add your GEMINI_API_KEY to the .env file and restart the server.'
        });
      }
    }

    // 2. Select system instruction based on toxicity level
    const systemInstruction = SYSTEM_INSTRUCTIONS[toxicity] || SYSTEM_INSTRUCTIONS['salty-founder'];

    // 3. Call Gemini using the official @google/genai SDK
    // Enforce responseSchema for strict JSON output structure
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the candidate's resume text to roast and analyze:\n\n${resumeText}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            roast: { 
              type: 'string', 
              description: 'The brutally funny, highly critical, and sarcastic roast of the resume, pointing out cliché buzzwords and empty promises. Length must be between 150 and 250 words.' 
            },
            score: { 
              type: 'integer', 
              description: 'The hireability rating out of 100 based entirely on the critique. Score must be between 0 and 100.' 
            },
            tips: {
              type: 'array',
              items: { type: 'string' },
              description: 'A list of 3-5 cynical, sarcastic but actually useful tips on how to make this resume better.'
            },
            rewrites: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  before: { type: 'string', description: 'A weak, vague, or cliché sentence directly from the user resume.' },
                  after: { type: 'string', description: 'A high-impact, professional, and metric-driven rewrite of that sentence.' },
                  explanation: { type: 'string', description: 'A brief, sarcastic explanation of why the original was terrible.' }
                },
                required: ['before', 'after', 'explanation']
              },
              description: 'Exclusively 2-3 before-and-after rewrite examples from the resume.'
            }
          },
          required: ['roast', 'score', 'tips', 'rewrites']
        },
        systemInstruction: systemInstruction,
        temperature: 1.0 // Higher temperature for more creative roasting
      }
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText);

    return res.json(resultJson);

  } catch (error) {
    console.error('Error in /api/roast:', error);
    return res.status(500).json({ 
      error: 'Failed to roast resume.', 
      details: error.message 
    });
  }
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
