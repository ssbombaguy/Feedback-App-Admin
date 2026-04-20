import { usePupils } from "../hooks/usePupils";
import styles from "./StudentsList.module.css";

export default function StudentsList() {
  const { data: pupils, isLoading, isError } = usePupils();

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <span>LOADING PUPIL DATA...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.errorState}>
        <span>! FAILED TO FETCH REGISTERED STUDENTS</span>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>STUDENTS</h1>
          <div className={styles.count}>
            REGISTERED USERS: <strong>{pupils?.length || 0}</strong>
          </div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              <th className={styles.th}>STUDENT NAME</th>
              <th className={styles.th}>ACADEMIC YEAR</th>
              <th className={styles.th}>REGISTRATION DATE</th>
            </tr>
          </thead>
          <tbody>
            {pupils?.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className={styles.td}
                  style={{ textAlign: "center" }}
                >
                  NO REGISTERED STUDENTS FOUND
                </td>
              </tr>
            ) : (
              pupils.map((student, i) => (
                <tr key={student.id || i} className={styles.tr}>
                  <td className={styles.td}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className={styles.td}>
                    {student.pupil_name || "Anonymous Student"}
                  </td>
                  <td className={styles.td}>
                    {student.academic_year || "N/A"}
                  </td>
                  <td className={styles.td}>
                    {student.createdAt
                      ? new Date(student.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
