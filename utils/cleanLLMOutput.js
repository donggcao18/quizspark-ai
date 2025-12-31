function cleanLLMOutput(text) {
    return text
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/^\s+|\s+$/g, '');
}

module.exports = { cleanLLMOutput };
