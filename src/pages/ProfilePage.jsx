import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { 
  User, 
  Mail, 
  Calendar,
  Edit3,
  Lock,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  TrendingUp,
  Target,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuthStore()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile(profileForm)
      if (result.success) {
        toast.success('Profile updated successfully! ✅')
        setIsEditingProfile(false)
      } else {
        toast.error(result.error || 'Update failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      if (result.success) {
        toast.success('Password changed successfully! 🔐')
        setIsChangingPassword(false)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(result.error || 'Password change failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            👤 User Profile
          </h1>
          <p className="text-xl text-neutral-600">
            Manage your account information and track your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Basic Information
                  </h2>
                  
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setIsEditingProfile(true)
                        setProfileForm({
                          name: user.name,
                          email: user.email
                        })
                      }}
                      className="btn-secondary text-sm"
                    >
                      <Edit3 className="mr-1 h-4 w-4" />
                      Edit
                    </button>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-neutral-600">Full Name</p>
                        <p className="font-medium text-neutral-900">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-neutral-600">Email</p>
                        <p className="font-medium text-neutral-900">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-neutral-400" />
                      <div>
                        <p className="text-sm text-neutral-600">Member Since</p>
                        <p className="font-medium text-neutral-900">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="input"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="input"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        <Save className="mr-1 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="btn-secondary"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Change Password */}
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Security
                  </h2>
                  
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="btn-secondary text-sm"
                    >
                      <Lock className="mr-1 h-4 w-4" />
                      Change Password
                    </button>
                  )}
                </div>

                {!isChangingPassword ? (
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-600">Password</p>
                      <p className="font-medium text-neutral-900">••••••••</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="input pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="input pr-10"
                          placeholder="At least 6 characters"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="input pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        <Save className="mr-1 h-4 w-4" />
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordForm({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          })
                        }}
                        className="btn-secondary"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Learning Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Practice Sessions:</span>
                    <span className="font-semibold text-neutral-900">14</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Average Score:</span>
                    <span className="font-semibold text-neutral-900">71 points</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Current Streak:</span>
                    <span className="font-semibold text-neutral-900">6 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress by Category */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Progress by Topic
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">🐾 Animals</span>
                      <span className="text-neutral-600">80%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-xs text-neutral-500">
                      10 practice sessions • 83 points avg
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">🍎 Food</span>
                      <span className="text-neutral-600">25%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="text-xs text-neutral-500">
                      4 practice sessions • 39 points avg
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="card bg-primary-50 border-primary-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Account Info
                </h3>
                
                <div className="space-y-2 text-sm text-primary-700">
                  <p><strong>Account Type:</strong> Student</p>
                  <p><strong>Status:</strong> Active ✅</p>
                  <p><strong>Member Since:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage