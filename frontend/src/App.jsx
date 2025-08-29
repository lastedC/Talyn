import { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial" }}>
      <h1>📄 Resume Analyzer</h1>
      <p>Upload a PDF or DOCX resume to test the backend API.</p>

      {/* UploadForm handles the upload and calls setResult when done */}
      <UploadForm onResult={setResult} />

      {result && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2>Analysis Result</h2>
          <pre style={{ background: "#f8f8f8", padding: "1rem", borderRadius: "6px", overflowX: "auto" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
