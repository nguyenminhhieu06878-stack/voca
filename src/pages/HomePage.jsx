import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Mic, 
  TrendingUp, 
  Target,
  Play,
  Star,
  Award,
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react'
import Footer from '../components/Footer'
import FeedbackSection from '../components/FeedbackSection'

const HomePage = () => {
  console.log('🏠 HomePage is rendering!')
  const { user } = useAuthStore()

  const features = [
    {
      icon: Mic,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes your pronunciation and provides instant feedback'
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'Adaptive learning system that adjusts to your skill level and progress'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Detailed analytics and progress reports to monitor your improvement'
    },
    {
      icon: BookOpen,
      title: 'Rich Vocabulary',
      description: 'Extensive vocabulary database across multiple categories and difficulty levels'
    }
  ]

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Learners' },
    { icon: BookOpen, value: '500+', label: 'Vocabulary Words' },
    { icon: Target, value: '95%', label: 'Accuracy Rate' },
    { icon: Award, value: '4.9/5', label: 'User Rating' }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'English Learner',
      content: 'This app helped me improve my pronunciation dramatically. The AI feedback is incredibly accurate!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Student',
      content: 'I love how it tracks my progress and gives personalized recommendations. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Professional',
      content: 'Perfect for busy professionals. Quick sessions with immediate feedback make learning efficient.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-neutral-50 py-20 overflow-hidden">
        {/* Background Banner */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/paner.png" 
            alt="PronunciationAI Banner" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white/90 to-neutral-50/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered English Pronunciation Learning
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
                Master English
                <span className="text-gradient">
                  {' '}Pronunciation
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Learn perfect English pronunciation with AI-powered feedback. 
                Practice speaking, get instant analysis, and track your progress in real-time.
              </p>

              {user ? (
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 lg:gap-4 justify-center lg:justify-start">
                  <Link to="/practice" className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <Mic className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 relative z-10" />
                    <span className="relative z-10 text-xs sm:text-sm lg:text-base">Continue Learning</span>
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/quiz" className="group bg-white text-primary-600 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 inline-flex items-center justify-center shadow-md hover:shadow-lg">
                    <Trophy className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                    <span className="text-xs sm:text-sm lg:text-base">Take Quiz</span>
                  </Link>
                </div>
              ) : (
                <div className="hidden sm:flex flex-col sm:flex-row gap-2.5 sm:gap-3 lg:gap-4 justify-center lg:justify-start">
                  <Link to="/register" className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <Play className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 relative z-10" />
                    <span className="relative z-10 text-xs sm:text-sm lg:text-base whitespace-nowrap">Start Learning Free</span>
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login" className="group bg-white text-primary-600 px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg sm:rounded-xl font-semibold border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 inline-flex items-center justify-center shadow-md hover:shadow-lg">
                    <span className="text-xs sm:text-sm lg:text-base">Sign In</span>
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all -ml-2 group-hover:ml-1.5 sm:group-hover:ml-2" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Banner Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <img 
                  src="/img/paner.png" 
                  alt="PronunciationAI Learning Platform" 
                  className="w-full h-auto rounded-2xl shadow-2xl shadow-primary-500/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions for Authenticated Users */}
      {user && (
        <section className="py-16 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Ready to Practice?
              </h2>
              <p className="text-xl text-neutral-600">
                Choose your learning mode and start improving your pronunciation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/practice" className="card hover:shadow-xl transition-all duration-300 group">
                <div className="p-8 text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Mic className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Practice Mode
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Practice individual words, phrases, and sentences at your own pace
                  </p>
                  <div className="text-primary-600 font-medium group-hover:text-primary-700">
                    Start Practicing →
                  </div>
                </div>
              </Link>

              <Link to="/quiz" className="card hover:shadow-xl transition-all duration-300 group">
                <div className="p-8 text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Quiz Mode
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Test your pronunciation skills with timed quizzes and get scored results
                  </p>
                  <div className="text-yellow-600 font-medium group-hover:text-yellow-700">
                    Take a Quiz →
                  </div>
                </div>
              </Link>

              <Link to="/review" className="card hover:shadow-xl transition-all duration-300 group">
                <div className="p-8 text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Review Mode
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Focus on words you got wrong and improve your weak areas
                  </p>
                  <div className="text-orange-600 font-medium group-hover:text-orange-700">
                    Review Mistakes →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-neutral-600">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Choose PronunciationAI?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our advanced AI technology provides personalized learning experiences 
              that adapt to your unique pronunciation challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 text-center">
                    <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600">
              Simple steps to improve your pronunciation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Choose a Word
              </h3>
              <p className="text-neutral-600">
                Select from our extensive vocabulary database across different categories and difficulty levels.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Practice Speaking
              </h3>
              <p className="text-neutral-600">
                Listen to the correct pronunciation, then record yourself speaking the word clearly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Get AI Feedback
              </h3>
              <p className="text-neutral-600">
                Receive instant, detailed feedback on your pronunciation with personalized improvement tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-neutral-600">
              Join thousands of satisfied learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Perfect Your Pronunciation?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have improved their English pronunciation with our AI-powered platform.
          </p>
          
          {user ? (
            <Link to="/practice" className="btn-secondary btn-lg inline-flex items-center bg-white text-primary-600 hover:bg-neutral-50">
              <Mic className="mr-2 h-5 w-5" />
              Start Practicing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link to="/register" className="btn-secondary btn-lg inline-flex items-center bg-white text-primary-600 hover:bg-neutral-50">
              <Play className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
      
      <div id="feedback">
        <FeedbackSection />
      </div>
      <Footer />
    </div>
  )
}

export default HomePage