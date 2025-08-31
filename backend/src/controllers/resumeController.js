const ollama = require("ollama");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const natural = require("natural");

exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

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

    let aiSkills = { hardSkills: [], softSkills: [] };
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
      hardSkills: foundHardSkills,
      softSkills: foundSoftSkills,
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
