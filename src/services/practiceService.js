import api from './api'

export const practiceService = {
  // Analyze pronunciation
  analyzePronunciation: async (vocabularyId, audioBlob, mode = 'practice', quizSessionId = null) => {
    const formData = new FormData()
    formData.append('vocabularyId', vocabularyId)
    formData.append('audio', audioBlob, 'recording.webm')
    formData.append('mode', mode)
    if (quizSessionId) {
      formData.append('quizSessionId', quizSessionId)
    }

    const response = await api.post('/practice/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get practice history (filtered by mode)
  getHistory: async (params = {}) => {
    const response = await api.get('/practice/history', { params })
    return response.data
  },

  // Get practice statistics
  getStats: async () => {
    const response = await api.get('/practice/stats')
    return response.data
  },

  // Get practice by ID
  getPracticeById: async (id) => {
    const response = await api.get(`/practice/${id}`)
    return response.data
  },

  // Get quiz history
  getQuizHistory: async (params = {}) => {
    const response = await api.get('/practice/history', { 
      params: { ...params, mode: 'quiz' }
    })
    return response.data
  },

  // Get review history
  getReviewHistory: async (params = {}) => {
    const response = await api.get('/practice/history', { 
      params: { ...params, mode: 'review' }
    })
    return response.data
  },

  // Get quiz statistics
  getQuizStats: async () => {
    const response = await api.get('/practice/stats', {
      params: { mode: 'quiz' }
    })
    return response.data
  },

  // Get review statistics
  getReviewStats: async () => {
    const response = await api.get('/review/stats')
    return response.data
  },

  // Get latest scores for vocabulary words (for practice page display)
  getLatestScores: async (vocabularyIds) => {
    const response = await api.post('/practice/latest-scores', { vocabularyIds })
    return response.data
  },
}