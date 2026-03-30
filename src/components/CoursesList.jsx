import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './CoursesList.module.css'

export default function CoursesList() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/admin/courses',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setCourses(response.data.courses)
      } catch (err) {
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [token])

  const filtered = courses.filter(c =>
    c.courseName?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <div className={`${styles.pageHeader} fade-up`}>
        <div>
          <div className={styles.breadcrumb}>◈ / COURSES</div>
          <h1 className={styles.pageTitle}>COURSES</h1>
        </div>
        <div className={styles.count}>
          {!loading && <span><strong>{filtered.length}</strong> / {courses.length} TOTAL</span>}
        </div>
      </div>

      <div className={`${styles.filterRow} fade-up fade-up-delay-1`}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="FILTER COURSES..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filter && (
          <button className={styles.clearBtn} onClick={() => setFilter('')}>× CLEAR</button>
        )}
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.loadingBar} />
          <span>LOADING COURSES...</span>
        </div>
      )}

      {error && (
        <div className={styles.errorState}><span>!</span> {error}</div>
      )}

      {!loading && !error && (
        <div className={`${styles.tableWrap} fade-up fade-up-delay-2`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}><span className={styles.thLabel}>#</span></th>
                <th className={styles.th}><span className={styles.thLabel}>COURSE NAME</span></th>
                <th className={styles.th}><span className={styles.thLabel}>TOTAL FEEDBACKS</span></th>
                <th className={styles.th}><span className={styles.thLabel}>ACTION</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.emptyRow}>NO COURSES FOUND</td>
                </tr>
              ) : (
                filtered.map((course, i) => (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.courseName}>{course.courseName}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.pill}>{course.totalFeedbacks}</span>
                    </td>
                    <td className={styles.td}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/admin/courses/${encodeURIComponent(course.courseName)}/feedbacks`)}
                      >
                        VIEW FEEDBACKS →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}