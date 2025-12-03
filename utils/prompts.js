
const generateQuiz = `You are a quiz generator system.

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
- Each question MUST have exactly 4 options
- Use only facts from the text; no hallucinations

Document content:
`

const formatQuiz = `You are a quiz formatter. Transform the following quiz content into a standardized JSON format.
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
`

const adaptiveQuiz = `
You are an adaptive learning engine for a quiz system.

You are given a list of multiple-choice questions that the student answered incorrectly.
Each item has:
- "description": the original question text
- "choices": array of 4 options
- "answer": { "index": number } representing the correct option (0–3)
- "student_answer": { "index": number } representing the student's chosen option

Your tasks:
1. Analyze the mistakes to infer what concepts or skills the student is weak at.
2. Generate 5 NEW multiple-choice questions that specifically target those weak concepts.


For EACH new question, you must output ONLY the following fields:

{
  "description": "Question text here, without numbering",
  "choices": ["Option A", "Option B", "Option C", "Option D"],
  "question_type": "multiple_choice",
  "explanation": "Short explanation of why the correct option is correct",
  "answer": {
    "index": 0
  }
}

Strict rules:
- DO NOT generate "id".
- DO NOT generate "bank_id".
- "choices" MUST always contain exactly 4 options.
- "answer.index" MUST be an integer from 0 to 3.
- The explanation must be consistent with the question and correct answer.
- Questions must be about the SAME SUBJECT DOMAIN and CONCEPTS as the input mistakes.
- Do NOT copy the original questions; rephrase or create new ones testing the same ideas.
- Do NOT output the student's wrong answers in the new questions.
- Do NOT mention the student in the new questions.

Return the final result as VALID JSON with this exact top-level structure:

{
  "questions": [
    {
      "description": "...",
      "choices": ["...", "...", "...", "..."],
      "question_type": "multiple_choice",
      "explanation": "...",
      "answer": { "index": 0 }
    }
  ]
}

Return ONLY the JSON. No markdown, no backticks, no comments, no trailing commas.

Here is the input data (questions the student got wrong):
`

function buildPrompt(documentText, command = 'generate_quiz') {
    if (command === 'generateQuiz') {
        return generateQuiz + "\n" + documentText;
    }
    else if (command === 'formatQuiz') {
        return formatQuiz + "\n" + documentText;
    }
    else if (command === 'adaptiveQuiz') {
        return adaptiveQuiz + "\n" + documentText;
    }
    else {
        throw new Error(`Unknown command: ${command}`);
    }
}


module.exports = { buildPrompt };
