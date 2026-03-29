import { Link, useLocation } from 'react-router-dom'
import { LogIn, UserPlus, Menu, X } from 'lucide-react'
import { useState } from 'react'

const PublicNavbar = () => {
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

          {/* Hamburger Menu Button - Mobile Only */}
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-14">
            <a
              href="#features"
              className="text-neutral-600 hover:text-neutral-900 font-medium text-base transition-colors"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-neutral-600 hover:text-neutral-900 font-medium text-base transition-colors"
            >
              Stats
            </a>
            <a
              href="#testimonials"
              className="text-neutral-600 hover:text-neutral-900 font-medium text-base transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#feedback"
              className="text-neutral-600 hover:text-neutral-900 font-medium text-base transition-colors"
            >
              Feedback
            </a>
            <a
              href="#contact"
              className="text-neutral-600 hover:text-neutral-900 font-medium text-base transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Auth Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg font-medium text-xs lg:text-sm transition-all duration-200 ${
                location.pathname === '/login'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <LogIn className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span>Sign In</span>
            </Link>
            
            <Link
              to="/register"
              className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-lg font-medium text-xs lg:text-sm transition-all duration-200 ${
                location.pathname === '/register'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
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
                
                {/* Mobile Navigation Links */}
                <div className="pt-2 border-t border-neutral-200 space-y-1">
                  <a
                    href="#features"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#stats"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Stats
                  </a>
                  <a
                    href="#testimonials"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Testimonials
                  </a>
                  <a
                    href="#feedback"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Feedback
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default PublicNavbar