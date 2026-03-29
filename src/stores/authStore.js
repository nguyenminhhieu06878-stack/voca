import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      // Initialize auth state
      initialize: async () => {
        const token = get().token
        if (token) {
          try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const response = await api.get('/auth/me')
            set({ user: response.data.user, isLoading: false })
          } catch (error) {
            console.error('Auth initialization failed:', error)
            // Clear invalid token
            get().logout()
          }
        } else {
          set({ isLoading: false })
        }
      },

      // Login
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { user, token } = response.data
          
          // Set auth header for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token })
          return { success: true }
        } catch (error) {
          console.error('Login failed:', error)
          return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
          }
        }
      },

      // Register
      register: async (name, email, password) => {
        try {
          const response = await api.post('/auth/register', { name, email, password })
          const { user, token } = response.data
          
          // Set auth header for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token })
          return { success: true }
        } catch (error) {
          console.error('Registration failed:', error)
          return { 
            success: false, 
            error: error.response?.data?.error || 'Registration failed' 
          }
        }
      },

      // Logout
      logout: () => {
        // Clear auth header
        delete api.defaults.headers.common['Authorization']
        
        set({ user: null, token: null, isLoading: false })
      },

      // Update user profile
      updateProfile: async (userData) => {
        try {
          const response = await api.put('/user/profile', userData)
          set({ user: response.data.user })
          return { success: true }
        } catch (error) {
          console.error('Profile update failed:', error)
          return { 
            success: false, 
            error: error.response?.data?.error || 'Profile update failed' 
          }
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        try {
          await api.put('/user/password', { currentPassword, newPassword })
          return { success: true }
        } catch (error) {
          console.error('Password change failed:', error)
          return { 
            success: false, 
            error: error.response?.data?.error || 'Password change failed' 
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
)

// Initialize auth on app start
useAuthStore.getState().initialize()