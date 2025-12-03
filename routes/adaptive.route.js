const express = require("express");
const router = express.Router();
const { generateAdaptiveQuiz } = require("../services/adaptive.service");

router.post("/adaptive", async (req, res) => {
    try {
        const { wrong_questions, num_questions, difficulty } = req.body;

        if (!wrong_questions || !Array.isArray(wrong_questions)) {
            return res.status(400).json({
                error: "wrong_questions must be an array"
            });
        }

        const quiz = await generateAdaptiveQuiz(
            wrong_questions,
            num_questions,
            difficulty
        );

        res.json({
            success: true,
            totalQuestions: quiz.questions.length,
            questions: quiz.questions
        });

    } catch (error) {
        console.error("Adaptive error:", error);
        res.status(500).json({
            error: "Failed to generate adaptive quiz",
            details: error.message
        });
    }
});

module.exports = router;
