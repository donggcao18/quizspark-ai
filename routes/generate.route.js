const express = require("express");
const multer = require("multer");
const { generateQuiz } = require("../services/generate.service");

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed"));
    }
});


router.post("/generate", upload.single("document"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const quiz = await generateQuiz(req.file);
        res.json({
            success: true,
            filename: req.file.originalname,
            quiz
        });
    } catch (err) {
        console.error("Quiz generation failed:", err);
        res.status(500).json({
            error: "Quiz generation failed",
            details: err.message
        });
    }
});

module.exports = router;
