import styles from "./AdminDashboard.module.css";
import { useAdminCourses, useFeedbacks } from "../hooks/useFeedbacks";

const StatCard = ({ label, value, color, delay }) => (
  <div
    className={`${styles.statCard} fade-up fade-up-delay-${delay}`}
    style={{ "--accent-color": color }}
  >
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value ?? "—"}</div>
    <div className={styles.statBar} />
  </div>
);

export default function AdminDashboard() {
  const { courses, isLoading, isError, error } = useAdminCourses();
  const { data: feedbacks } = useFeedbacks();
  const adminEmail = localStorage.getItem("adminEmail");

  return (
    <div>
      <div className={`${styles.pageHeader} fade-up`}>
        <div>
          <div className={styles.breadcrumb}>◈ / DASHBOARD</div>
          <h1 className={styles.pageTitle}>OVERVIEW</h1>
        </div>
        <div className={styles.timestamp}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingBar} />
          <span>LOADING DATA...</span>
        </div>
      )}

      {isError && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>!</span>
          {error?.message || "Failed to load dashboard data"}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className={styles.welcomeBanner}>
            <span className={styles.welcomeLabel}>LOGGED IN AS</span>
            <span className={styles.welcomeName}>{adminEmail}</span>
            <div className={styles.statusPill}>
              <div className={styles.statusDot} />
              ACTIVE SESSION
            </div>
          </div>

          <div className={styles.statsGrid}>
            <StatCard
              label="TOTAL COURSES"
              value={courses.length}
              color="var(--accent)"
              delay="1"
            />
            <StatCard
              label="TOTAL FEEDBACKS"
              value={feedbacks?.length}
              color="var(--accent2)"
              delay="2"
            />
          </div>

          <div className={`${styles.infoRow} fade-up`}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>COURSES WITH FEEDBACK</div>
              <div className={styles.infoList}>
                {courses.map((course, i) => (
                  <div key={i} className={styles.infoItem}>
                    <span className={styles.infoKey}>{course.courseName}</span>
                    <span className={styles.infoVal}>
                      {course.totalFeedbacks} feedbacks
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>SYSTEM STATUS</div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>API</span>
                  <span className={`${styles.infoVal} ${styles.green}`}>
                    CONNECTED
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>AUTH</span>
                  <span className={`${styles.infoVal} ${styles.green}`}>
                    JWT ACTIVE
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>ROLE</span>
                  <span className={styles.infoVal}>ADMINISTRATOR</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
