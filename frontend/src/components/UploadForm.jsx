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

    const text = await res.text(); // read body once
    let data;

    try {
      data = JSON.parse(text); // try parsing as JSON
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
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit" disabled={!file || loading} style={{ marginLeft: "1rem" }}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}

export default UploadForm;
