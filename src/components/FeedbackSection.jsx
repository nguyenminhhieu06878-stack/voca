import { useState } from 'react'
import { Star, Send, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const FeedbackSection = () => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (value) => {
    setRating(value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!feedback.name || !feedback.email || !feedback.message) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Thank you for your feedback! 🎉')
      
      // Reset form
      setRating(0)
      setFeedback({ name: '', email: '', message: '' })
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Send Feedback & <span className="text-primary-400">Reviews</span>
          </h2>
          <p className="text-xl text-neutral-300">
            Your feedback helps us improve our service every day
          </p>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Your Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingClick(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-neutral-500'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-neutral-300">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </span>
                )}
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={feedback.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={feedback.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Your Feedback
              </label>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Share your experience with PronunciationAI..."
                className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700">
            <div className="text-3xl font-bold text-primary-400 mb-2">4.9/5</div>
            <div className="text-neutral-300">Average Rating</div>
          </div>
          
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700">
            <div className="text-3xl font-bold text-primary-400 mb-2">1,200+</div>
            <div className="text-neutral-300">Happy Users</div>
          </div>
          
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700">
            <div className="text-3xl font-bold text-primary-400 mb-2">24/7</div>
            <div className="text-neutral-300">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeedbackSection