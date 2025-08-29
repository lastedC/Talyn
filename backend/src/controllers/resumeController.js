const pdfParse = require('pdf-parse');
const fs = require('fs');

exports.parseResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Clean text & analyze
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
