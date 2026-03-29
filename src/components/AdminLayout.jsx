import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Target,
  ArrowLeft,
  LogOut,
  ChevronDown,
  Trophy,
  BarChart3,
  Database
} from 'lucide-react'
import { useState } from 'react'

const AdminLayout = () => {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const adminNavItems = [
    { 
      path: '/admin', 
      icon: LayoutDashboard, 
      label: 'Overview', 
      exact: true 
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Users' 
    },
    { 
      path: '/admin/vocabulary', 
      icon: BookOpen, 
      label: 'Vocabulary' 
    },
    { 
      path: '/admin/practices', 
      icon: Target, 
      label: 'Practices' 
    },
    { 
      path: '/admin/quiz-sessions', 
      icon: Trophy, 
      label: 'Quiz Sessions' 
    },
    { 
      path: '/admin/analytics', 
      icon: BarChart3, 
      label: 'Analytics' 
    },
    { 
      path: '/admin/bulk-operations', 
      icon: Database, 
      label: 'Bulk Operations' 
    },
  ]

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link to="/" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
        </div>

        {/* Navigation */}
        <div className="sidebar-content">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-neutral-500 uppercase">
                Admin Panel
              </h2>
            </div>
            
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path) && location.pathname !== '/admin'
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link mx-3 ${isActive ? 'nav-link-active' : ''}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-neutral-100 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-neutral-900">{user?.name}</div>
                <div className="text-xs text-neutral-500">Administrator</div>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 z-20">
                  <div className="card p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success-500"></div>
              <span className="text-sm text-neutral-600">System operational</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-900">{user?.name}</div>
              <div className="text-xs text-neutral-500">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout