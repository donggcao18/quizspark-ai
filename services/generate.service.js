const { GoogleGenerativeAI } = require('@google/generative-ai');
const { readFileContent } = require("../utils/processingFile");
const { buildPrompt } = require("../utils/buildPrompts");
const { cleanLLMOutput } = require("../utils/cleanLLMOutput");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(genAI)

async function generateQuiz(file) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // get text content
    let content = await readFileContent(file);

    // truncate if extremely long
    content = content.replace(/\s+/g, " ").trim().slice(0, 15000);

    const prompt = buildPrompt(content, 'generateQuiz');

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

module.exports = { generateQuiz };
