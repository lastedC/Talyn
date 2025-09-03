import { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📄 Resume Analyzer</h1>
      <p style={styles.subtitle}>
        Upload a <strong>PDF</strong> or <strong>DOCX</strong> resume to test
        the backend API.
      </p>

      <div style={styles.card}>
        <UploadForm onResult={setResult} />
      </div>

      {result && (
        <div style={styles.resultCard}>
          {result.analysis ? (
            <>
              <h2 style={styles.resultTitle}>Analysis Result</h2>
              <p>
                <strong>Word count:</strong> {result.analysis.wordCount}
              </p>
              <p>
                <strong>Page count:</strong>{" "}
                {result.analysis.pageCount ?? "N/A"}
              </p>
              <p>
                <strong>Hard Skills:</strong>{" "}
                {result.analysis.aiRaw.hardSkills || "None found"}
              </p>
              <p>
                <strong>Soft Skills:</strong>{" "}
                {result.analysis.aiRaw.softSkills || "None found"}
              </p>
            </>
          ) : result.message ? (
            <p style={styles.error}>❌ Error: {result.message}</p>
          ) : (
            <p style={styles.error}>⚠️ Unexpected result format</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#666",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: "2rem",
    backgroundColor: "#fafafa",
  },
  resultCard: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    backgroundColor: "white",
  },
  resultTitle: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
    color: "#007bff",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default App;
