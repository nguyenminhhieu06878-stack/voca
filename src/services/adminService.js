import api from './api'

export const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  // Users Management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  getUserDetails: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  // Vocabulary Management
  getVocabulary: async (params = {}) => {
    const response = await api.get('/admin/vocabulary', { params })
    return response.data
  },

  addVocabulary: async (vocabularyData) => {
    const response = await api.post('/admin/vocabulary', vocabularyData)
    return response.data
  },

  updateVocabulary: async (id, vocabularyData) => {
    const response = await api.put(`/admin/vocabulary/${id}`, vocabularyData)
    return response.data
  },

  deleteVocabulary: async (id) => {
    const response = await api.delete(`/admin/vocabulary/${id}`)
    return response.data
  },

  // Practices Management
  getPractices: async (params = {}) => {
    const response = await api.get('/admin/practices', { params })
    return response.data
  },

  deletePractice: async (id) => {
    const response = await api.delete(`/admin/practices/${id}`)
    return response.data
  },

  // Quiz Sessions Management
  getQuizSessions: async (params = {}) => {
    const response = await api.get('/admin/quiz-sessions', { params })
    return response.data
  },

  deleteQuizSession: async (id) => {
    const response = await api.delete(`/admin/quiz-sessions/${id}`)
    return response.data
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },

  // Bulk Operations
  bulkImportVocabulary: async (vocabularyData) => {
    const response = await api.post('/admin/vocabulary/bulk-import', { vocabulary: vocabularyData })
    return response.data
  },

  exportVocabulary: async () => {
    const response = await api.get('/admin/export/vocabulary')
    return response.data
  },

  exportUsers: async () => {
    const response = await api.get('/admin/export/users')
    return response.data
  },

  exportPractices: async () => {
    const response = await api.get('/admin/export/practices')
    return response.data
  },
}