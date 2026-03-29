import { Link } from 'react-router-dom'
import { Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer id="contact" className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 -mb-2">
              <div className="-ml-2 -mt-10">
                <img 
                  src="/img/logo.png" 
                  alt="PronunciationAI Logo" 
                  className="h-[120px] w-[120px] object-contain"
                />
              </div>
            </div>
            <p className="text-neutral-400 mb-6 max-w-md -mt-2">
              Master English pronunciation with AI-powered feedback. 
              Practice speaking, get instant analysis, and track your progress in real-time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-neutral-400 hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="#features" className="text-neutral-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-neutral-400">
              <p>&copy; 2024 PronunciationAI. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-6 pt-6 border-t border-neutral-800">
            <p className="text-sm text-neutral-500 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for English learners worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer