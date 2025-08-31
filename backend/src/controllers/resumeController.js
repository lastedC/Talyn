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

    const analysis = {
      wordCount: cleanTokens.length,
      hardSkills: foundHardSkills,
      softSkills: foundSoftSkills,
    };

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
