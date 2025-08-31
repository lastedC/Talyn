const pdfParse = require('pdf-parse');
const fs = require('fs');

exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;
    const analysis = { 
      wordCount: text.split(/\s+/).length,
      skills: ["JavaScript", "React"].filter(skill => text.includes(skill))
    };

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
