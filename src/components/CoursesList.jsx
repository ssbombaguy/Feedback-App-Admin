import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoursesList.module.css";
import { useAdminCourses } from "../hooks/useFeedbacks";

export default function CoursesList() {
  const { courses, isLoading, isError } = useAdminCourses();
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const filtered = courses.filter((c) =>
    c.courseName?.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <div className={styles.loadingState}>LOADING...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>COURSES</h1>
        <div className={styles.count}>
          <strong>{filtered.length}</strong> / {courses.length} TOTAL
        </div>
      </div>

      <div className={styles.filterRow}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="FILTER COURSES..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              <th className={styles.th}>COURSE NAME</th>
              <th className={styles.th}>TOTAL FEEDBACKS</th>
              <th className={styles.th} style={{ textAlign: "right" }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course, i) => (
              <tr key={i} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.rowNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={styles.courseName}>{course.courseName}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.pill}>{course.totalFeedbacks}</span>
                </td>
                <td className={styles.td} style={{ textAlign: "right" }}>
                  <button
                    className={styles.actionBtn}
                    onClick={() =>
                      navigate(
                        `/admin/courses/${encodeURIComponent(
                          course.courseName
                        )}/feedbacks`
                      )
                    }
                  >
                    VIEW FEEDBACKS →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
