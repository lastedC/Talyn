import { useState } from "react";

function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON. Raw response:", text);
        data = { error: "Invalid JSON response", raw: text };
      }

      onResult(data);
    } catch (err) {
      console.error("Upload failed:", err);
      onResult({ error: "Upload failed: " + err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Your Resume</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="resume" style={styles.dropZone}>
          {file ? (
            <p style={styles.fileName}>{file.name}</p>
          ) : (
            <p style={styles.placeholder}>
              Drag & drop your file here or click to select
            </p>
          )}
          <input
            id="resume"
            type="file"
            accept=".pdf,.docx"
            style={styles.input}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          type="submit"
          disabled={!file || loading}
          style={{
            ...styles.button,
            ...(loading || !file ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "1.5rem",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dropZone: {
    position: "relative",
    border: "2px dashed #aaa",
    borderRadius: "10px",
    padding: "2rem",
    cursor: "pointer",
    transition: "border-color 0.2s",
    color: "#666",
  },
  input: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  placeholder: {
    fontSize: "0.9rem",
    color: "#777",
  },
  fileName: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#333",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },
};

export default UploadForm;
