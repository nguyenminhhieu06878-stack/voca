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
  RotateCcw,
  Menu,
  X,
  LogIn,
  UserPlus
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 group">
            <div className="p-0.5 rounded-lg group-hover:scale-105 transition-all duration-300 -ml-1">
              <img 
                src="/img/logo.png" 
                alt="PronunciationAI Logo" 
                className="h-[100px] sm:h-[120px] lg:h-[140px] w-[100px] sm:w-[120px] lg:w-[140px] object-contain"
              />
            </div>
          </Link>

          {/* Hamburger Menu Button - Mobile Only (for non-authenticated users) */}
          {!user && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-neutral-600" />
              ) : (
                <Menu className="h-5 w-5 text-neutral-600" />
              )}
            </button>
          )}

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
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
                  className={`relative flex items-center space-x-1 px-2 py-1.5 rounded-lg font-medium text-xs lg:text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1.5 px-1.5 py-1 rounded-lg hover:bg-neutral-50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md shadow-primary-500/25">
                    <span className="text-white text-[10px] sm:text-xs lg:text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-neutral-900 leading-tight">{user?.name}</p>
                    <p className="text-[8px] sm:text-[10px] lg:text-xs text-neutral-500 leading-tight">{user?.email}</p>
                  </div>
                </div>
                <ChevronDown className={`h-3 w-3 lg:h-4 lg:w-4 text-neutral-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
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
          )}
        </div>

        {/* Mobile Menu Dropdown - For Non-Authenticated Users */}
        {!user && showMobileMenu && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/20 md:hidden" 
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="absolute top-full left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-50 md:hidden">
              <div className="px-3 py-4 space-y-2">
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center space-x-2 w-full bg-white text-primary-600 px-4 py-3 rounded-lg font-semibold border-2 border-primary-200 hover:bg-primary-50 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Mobile Navigation - For Authenticated Users */}
        {user && (
          <div className="md:hidden border-t border-neutral-100">
            <div className="flex justify-around py-1.5">
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
                    className={`flex flex-col items-center justify-center space-y-0.5 px-1.5 py-1 rounded-lg transition-all duration-200 min-w-[50px] ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-medium leading-tight">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar