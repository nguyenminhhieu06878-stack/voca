import api from './api'

export const quizService = {
  // Create a new quiz session
  createSession: async (sessionData) => {
    const response = await api.post('/quiz/sessions', sessionData)
    return response.data
  },

  // Update quiz session with final scores
  updateSession: async (sessionId, updateData) => {
    const response = await api.put(`/quiz/sessions/${sessionId}`, updateData)
    return response.data
  },

  // Get user's quiz sessions (for history)
  getSessions: async (params = {}) => {
    const response = await api.get('/quiz/sessions', { params })
    return response.data
  },

  // Get quiz session details with all practices
  getSessionDetails: async (sessionId) => {
    const response = await api.get(`/quiz/sessions/${sessionId}`)
    return response.data
  },

  // Get quiz results by category
  getResultsByCategory: async (practiceMode) => {
    const params = practiceMode ? { practiceMode } : {};
    const response = await api.get('/quiz/results-by-category', { params })
    return response.data
  },

  // Get quiz statistics
  getStats: async () => {
    const response = await api.get('/quiz/stats')
    return response.data
  }
}