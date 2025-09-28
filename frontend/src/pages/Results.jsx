import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  // Helper function to get rating bar color based on percentage
  const getRatingBarColor = (rating, maxRating) => {
    const percentage = (rating / maxRating) * 100;

    if (percentage === 0) {
      return "#ef4444"; // Red for 0%
    } else if (percentage <= 25) {
      return "#f97316"; // Orange-red for 1-25%
    } else if (percentage <= 50) {
      return "#eab308"; // Yellow for 26-50%
    } else if (percentage <= 75) {
      return "#22c55e"; // Light green for 51-75%
    } else {
      return "#10b981"; // Green for 76-100%
    }
  };

  // Calculate overall rating as percentage
  const calculateOverallRating = () => {
    if (!result?.analysis) return 0;
    const { searchability, hardSkills, softSkills, recruiterTips } =
      result.analysis;
    const totalPoints =
      searchability.rating +
      hardSkills.rating +
      softSkills.rating +
      recruiterTips.rating;
    const totalPossiblePoints =
      searchability.maxRating +
      hardSkills.maxRating +
      softSkills.maxRating +
      recruiterTips.maxRating;
    return Math.round((totalPoints / totalPossiblePoints) * 100);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Analysis Result</h1>
          <button style={styles.button} onClick={() => navigate("/")}>
            New Upload
          </button>
        </div>

        {!result ? (
          <p style={styles.error}>No result found. Please upload again.</p>
        ) : result.message ? (
          <p style={styles.error}>❌ Error: {result.message}</p>
        ) : result.error ? (
          <p style={styles.error}>❌ Error: {String(result.error)}</p>
        ) : result.analysis ? (
          <div style={styles.mainContent}>
            {/* Fixed Rating Panel */}
            <div style={styles.ratingPanel}>
              <div style={styles.overallRating}>
                <h3 style={styles.overallTitle}>Overall Rating</h3>
                <div style={styles.circularProgressContainer}>
                  <div style={styles.circularProgress}>
                    <svg style={styles.circularSvg} viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getRatingBarColor(calculateOverallRating())}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${
                          (calculateOverallRating() / 100) * 283
                        } 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div style={styles.circularText}>
                      <span style={styles.overallNumber}>
                        {calculateOverallRating()}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.categoryRatings}>
                <div style={styles.categoryRating}>
                  <span style={styles.categoryLabel}>Searchability</span>
                  <div style={styles.categoryBar}>
                    <div
                      style={{
                        ...styles.categoryBarFill,
                        width: `${
                          (result.analysis.searchability.rating /
                            result.analysis.searchability.maxRating) *
                          100
                        }%`,
                        backgroundColor: getRatingBarColor(
                          result.analysis.searchability.rating,
                          result.analysis.searchability.maxRating
                        ),
                      }}
                    />
                  </div>
                  <span style={styles.categoryScore}>
                    {result.analysis.searchability.rating}/
                    {result.analysis.searchability.maxRating}
                  </span>
                </div>

                <div style={styles.categoryRating}>
                  <span style={styles.categoryLabel}>Hard Skills</span>
                  <div style={styles.categoryBar}>
                    <div
                      style={{
                        ...styles.categoryBarFill,
                        width: `${
                          (result.analysis.hardSkills.rating /
                            result.analysis.hardSkills.maxRating) *
                          100
                        }%`,
                        backgroundColor: getRatingBarColor(
                          result.analysis.hardSkills.rating,
                          result.analysis.hardSkills.maxRating
                        ),
                      }}
                    />
                  </div>
                  <span style={styles.categoryScore}>
                    {result.analysis.hardSkills.rating}/
                    {result.analysis.hardSkills.maxRating}
                  </span>
                </div>

                <div style={styles.categoryRating}>
                  <span style={styles.categoryLabel}>Soft Skills</span>
                  <div style={styles.categoryBar}>
                    <div
                      style={{
                        ...styles.categoryBarFill,
                        width: `${
                          (result.analysis.softSkills.rating /
                            result.analysis.softSkills.maxRating) *
                          100
                        }%`,
                        backgroundColor: getRatingBarColor(
                          result.analysis.softSkills.rating,
                          result.analysis.softSkills.maxRating
                        ),
                      }}
                    />
                  </div>
                  <span style={styles.categoryScore}>
                    {result.analysis.softSkills.rating}/
                    {result.analysis.softSkills.maxRating}
                  </span>
                </div>

                <div style={styles.categoryRating}>
                  <span style={styles.categoryLabel}>Recruiter Tips</span>
                  <div style={styles.categoryBar}>
                    <div
                      style={{
                        ...styles.categoryBarFill,
                        width: `${
                          (result.analysis.recruiterTips.rating /
                            result.analysis.recruiterTips.maxRating) *
                          100
                        }%`,
                        backgroundColor: getRatingBarColor(
                          result.analysis.recruiterTips.rating
                        ),
                      }}
                    />
                  </div>
                  <span style={styles.categoryScore}>
                    {result.analysis.recruiterTips.rating}/
                    {result.analysis.recruiterTips.maxRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div style={styles.resultCard}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Searchability{" "}
                  <span style={styles.badgeImportant}>Important</span>
                </h3>
              </div>

              <div style={styles.section}>
                <h4 style={styles.subTitle}>Contact Information</h4>
                <div style={styles.checkList}>
                  {renderCheck(
                    "Address",
                    !!result.analysis.searchability.contactInformation.location,
                    "You provided your address.",
                    "We did not find an address."
                  )}
                  {renderCheck(
                    "Email",
                    !!result.analysis.searchability.contactInformation.email,
                    "You provided your email.",
                    "We couldn't find an email."
                  )}
                  {renderCheck(
                    "Phone number",
                    !!result.analysis.searchability.contactInformation
                      .phoneNumber,
                    "You provided your phone number.",
                    "We were unable to find a phone number."
                  )}
                </div>
              </div>

              <div style={styles.section}>
                <h4 style={styles.subTitle}>Section Headings</h4>
                <div style={styles.checkList}>
                  {renderCheck(
                    "Education section",
                    !!result.analysis.searchability.sections.hasSection
                      .education,
                    "Education section found.",
                    'Add an "Education" section for ATS.'
                  )}
                  {renderCheck(
                    "Experience section",
                    !!result.analysis.searchability.sections.hasSection
                      .experience,
                    "Experience section found.",
                    'Use "Work History" or "Professional Experience".'
                  )}
                  {renderCheck(
                    "Experience entries",
                    !!result.analysis.searchability.sections.experience,
                    "Experience entries found.",
                    "Add at least one role or project."
                  )}
                </div>
              </div>

              <div style={styles.checkGrid}>
                {renderCheckSimple(
                  "Date formatting",
                  !!result.analysis.searchability.dateFormatting,
                  "Dates are properly formatted.",
                  "Dates are not formatted correctly."
                )}
                {renderCheckSimple(
                  "Education match",
                  !!result.analysis.searchability.educationMatch,
                  "Education matches job description.",
                  "Education does not match job description."
                )}
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Hard Skills <span style={styles.badgeHigh}>High Impact</span>
                </h3>
                {result.analysis.hardSkills.skills &&
                result.analysis.hardSkills.skills.length > 0 ? (
                  <div style={styles.skillsContainer}>
                    {result.analysis.hardSkills.skills
                      .flatMap((skill) =>
                        typeof skill === "string"
                          ? skill
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0)
                          : [skill]
                      )
                      .map((skill, index) => (
                        <span key={index} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                  </div>
                ) : (
                  <div style={styles.placeholder}>
                    No hard skills detected in your resume.
                  </div>
                )}
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Soft Skills{" "}
                  <span style={styles.badgeMedium}>Medium Impact</span>
                </h3>
                {result.analysis.softSkills.skills &&
                result.analysis.softSkills.skills.length > 0 ? (
                  <div style={styles.skillsContainer}>
                    {result.analysis.softSkills.skills
                      .flatMap((skill) =>
                        typeof skill === "string"
                          ? skill
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0)
                          : [skill]
                      )
                      .map((skill, index) => (
                        <span key={index} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                  </div>
                ) : (
                  <div style={styles.placeholder}>
                    No soft skills detected in your resume.
                  </div>
                )}
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  Recruiter Tips{" "}
                  <span style={styles.badgeImportant}>Important</span>
                </h3>
                <div style={styles.metricLine}>
                  <span style={styles.metricLabel}>Word Count</span>
                  <span style={styles.metricRight}>
                    <span style={styles.metricValue}>
                      {result.analysis.recruiterTips.wordCount.count} words
                    </span>
                    <span
                      style={
                        result.analysis.recruiterTips.wordCount.result
                          ? styles.badgeGood
                          : styles.badgeBad
                      }
                    >
                      {result.analysis.recruiterTips.wordCount.result
                        ? "Good (under 1000)"
                        : "Too long (over 1000)"}
                    </span>
                  </span>
                </div>
                <div style={styles.metricLine}>
                  <span style={styles.metricLabel}>Web Presence</span>
                  <span style={styles.metricRight}>
                    <span
                      style={
                        result.analysis.recruiterTips.website
                          ? styles.badgeGood
                          : styles.badgeBad
                      }
                    >
                      {result.analysis.recruiterTips.website
                        ? "Website found"
                        : "No website found"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p style={styles.error}>⚠️ Unexpected result format</p>
        )}
      </div>
    </div>
  );
}

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
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.5rem",
    margin: 0,
  },
  button: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "#111827",
    color: "#fff",
    border: "1px solid #111827",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  resultCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "1.5rem",
    boxShadow: "0 10px 25px rgba(2,6,23,0.06)",
    backgroundColor: "#ffffff",
    flex: 1,
    minWidth: 0,
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    margin: "1rem 0 0.5rem",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  subTitle: {
    fontSize: "1.1rem",
    margin: "0.75rem 0",
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
    padding: "0.75rem 0",
    borderBottom: "1px dashed #e5e7eb",
    marginBottom: "0.75rem",
  },
  metricLabel: {
    color: "#6b7280",
    fontSize: "1rem",
  },
  metricValue: {
    color: "#111827",
    fontWeight: 600,
    fontSize: "1rem",
  },
  metricRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  ratingWrap: {
    position: "relative",
    flex: 1,
    height: 12,
    background: "#f3f4f6",
    borderRadius: 9999,
    overflow: "hidden",
    marginLeft: 12,
  },
  ratingBar: {
    height: "100%",
    background: "linear-gradient(90deg, #34d399, #10b981)",
  },
  ratingText: {
    position: "absolute",
    right: 8,
    top: -22,
    fontSize: 12,
    color: "#374151",
  },
  checkList: {
    display: "grid",
    gap: "0.75rem",
  },
  checkRow: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.75rem",
    alignItems: "start",
    padding: "0.75rem",
    border: "1px solid #f3f4f6",
    borderRadius: "10px",
    background: "#fafafa",
  },
  checkIconPassed: {
    color: "#16a34a",
    fontWeight: 700,
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "1.5rem",
    minHeight: "1.5rem",
  },
  checkIconFailed: {
    color: "#dc2626",
    fontWeight: 700,
    fontSize: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "1.5rem",
    minHeight: "1.5rem",
  },
  checkTextTitle: {
    fontWeight: 600,
    color: "#111827",
    marginBottom: "0.25rem",
    fontSize: "1rem",
  },
  checkTextDesc: {
    color: "#4b5563",
    fontSize: "0.95rem",
    lineHeight: "1.4",
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
    margin: "1rem 0 1.5rem",
  },
  placeholder: {
    padding: "1rem",
    background: "#f9fafb",
    border: "1px dashed #e5e7eb",
    color: "#6b7280",
    borderRadius: "10px",
    marginBottom: "1rem",
    fontSize: "1rem",
    lineHeight: "1.4",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  skillTag: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
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
  error: {
    color: "red",
    fontWeight: "bold",
  },
  mainContent: {
    display: "flex",
    gap: "2rem",
    alignItems: "flex-start",
  },
  ratingPanel: {
    position: "sticky",
    top: "2rem",
    width: "280px",
    flexShrink: 0,
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "1.25rem",
    boxShadow: "0 10px 25px rgba(2,6,23,0.06)",
    backgroundColor: "#ffffff",
  },
  overallRating: {
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  overallTitle: {
    fontSize: "1.1rem",
    margin: "0 0 0.75rem 0",
    color: "#111827",
    fontWeight: 600,
  },
  overallScore: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "0.25rem",
    marginBottom: "0.75rem",
  },
  overallNumber: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#111827",
  },
  overallMax: {
    fontSize: "1.2rem",
    color: "#6b7280",
    fontWeight: 500,
  },
  overallBar: {
    height: 16,
    background: "#f3f4f6",
    borderRadius: 9999,
    overflow: "hidden",
  },
  overallBarFill: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  circularProgressContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "1rem 0",
  },
  circularProgress: {
    position: "relative",
    width: "140px",
    height: "140px",
  },
  circularSvg: {
    width: "100%",
    height: "100%",
    transform: "rotate(-90deg)",
  },
  circularText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  categoryRatings: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  categoryRating: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  categoryLabel: {
    fontSize: "0.9rem",
    color: "#374151",
    fontWeight: 500,
  },
  categoryBar: {
    height: 8,
    background: "#f3f4f6",
    borderRadius: 9999,
    overflow: "hidden",
  },
  categoryBarFill: {
    height: "100%",
    transition: "width 0.3s ease",
  },
  categoryScore: {
    fontSize: "0.8rem",
    color: "#6b7280",
    fontWeight: 500,
    textAlign: "right",
  },
};

export default Results;
