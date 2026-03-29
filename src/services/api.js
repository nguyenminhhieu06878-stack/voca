import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds timeout for audio uploads
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - import dynamically to avoid circular dependency
      import('../stores/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout()
      })
    }
    
    return Promise.reject(error)
  }
)

export default api