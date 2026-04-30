import styles from "./modals.module.css";

const FIELDS = [
  { key: "course_evaluation_form", label: "COURSE EVALUATION" },
  { key: "teacher_evaluation_form", label: "TEACHER EVALUATION" },
  { key: "career_impact", label: "PRACTICAL USE" },
  { key: "subject_wishes", label: "STUDENT REQUESTS" },
  { key: "ideal_learning_environment", label: "IDEAL SCHOOL" },
];

export default function FeedbackModal({ feedback, onClose }) {
  if (!feedback) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitle}>FEEDBACK DETAILS</div>
            <div className={styles.modalSub}>
              {feedback.is_anonymous ? (
                <span className={styles.anonTag}>ANONYMOUS</span>
              ) : (
                <span className={styles.modalEmail}>{feedback.pupil_name}</span>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.returnBadge}>
            <span
              className={
                feedback.wants_to_return_as_teacher ? styles.yes : styles.no
              }
            >
              {feedback.wants_to_return_as_teacher
                ? "✓ Would return as teacher"
                : "✗ Would not return as teacher"}
            </span>
          </div>

          {FIELDS.map(({ key, label }) =>
            feedback[key] ? (
              <div key={key} className={styles.fieldBlock}>
                <div className={styles.fieldLabel}>{label}</div>
                <div className={styles.fieldValue}>{feedback[key]}</div>
              </div>
            ) : null
          )}

          <div className={styles.submittedAt}>
            SUBMITTED · {new Date(feedback.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
