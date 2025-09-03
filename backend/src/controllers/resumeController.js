const ollama = require("ollama");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const natural = require("natural");
const mammoth = require("mammoth");

function extractJson(text) {
  try {
    const match = text.match(/```json([\s\S]*?)```/i);
    if (match) {
      return JSON.parse(match[1].trim());
    }

    const braceMatch = text.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }

    throw new Error("No JSON found in Ollama response");
  } catch (err) {
    console.warn("Failed to parse Ollama JSON:", err.message);
    return { hardSkills: [], softSkills: [] };
  }
}

exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    let text = "";
    let pageCount = 1;
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
      pageCount = pdfData.numpages || 1;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
      const words = text.split(/\s+/).filter(Boolean);
      pageCount = Math.max(1, Math.ceil(words.length / 350));
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Upload PDF or DOCX.",
      });
    }

    const cleanText = text
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/[^\w\s]/g, " ");

    const tokenizer = new natural.WordTokenizer();
    const cleanTokens = tokenizer.tokenize(cleanText);

    const hardSkillsList = require("../data/hardSkills.json");
    const softSkillsList = require("../data/softSkills.json");

    const foundHardSkills = hardSkillsList.filter((skill) =>
      cleanText.includes(skill)
    );

    const normalizedText = cleanText.replace(/[-_]/g, " ").replace(/\s+/g, " ");

    const foundSoftSkills = softSkillsList.filter((skill) => {
      const skillPattern = skill.toLowerCase().replace(/ /g, "\\s+");
      const regex = new RegExp(skillPattern, "i");
      return regex.test(normalizedText);
    });

    const ollamaResponse = await ollama.default.generate({
      model: "llama3.1",
      prompt: `You are a resume analyzer. Extract skills clearly into JSON.

      Here is a resume text:
      ${text}

      Return JSON in this format:
      {
        "hardSkills": [...],
        "softSkills": [...]
      }`,
    });

    let aiSkills = extractJson(ollamaResponse.response);
    try {
      const jsonMatch = ollamaResponse.response.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        aiSkills = JSON.parse(jsonMatch[1].trim());
      } else {
        aiSkills = JSON.parse(ollamaResponse.response);
      }
    } catch (e) {
      console.warn(
        "Ollama response not valid JSON, falling back:",
        ollamaResponse.response
      );
    }

    const analysis = {
      wordCount: cleanTokens.length,
      pageCount,
      aiRaw: {
        hardSkills: aiSkills.hardSkills.join(", "),
        softSkills: aiSkills.softSkills.join(", "),
      },
    };

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
