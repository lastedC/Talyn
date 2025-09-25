import UploadForm from "../components/UploadForm";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAnalyzing) {
      // Smooth progress animation
      const timer = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 2 : p));
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing || !uploadFile) return;

    const upload = async () => {
      const formData = new FormData();
      formData.append("resume", uploadFile);
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
          data = { error: "Invalid JSON response", raw: text };
        }
        setProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
          navigate("/results", { state: { result: data } });
        }, 500);
      } catch (err) {
        setIsAnalyzing(false);
        navigate("/results", { state: { result: { error: String(err) } } });
      }
    };

    upload();
  }, [isAnalyzing, uploadFile, API_URL, navigate]);

  const handleUpload = (file) => {
    setUploadFile(file);
    setIsAnalyzing(true);
    setProgress(0);
  };

  const handleCancel = () => {
    setIsAnalyzing(false);
    setProgress(0);
    setUploadFile(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📄 Resume Analyzer</h1>
          <p style={styles.subtitle}>
            Upload a <strong>PDF</strong> or <strong>DOCX</strong> resume to
            test the backend API.
          </p>
        </div>

        <div style={styles.card}>
          <UploadForm onNavigateToAnalyzing={handleUpload} />
        </div>
      </div>

      {isAnalyzing && (
        <div style={styles.loadingOverlay} onClick={handleCancel}>
          <div
            style={styles.loadingContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.loadingTitle}>Analyzing your resume...</h2>
            <div style={styles.progressContainer}>
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                  }}
                />
              </div>
              <span style={styles.progressText}>{Math.round(progress)}%</span>
            </div>
            <p style={styles.loadingSubtext}>Processing your resume data</p>
            <button style={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f6f8fc 0%, #ffffff 100%)",
    padding: "2rem 1rem",
  },
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    padding: "0 2rem",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    color: "#1f2937",
  },
  header: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.25rem",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#6b7280",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "1.25rem",
    boxShadow: "0 10px 25px rgba(2,6,23,0.06)",
    marginBottom: "1.5rem",
    backgroundColor: "#ffffff",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-in-out",
  },
  loadingContent: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "3rem 2.5rem",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    textAlign: "center",
    minWidth: "400px",
    animation: "slideUp 0.4s ease-out",
  },
  loadingTitle: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
    color: "#1f2937",
    fontWeight: 600,
  },
  progressContainer: {
    marginBottom: "1.5rem",
  },
  progressTrack: {
    width: "100%",
    height: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "0.75rem",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #1d4ed8, #60a5fa)",
    borderRadius: "10px",
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  },
  progressText: {
    fontSize: "0.9rem",
    color: "#6b7280",
    fontWeight: 600,
  },
  loadingSubtext: {
    fontSize: "0.9rem",
    color: "#9ca3af",
    margin: "0 0 1.5rem 0",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    transition: "background-color 0.2s ease",
  },
};

export default Home;
