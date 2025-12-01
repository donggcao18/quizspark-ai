const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
});



router.post('/generate', upload.single('document'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const quiz = await generateQuiz(req.file);
        res.json({ success: true, filename: req.file.originalname, quiz });
    } catch (err) {
        console.error('Quiz generation failed:', err);
        res.status(500).json({ error: 'Quiz generation failed', details: err.message });
    }
});



async function extractPdfText(filePath) {

    const parser = new PDFParse({ url: filePath });

    fileContent = (await parser.getText()).text;

    return fileContent;
}



async function generateQuiz(file) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let content = await readFileContent(file);

    // Basic cleaning for safety
    content = content.replace(/\s+/g, ' ').trim().slice(0, 15000);

    const prompt = buildPrompt_gen_from_material(content);

    const result = await model.generateContent(prompt);
    const text = cleanLLMOutput(result.response.text());

    let quiz;
    try {
        quiz = JSON.parse(text);
    } catch (e) {
        console.error("RAW LLM OUTPUT:", text);
        throw new Error("AI returned invalid JSON");
    }

    return {
        title: `Quiz for ${file.originalname}`,
        questions: quiz.questions,
        totalQuestions: quiz.questions.length
    };
}



async function readFileContent(file) {
    const path = file.path;
    const name = file.originalname.toLowerCase();

    if (name.endsWith('.pdf')) {
        return await extractPdfText(path);
    }
    return fs.readFileSync(path, 'utf8');
}



function buildPrompt_gen_from_quiz(documentText) {
    return `
You are a quiz formatter. Transform the following quiz content into a standardized JSON format.
    The input may contain questions in various formats (numbered, lettered, mixed formatting).

    Extract and format into this EXACT JSON structure (no markdown, no extra text):
    
    {
        "questions": [
            {
              "description": "The question text without numbering",
              "choices": ["Option A", "Option B", "Option C", "Option D"],
              "question_type": "multiple_choice",
              "explanation": "A short explanation for the correct answer",
              "answer": {
                  "index": 0
              }
             }
        ]
    }

    Rules:
    - Remove question numbers (1., 2., Q1, etc.)
    - Convert all answer choices to options array (A, B, C, D or 1, 2, 3, 4)
    - Set correct answer index (0 for A/1st, 1 for B/2nd, etc.)
    - If correct answer is marked or indicated, use that index
    - If no correct answer is marked, set correct: 0 as default
    - Clean up formatting and extra whitespace
    - Ensure exactly 4 options per question

    Quiz content to transform:
    """${documentText}"""
    `.trim();
}

function buildPrompt_gen_from_material(documentText) {
    return `
You are a quiz generator system.

Based ONLY on the provided content, produce 5 multiple-choice questions.

Return ONLY valid JSON with this exact format:

    {
        "questions": [
            {
              "description": "The question text without numbering",
              "choices": ["Option A", "Option B", "Option C", "Option D"],
              "question_type": "multiple_choice",
              "explanation": "A short explanation for the correct answer",
              "answer": {
                  "index": 0
              }
             }
        ]
    }

Rules:
- NO markdown
- NO comments
- NO trailing commas
- "correct" must be a number (0–3)
- Each question MUST have exactly 4 options
- Use only facts from the text; no hallucinations

Document content:
    """${documentText}"""
    `.trim();
}



function cleanLLMOutput(text) {
    return text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/^\s+|\s+$/g, '');
}

module.exports = router;
