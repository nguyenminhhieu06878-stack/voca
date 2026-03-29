import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import PublicNavbar from './components/PublicNavbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallback from './pages/AuthCallback'
import HomePage from './pages/HomePage'
import PracticePage from './pages/PracticePage'
import QuizPage from './pages/QuizPage'
import ReviewPage from './pages/ReviewPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminVocabulary from './pages/admin/AdminVocabulary'
import AdminPractices from './pages/admin/AdminPractices'
import AdminQuizSessions from './pages/admin/AdminQuizSessions'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminBulkOperations from './pages/admin/AdminBulkOperations'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingSpinner />
  }

  // If no user, show public routes with landing page
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={
          <div>
            <PublicNavbar />
            <HomePage />
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // If user is admin, show admin routes
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="vocabulary" element={<AdminVocabulary />} />
          <Route path="practices" element={<AdminPractices />} />
          <Route path="quiz-sessions" element={<AdminQuizSessions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="bulk-operations" element={<AdminBulkOperations />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  // Regular user routes
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="practice/:vocabularyId" element={<PracticePage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App