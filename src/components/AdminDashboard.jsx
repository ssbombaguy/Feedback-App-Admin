import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { getFeedbacks } from "../api/api";

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
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const adminEmail = localStorage.getItem("adminEmail");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFeedbacks();
        const feedbacks = response.data.data || response.data;

        const totalFeedbacks = feedbacks.length;

        const totalCourses = new Set(feedbacks.map((f) => f.courseName)).size;

        const coursesMap = {};
        feedbacks.forEach((fb) => {
          if (!coursesMap[fb.courseName]) {
            coursesMap[fb.courseName] = 0;
          }
          coursesMap[fb.courseName]++;
        });

        const courses = Object.keys(coursesMap).map((name) => ({
          courseName: name,
          totalFeedbacks: coursesMap[name],
        }));
        setDashboard({
          totalFeedbacks,
          totalCourses,
          courses,
        });
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingBar} />
          <span>LOADING DATA...</span>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      {dashboard && (
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
              value={dashboard.totalCourses}
              color="var(--accent)"
              delay="1"
            />
            <StatCard
              label="TOTAL FEEDBACKS"
              value={dashboard.totalFeedbacks}
              color="var(--accent2)"
              delay="2"
            />
          </div>

          <div className={`${styles.infoRow} fade-up`}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>COURSES WITH FEEDBACK</div>
              <div className={styles.infoList}>
                {dashboard.courses?.map((course, i) => (
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
