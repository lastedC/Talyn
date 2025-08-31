import { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div
      style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial" }}
    >
      <h1>Resume Analyzer</h1>
      <p>Upload a PDF or DOCX resume to test the backend API.</p>

      <UploadForm onResult={setResult} />

      {result && console.log(result)}

      {result?.analysis ? (
        <div>
          <p>Word count: {result.analysis.wordCount}</p>
          <p>Hard skills: {result.analysis.hardSkills.join(", ")}</p>
          <p>Soft skills: {result.analysis.softSkills.join(", ")}</p>
          <p>Hard Skills (AI): {result.analysis.aiRaw.hardSkills}</p>
          <p>Soft Skills (AI): {result.analysis.aiRaw.softSkills}</p>
        </div>
      ) : result?.message ? (
        <div style={{ color: "red" }}>Error: {result.message}</div>
      ) : null}
    </div>
  );
}

export default App;
