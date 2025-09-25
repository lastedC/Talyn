import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f6f8fc 0%, #ffffff 100%)",
    padding: "2rem 1rem",
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "0",
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
  resultCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "1.25rem",
    boxShadow: "0 10px 25px rgba(2,6,23,0.06)",
    backgroundColor: "#ffffff",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultTitle: {
    fontSize: "1.125rem",
    margin: 0,
    color: "#0ea5e9",
  },
  chipPrimary: {
    display: "inline-block",
    padding: "0.125rem 0.5rem",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    margin: "1rem 0",
  },
  sectionTitle: {
    fontSize: "1rem",
    margin: "0.75rem 0 0.25rem",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  subTitle: {
    fontSize: "0.95rem",
    margin: "0.5rem 0",
    color: "#374151",
  },
  badgeImportant: {
    display: "inline-block",
    padding: "0.125rem 0.5rem",
    backgroundColor: "#fef3c7",
    color: "#b45309",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  badgeHigh: {
    display: "inline-block",
    padding: "0.125rem 0.5rem",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  badgeMedium: {
    display: "inline-block",
    padding: "0.125rem 0.5rem",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  metricLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px dashed #e5e7eb",
    marginBottom: "0.5rem",
  },
  metricLabel: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  metricValue: {
    color: "#111827",
    fontWeight: 600,
  },
  metricRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  subsection: {
    margin: "0.5rem 0 0.75rem",
  },
  checkList: {
    display: "grid",
    gap: "0.5rem",
  },
  checkRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.5rem",
    alignItems: "start",
    padding: "0.5rem 0.5rem",
    border: "1px solid #f3f4f6",
    borderRadius: "10px",
    background: "#fafafa",
  },
  checkIconPassed: {
    color: "#16a34a",
    fontWeight: 700,
  },
  checkIconFailed: {
    color: "#dc2626",
    fontWeight: 700,
  },
  checkTextTitle: {
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.125rem",
  },
  checkTextDesc: {
    color: "#4b5563",
    fontSize: "0.9rem",
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "0.75rem",
    margin: "0.75rem 0 1rem",
  },
  placeholder: {
    padding: "0.75rem 0.75rem",
    background: "#f9fafb",
    border: "1px dashed #e5e7eb",
    color: "#6b7280",
    borderRadius: "10px",
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
  },
  badgeGood: {
    display: "inline-block",
    padding: "0.125rem 0.5rem",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  badgeBad: {
    display: "inline-block",
    padding: "0.125rem 0.5rem",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  helperTextGood: {
    marginTop: "-0.25rem",
    marginBottom: "0.5rem",
    color: "#065f46",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    padding: "0.5rem 0.75rem",
    borderRadius: "10px",
    fontSize: "0.9rem",
  },
  helperTextBad: {
    marginTop: "-0.25rem",
    marginBottom: "0.5rem",
    color: "#7f1d1d",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "0.5rem 0.75rem",
    borderRadius: "10px",
    fontSize: "0.9rem",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

function renderCheck(title, passed, successText, failText) {
  return (
    <div style={styles.checkRow}>
      <div style={passed ? styles.checkIconPassed : styles.checkIconFailed}>
        {passed ? "✔" : "✖"}
      </div>
      <div>
        <div style={styles.checkTextTitle}>{title}</div>
        <div style={styles.checkTextDesc}>
          {passed ? successText : failText}
        </div>
      </div>
    </div>
  );
}

function renderCheckSimple(title, passed, successText, failText) {
  return (
    <div style={styles.checkRow}>
      <div style={passed ? styles.checkIconPassed : styles.checkIconFailed}>
        {passed ? "✔" : "✖"}
      </div>
      <div>
        <div style={styles.checkTextTitle}>{title}</div>
        <div style={styles.checkTextDesc}>
          {passed ? successText : failText}
        </div>
      </div>
    </div>
  );
}

export default App;
