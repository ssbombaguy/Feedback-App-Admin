import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import CoursesList from './components/CoursesList'
import CourseFeedbacks from './components/CourseFeedbacks'
import Layout from './components/Layout'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />
  }

  try {
    const adminUser = JSON.parse(user)
    if (!adminUser.isAdmin) {
      return <Navigate to="/admin/login" replace />
    }
  } catch {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <Layout>
                <CoursesList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/:courseName/feedbacks"
          element={
            <ProtectedRoute>
              <Layout>
                <CourseFeedbacks />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  )
}
