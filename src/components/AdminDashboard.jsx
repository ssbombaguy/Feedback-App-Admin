import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './AdminDashboard.module.css'

const StatCard = ({ label, value, color, delay }) => (
  <div className={`${styles.statCard} fade-up fade-up-delay-${delay}`} style={{ '--accent-color': color }}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value ?? '—'}</div>
    <div className={styles.statBar} />
  </div>
)

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          'http:192.168.100.2:3000/api/admin/dashboard',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setDashboard(response.data.dashboard)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [token])

  return (
    <div>
      <div className={`${styles.pageHeader} fade-up`}>
        <div>
          <div className={styles.breadcrumb}>◈ / DASHBOARD</div>
          <h1 className={styles.pageTitle}>OVERVIEW</h1>
        </div>
        <div className={styles.timestamp}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
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
            <span className={styles.welcomeName}>{dashboard.adminName}</span>
            <div className={styles.statusPill}>
              <div className={styles.statusDot} />
              ACTIVE SESSION
            </div>
          </div>

          <div className={styles.statsGrid}>
            <StatCard label="TOTAL COURSES" value={dashboard.totalCourses} color="var(--accent)" delay="1" />
            <StatCard label="TOTAL USERS" value={dashboard.totalUsers} color="#47b8ff" delay="2" />
            <StatCard label="FEEDBACKS" value={dashboard.totalFeedbacks} color="var(--accent2)" delay="3" />
            <StatCard label="ADMINS" value={dashboard.totalAdmins} color="var(--green)" delay="4" />
          </div>

          <div className={`${styles.infoRow} fade-up`}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>SYSTEM STATUS</div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>API</span>
                  <span className={`${styles.infoVal} ${styles.green}`}>CONNECTED</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoKey}>AUTH</span>
                  <span className={`${styles.infoVal} ${styles.green}`}>JWT ACTIVE</span>
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
  )
}
