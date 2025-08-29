const express = require('express');
const multer = require('multer');
const { parseResume } = require('../controllers/resumeController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.single('resume'), parseResume);

module.exports = router;
