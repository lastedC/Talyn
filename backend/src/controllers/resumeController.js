const ollama = require("ollama");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const natural = require("natural");
const mammoth = require("mammoth");

const experienceKeywords = [
  "experience",
  "work history",
  "professional experience",
];

const dateRegex =
  /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4})\b/gi;

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

function extractEmails(text) {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  return text.match(emailRegex) || [];
}

function extractPhoneNumbers(text) {
  const phoneRegex = /\+?\d[\d\s().-]{7,}\d/g;
  return text.match(phoneRegex) || [];
}

function extractWebsite(text) {
  const websiteRegex =
    /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;
  return text.match(websiteRegex) || [];
}

function sectionExists(text, keywords, { maxHeaderLen = 80 } = {}) {
  if (!text) return false;

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.some((line) => {
    if (line.length > maxHeaderLen) return false; // headers are usually short
    return keywords.some((keyword) =>
      new RegExp(`\\b${keyword}\\b`, "i").test(line)
    );
  });
}

function classifyDate(dateStr) {
  dateStr = dateStr.toLowerCase().trim();

  if (/^\d{4}$/.test(dateStr)) return "YYYY"; // e.g. 2020
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(dateStr)) return "DD/MM/YYYY"; // numeric
  if (/^\d{1,2}[\/\-]\d{4}$/.test(dateStr)) return "MM/YYYY"; // short numeric
  if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)/.test(dateStr))
    return "Month YYYY"; // e.g. Jan 2020

  return "Other";
}

function checkDateConsistency(text) {
  const matches = text.match(dateRegex) || [];
  const formats = [...new Set(matches.map(classifyDate))];

  return {
    formats,
    isConsistent: formats.length <= 1,
  };
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
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
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
      prompt: `You are a resume analyzer. 
      Extract the following information clearly into JSON. DO NOT INCLUDE ANY OTHER TEXT:
      - Address/Location
      - Experience
      - Hard & Soft skills 

      Rules:
      - List skills seperated by commas.
      - Do not include any other text.
      - Gather soft skills from inference. If you think it is a hard skill, then it is a hard skill.
      - Only list the soft skill names with no other text.

      Here is a resume text:
      ${text}

      Return JSON in this format:
      {
        "location": [...]
        "experience": [...],
        "hardSkills": [...],
        "softSkills": [...],
      }`,
    });

    console.log("Ollama Responded:", ollamaResponse.response);

    let aiAnalysis = extractJson(ollamaResponse.response);
    try {
      const jsonMatch = ollamaResponse.response.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[1].trim());
      } else {
        aiAnalysis = JSON.parse(ollamaResponse.response);
      }
    } catch (e) {
      console.warn(
        "Ollama response not valid JSON, falling back:",
        ollamaResponse.response
      );
    }
    // console.log(aiAnalysis);

    const locationBoolean =
      Array.isArray(aiAnalysis.location) && aiAnalysis.location.length > 0;

    const extractedEmails = extractEmails(text);
    const emailBoolean = extractedEmails.length > 0;
    const extractedPhone = extractPhoneNumbers(text);
    const phoneBoolean = extractedPhone.length > 0;

    const hasEducationSection = sectionExists(text, ["education"]);
    const hasExperienceSection = sectionExists(text, experienceKeywords);

    const hasExperience =
      Array.isArray(aiAnalysis.experience) && aiAnalysis.experience.length > 0;

    // Calculate hard and soft skills ratings after AI analysis is complete
    const hardSkillsCount =
      foundHardSkills.length +
      (aiAnalysis.hardSkills ? aiAnalysis.hardSkills.length : 0);
    const softSkillsCount =
      foundSoftSkills.length +
      (aiAnalysis.softSkills ? aiAnalysis.softSkills.length : 0);

    const hardSkillsRating = Math.min(8, Math.max(0, hardSkillsCount));
    const softSkillsRating = Math.min(8, Math.max(0, softSkillsCount));

    const dateFormats = checkDateConsistency(text);
    const dateFormatted = dateFormats.isConsistent;
    const educationMatchBoolean = false;
    const hasWebsite = extractWebsite(text).length > 0;

    const searchabilityFactors = [
      locationBoolean,
      emailBoolean,
      phoneBoolean,
      hasEducationSection,
      hasExperienceSection,
      hasExperience,
      dateFormatted,
      educationMatchBoolean,
    ];

    const searchabilityRating = searchabilityFactors.reduce(
      (score, val) => score + Number(val),
      0
    );

    const wordCount = cleanTokens.length;
    const wordCountBoolean = wordCount < 1000;

    const recruiterTipsFactors = [hasWebsite, wordCountBoolean];

    const recruiterTipsRating = recruiterTipsFactors.reduce(
      (score, val) => score + Number(val),
      0
    );

    const analysis = {
      searchability: {
        rating: searchabilityRating,
        maxRating: 8,
        contactInformation: {
          location: locationBoolean,
          email: emailBoolean,
          phoneNumber: phoneBoolean,
        },
        sections: {
          hasSection: {
            education: hasEducationSection,
            experience: hasExperienceSection,
          },
          experience: hasExperience,
        },
        dateFormatting: dateFormatted,
        educationMatch: false,
      },
      hardSkills: {
        rating: hardSkillsRating,
        maxRating: 8,
        skills: aiAnalysis.hardSkills,
      },
      softSkills: {
        rating: softSkillsRating,
        maxRating: 8,
        skills: aiAnalysis.softSkills,
      },
      recruiterTips: {
        rating: recruiterTipsRating,
        maxRating: 2,
        wordCount: {
          count: wordCount,
          result: wordCountBoolean,
        },
        website: hasWebsite,
      },
    };

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
