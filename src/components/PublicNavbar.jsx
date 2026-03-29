import { Link, useLocation } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'

const PublicNavbar = () => {
  const location = useLocation()

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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-14">
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                location.pathname === '/login'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
            
            <Link
              to="/register"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                location.pathname === '/register'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-neutral-100">
          <div className="flex justify-around py-3">
            <a
              href="#features"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <span className="text-xs font-medium">Features</span>
            </a>
            <a
              href="#stats"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <span className="text-xs font-medium">Stats</span>
            </a>
            <a
              href="#testimonials"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <span className="text-xs font-medium">Reviews</span>
            </a>
            <a
              href="#feedback"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <span className="text-xs font-medium">Feedback</span>
            </a>
            <a
              href="#contact"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <span className="text-xs font-medium">Contact</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar