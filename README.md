# TALYN

An AI-powered web application that analyzes resumes and provides structured feedback on skills, experience, and missing information.  
Built with **Node.js + Express (backend)** and **React + Vite (frontend)**.

---

## Features
- Upload resume in **PDF** or **DOCX** format  
- Parse resume text and extract sections (Skills, Education, Experience)  
- Basic **keyword extraction** using NLP  
- Generate a **feedback report** with scoring  
- Interactive frontend with charts and recommendations  

---

## Tech Stack
- **Frontend**: React, Vite, Chart.js  
- **Backend**: Node.js, Express, Multer, pdf-parse, mammoth, natural, ollama
- **Dev Tools**: Nodemon, Concurrently  
- **Deployment**: (Planned) Netlify + Render/Heroku  

---

## Project Structure

```
talyn/
│── backend/ # Node.js + Express API
│── frontend/ # React + Vite client
│── .gitignore
│── README.md
│── package.json # root scripts (with concurrently)
```

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Run development servers (frontend + backend concurrently)
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5050
- Ollama API: http://127.0.0.1:11434 (ensure `ollama serve` is running)

## Roadmap
- [ ] Compare resume against a job description
- [ ] Advanced NLP using HuggingFace/OpenAI APIs
- [ ] Export feedback report as PDF
- [ ] User accounts & saved resumes

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## License
<img src="https://shields.io/github/license/lastedC/Talyn">