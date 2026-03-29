import api from './api'

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile')
    return response.data
  },

  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/user/dashboard')
    return response.data
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData)
    return response.data
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/user/password', { currentPassword, newPassword })
    return response.data
  },
}