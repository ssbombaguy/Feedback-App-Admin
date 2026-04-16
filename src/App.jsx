import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import CoursesList from './components/CoursesList'
import CourseFeedbacks from './components/CourseFeedbacks'
import Notifications from './components/Notifications' // 1. ADD THIS IMPORT
import Layout from './components/Layout'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin/notifications" element={
          <ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute><Layout><CoursesList /></Layout></ProtectedRoute>
        } />
        <Route path="/admin/courses/:courseName/feedbacks" element={
          <ProtectedRoute><Layout><CourseFeedbacks /></Layout></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  )
}