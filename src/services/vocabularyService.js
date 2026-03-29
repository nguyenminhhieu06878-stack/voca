import api from './api'

export const vocabularyService = {
  // Get all vocabulary with optional filters
  getVocabulary: async (params = {}) => {
    const response = await api.get('/vocabulary', { params })
    return response.data
  },

  // Get vocabulary by ID
  getVocabularyById: async (id) => {
    const response = await api.get(`/vocabulary/${id}`)
    return response.data
  },

  // Get vocabulary categories
  getCategories: async () => {
    const response = await api.get('/vocabulary/meta/categories')
    return response.data
  },

  // Get vocabulary statistics
  getStats: async () => {
    const response = await api.get('/vocabulary/meta/stats')
    return response.data
  },
}