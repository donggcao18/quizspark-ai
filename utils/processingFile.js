const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth"); // For DOCX files
const textract = require("textract"); // Alternative for multiple formats

async function extractPdfText(filePath) {
    const parser = new PDFParse({ url: filePath });
    fileContent = (await parser.getText()).text;
    return fileContent;
}

async function extractDocxText(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value || '';
    } catch (error) {
        console.error('DOCX extraction error:', error);
        throw new Error('Failed to extract DOCX text');
    }
}

async function extractDocText(filePath) {
    return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
            if (error) {
                console.error('DOC extraction error:', error);
                reject(new Error('Failed to extract DOC text'));
            } else {
                resolve(text || '');
            }
        });
    });
}


async function readFileContent(file) {
    const path = file.path;
    const name = file.originalname.toLowerCase();

    try {
        if (name.endsWith('.pdf')) {
            return await extractPdfText(path);
        }
        else if (name.endsWith(".docx")) {
            return await extractDocxText(path);
        }
        else if (name.endsWith(".doc")) {
            return await extractDocText(path);
        }
        else if (name.endsWith(".txt")) {
            return fs.readFileSync(path, "utf8");
        }

        else {
            throw new Error(`Unsupported file type: ${name}`);
        }
    } catch (error) {
        console.error(`Error reading file ${name}:`, error);
        throw error;
    }
}


module.exports = { readFileContent };
