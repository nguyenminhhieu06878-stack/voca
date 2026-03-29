import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        toast.error('Google authentication failed. Please try again.')
        navigate('/login')
        return
      }

      if (token) {
        try {
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Fetch user info
          const response = await api.get('/auth/me')
          
          // Update auth store
          useAuthStore.setState({ 
            user: response.data.user, 
            token: token,
            isLoading: false 
          })
          
          toast.success('Successfully signed in with Google!')
          navigate('/')
        } catch (err) {
          console.error('Failed to fetch user info:', err)
          toast.error('Authentication failed. Please try again.')
          navigate('/login')
        }
      } else {
        toast.error('Authentication failed. No token received.')
        navigate('/login')
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
