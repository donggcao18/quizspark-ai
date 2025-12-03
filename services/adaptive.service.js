const { GoogleGenerativeAI } = require("@google/generative-ai");
const { cleanLLMOutput } = require("../utils/clean");
const { buildPrompt } = require("../utils/prompts");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateAdaptiveQuiz(wrongQuestions, numQuestions, difficulty) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const target = Number.isInteger(numQuestions) ? numQuestions : 5;
    const level = difficulty || "mixed";

    const prompt = buildPrompt(JSON.stringify(wrongQuestions), "adaptiveQuiz");

    const result = await model.generateContent(prompt);


    let text = cleanLLMOutput(result.response.text());

    let quiz;
    try {
        quiz = JSON.parse(text);
    } catch (err) {
        console.error("RAW ADAPTIVE OUTPUT:", text);
        throw new Error("AI returned invalid JSON");
    }

    return quiz;
}

module.exports = { generateAdaptiveQuiz };
