import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Home, 
  Mic, 
  History, 
  User, 
  LogOut,
  ChevronDown,
  Settings,
  Trophy,
  RotateCcw
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
    setShowUserMenu(false)
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/practice', icon: Mic, label: 'Practice' },
    { path: '/quiz', icon: Trophy, label: 'Quiz' },
    { path: '/review', icon: RotateCcw, label: 'Review' },
    { path: '/history', icon: History, label: 'History' },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-1 rounded-xl group-hover:scale-105 transition-all duration-300 mt-2 -ml-2">
              <img 
                src="/img/logo.png" 
                alt="PronunciationAI Logo" 
                className="h-[200px] w-[200px] object-contain"
              />
            </div>
          </Link>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                             (item.path === '/practice' && location.pathname.startsWith('/practice')) ||
                             (item.path === '/quiz' && location.pathname.startsWith('/quiz')) ||
                             (item.path === '/review' && location.pathname.startsWith('/review'))
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-base transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md shadow-primary-500/25">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200/50 py-2 z-50 backdrop-blur-sm">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-md shadow-primary-500/25">
                        <span className="text-white font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{user?.name}</p>
                        <p className="text-sm text-neutral-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3 text-neutral-400" />
                      Profile Settings
                    </Link>
                    
                    <div className="border-t border-neutral-100 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-neutral-100">
          <div className="flex justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                             (item.path === '/practice' && location.pathname.startsWith('/practice')) ||
                             (item.path === '/quiz' && location.pathname.startsWith('/quiz')) ||
                             (item.path === '/review' && location.pathname.startsWith('/review'))
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar