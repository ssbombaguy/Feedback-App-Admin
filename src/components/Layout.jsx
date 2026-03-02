import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '⬛' },
  { path: '/admin/courses', label: 'Courses', icon: '◧' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  })()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◈</span>
          <span className={styles.logoText}>ADMIN</span>
        </div>

        <div className={styles.sidebarDivider} />

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.userDot} />
            <span className={styles.userName}>{user.name || user.email || 'Admin'}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            ← LOGOUT
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
