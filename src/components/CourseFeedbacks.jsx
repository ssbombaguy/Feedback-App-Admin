import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CourseFeedbacks.module.css";
import { getFeedbacks } from "../api/api";

function FeedbackModal({ feedback, onClose }) {
  if (!feedback) return null;
  const fields = [
    { key: "courseEvaluation", label: "COURSE EVALUATION" },
    { key: "teacherEvaluation", label: "TEACHER EVALUATION" },
    { key: "practicalUse", label: "PRACTICAL USE" },
    { key: "studentRequests", label: "STUDENT REQUESTS" },
    { key: "idealSchool", label: "IDEAL SCHOOL" },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitle}>FEEDBACK DETAILS</div>
            <div className={styles.modalSub}>
              {feedback.isAnonymous ? (
                <span className={styles.anonTag}>ANONYMOUS</span>
              ) : (
                <span className={styles.modalEmail}>{feedback.userId}</span>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.returnBadge}>
            <span className={feedback.returnAsTeacher ? styles.yes : styles.no}>
              {feedback.returnAsTeacher
                ? "✓ Would return as teacher"
                : "✗ Would not return as teacher"}
            </span>
          </div>

          {fields.map(({ key, label }) =>
            feedback[key] ? (
              <div key={key} className={styles.fieldBlock}>
                <div className={styles.fieldLabel}>{label}</div>
                <div className={styles.fieldValue}>{feedback[key]}</div>
              </div>
            ) : null
          )}

          <div className={styles.submittedAt}>
            SUBMITTED · {new Date(feedback.submittedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseFeedbacks() {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = decodeURIComponent(courseName);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFeedbacks();

        const allFeedbacks = response.data.data || response.data;

        const filtered = allFeedbacks.filter((fb) => fb.courseName === decoded);

        setFeedbacks(filtered);

        setStats({
          totalFeedbacks: filtered.length,
          returnAsTeacherCount: filtered.filter((f) => f.returnAsTeacher)
            .length,
          anonymousCount: filtered.filter((f) => f.isAnonymous).length,
          returnAsTeacherPercentage: filtered.length
            ? Math.round(
                (filtered.filter((f) => f.returnAsTeacher).length /
                  filtered.length) *
                  100
              )
            : 0,
          anonymousPercentage: filtered.length
            ? Math.round(
                (filtered.filter((f) => f.isAnonymous).length /
                  filtered.length) *
                  100
              )
            : 0,
        });
      } catch (err) {
        setError("Failed to load feedbacks");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [courseName]);

  return (
    <div>
      <div className={`${styles.pageHeader} fade-up`}>
        <div>
          <div className={styles.breadcrumb}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/admin/courses")}
            >
              ← COURSES
            </button>
            <span className={styles.sep}>/</span>
            FEEDBACKS
          </div>
          <h1 className={styles.pageTitle}>{decoded}</h1>
        </div>
      </div>

      {stats && (
        <div className={`${styles.statsRow} fade-up fade-up-delay-1`}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>TOTAL FEEDBACKS</div>
            <div className={styles.statNum}>{stats.totalFeedbacks}</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>WOULD RETURN AS TEACHER</div>
            <div className={styles.statNum} style={{ color: "var(--green)" }}>
              {stats.returnAsTeacherCount}
              <span className={styles.statPct}>
                {" "}
                ({stats.returnAsTeacherPercentage}%)
              </span>
            </div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>ANONYMOUS SUBMISSIONS</div>
            <div className={styles.statNum}>
              {stats.anonymousCount}
              <span className={styles.statPct}>
                {" "}
                ({stats.anonymousPercentage}%)
              </span>
            </div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>SATISFACTION RATE</div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${stats.returnAsTeacherPercentage}%` }}
              />
            </div>
            <div className={styles.statPct}>
              {stats.returnAsTeacherPercentage}%
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingBar} />
          <span>LOADING FEEDBACKS...</span>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <span>!</span> {error}
        </div>
      )}

      {!loading && !error && (
        <div className={`${styles.tableWrap} fade-up fade-up-delay-2`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>
                  <span className={styles.thLabel}>#</span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thLabel}>STUDENT ID</span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thLabel}>EVALUATION PREVIEW</span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thLabel}>RETURN AS TEACHER</span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thLabel}>ANONYMOUS</span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thLabel}>ACTION</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>
                    NO FEEDBACKS FOUND
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb, i) => (
                  <tr key={fb._id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.rowNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.email}>
                        {fb.isAnonymous ? "—" : fb.userId}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.preview}>
                        {fb.courseEvaluation?.substring(0, 40)}
                        {fb.courseEvaluation?.length > 40 ? "..." : ""}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={
                          fb.returnAsTeacher ? styles.yesTag : styles.noTag
                        }
                      >
                        {fb.returnAsTeacher ? "✓ YES" : "✗ NO"}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={
                          fb.isAnonymous ? styles.yesTag : styles.noTag
                        }
                      >
                        {fb.isAnonymous ? "✓ YES" : "✗ NO"}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => setSelected(fb)}
                      >
                        DETAILS →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <FeedbackModal feedback={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
