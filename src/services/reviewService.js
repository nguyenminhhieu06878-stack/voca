import api from './api'

export const reviewService = {
  // Get review items (words that need review)
  getReviewItems: async (params = {}) => {
    const response = await api.get('/review/items', { params })
    return response.data
  },

  // Get review statistics
  getStats: async () => {
    const response = await api.get('/review/stats')
    return response.data
  },

  // Update review item from practice result
  updateFromPractice: async (vocabularyId, score, mode) => {
    const response = await api.post('/review/update-from-practice', {
      vocabularyId,
      score,
      mode
    })
    return response.data
  },

  // Handle review practice
  practiceReview: async (vocabularyId, score) => {
    const response = await api.post('/review/practice-review', {
      vocabularyId,
      score
    })
    return response.data
  }
}