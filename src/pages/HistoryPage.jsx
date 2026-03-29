import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { practiceService } from '../services/practiceService'
import { quizService } from '../services/quizService'
import { reviewService } from '../services/reviewService'
import { 
  History, 
  TrendingUp, 
  Calendar,
  Filter,
  Star,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  BookOpen,
  Brain,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle2,
  X,
  ArrowLeft
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const HistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeTab, setActiveTab] = useState('practice') // practice, quiz, review
  const [selectedQuizSession, setSelectedQuizSession] = useState(null)
  
  // Fetch data based on active tab
  const { data: historyData, isLoading: historyLoading, error: historyError } = useQuery({
    queryKey: ['history', activeTab, { page: currentPage, category: selectedCategory }],
    queryFn: () => {
      const params = { 
        page: currentPage, 
        limit: 5,
        category: selectedCategory || undefined 
      }
      
      switch (activeTab) {
        case 'quiz':
          return quizService.getSessions(params)
        case 'review':
          return practiceService.getReviewHistory(params)
        default:
          return practiceService.getHistory({ ...params, mode: 'practice' })
      }
    },
    retry: false, // Don't retry on auth errors
    enabled: true // Always try to fetch
  })

  // Fetch statistics based on active tab
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats', activeTab],
    queryFn: () => {
      switch (activeTab) {
        case 'quiz':
          return quizService.getStats()
        case 'review':
          return reviewService.getStats()
        default:
          return practiceService.getStats()
      }
    },
    retry: false, // Don't retry on auth errors
    enabled: true // Always try to fetch
  })

  // Fetch quiz session details when selected
  const { data: quizSessionData, isLoading: quizSessionLoading } = useQuery({
    queryKey: ['quiz-session', selectedQuizSession],
    queryFn: () => quizService.getSessionDetails(selectedQuizSession),
    enabled: !!selectedQuizSession,
  })

  // Reset page when changing tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSelectedCategory('')
    setSelectedQuizSession(null)
  }

  const handleQuizSessionClick = (sessionId) => {
    setSelectedQuizSession(sessionId)
  }

  const handleBackToQuizList = () => {
    setSelectedQuizSession(null)
  }

  if (historyLoading || statsLoading) {
    return <LoadingSpinner text="Đang tải lịch sử..." />
  }

  // Show quiz session details if selected
  if (selectedQuizSession && activeTab === 'quiz') {
    if (quizSessionLoading) {
      return <LoadingSpinner text="Đang tải chi tiết bài kiểm tra..." />
    }

    const session = quizSessionData?.session
    if (!session) {
      return <div>Không tìm thấy bài kiểm tra</div>
    }

    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={handleBackToQuizList}
            className="btn-secondary mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </button>
          <h1 className="text-3xl font-bold text-gradient mb-4">
            Chi tiết bài kiểm tra
          </h1>
          <p className="text-neutral-600">
            {session.title}
          </p>
        </div>

        {/* Quiz Session Summary */}
        <div className="card">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {session.totalScore}/{session.maxScore}
                </div>
                <div className="text-sm text-neutral-600">Tổng điểm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {session.practices?.length || 0}
                </div>
                <div className="text-sm text-neutral-600">Số câu hỏi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {Math.round((session.totalScore / session.maxScore) * 100) || 0}%
                </div>
                <div className="text-sm text-neutral-600">Tỷ lệ đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {session.category}
                </div>
                <div className="text-sm text-neutral-600">Chủ đề</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Questions */}
        <div className="card">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Chi tiết từng câu hỏi
            </h2>
            
            <div className="space-y-6">
              {session.practices?.map((practice, index) => (
                <div key={practice.id} className="border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {practice.vocabulary.word}
                        </h3>
                        <p className="text-neutral-600">
                          {practice.vocabulary.translation}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      practice.isCorrect 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {practice.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>{practice.score}/100</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-sm text-neutral-600 mb-1">Bạn đã nói:</p>
                      <p className="font-medium text-neutral-900">"{practice.transcription}"</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 mb-1">Feedback AI:</p>
                      <p className="text-neutral-900 text-sm">{practice.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const practices = activeTab === 'quiz' ? historyData?.sessions || [] : historyData?.practices || []
  const pagination = historyData?.pagination || {}
  const stats = statsData || {}

  // Handle empty or invalid data
  if (!practices || !Array.isArray(practices)) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient mb-4">
            Lịch sử học tập
          </h1>
          <p className="text-neutral-600">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success-600 bg-success-50 border-success-200'
    if (score >= 70) return 'text-primary-600 bg-primary-50 border-primary-200'
    if (score >= 50) return 'text-warning-600 bg-warning-50 border-warning-200'
    return 'text-error-600 bg-error-50 border-error-200'
  }

  const categories = activeTab === 'quiz' 
    ? [...new Set(practices.map(s => s.category).filter(Boolean))]
    : [...new Set(practices.map(p => p.vocabulary?.category).filter(Boolean))]

  const tabConfig = {
    practice: {
      label: 'Luyện tập',
      icon: BookOpen,
      color: 'primary',
      description: 'Lịch sử luyện phát âm'
    },
    quiz: {
      label: 'Kiểm tra',
      icon: Brain,
      color: 'success',
      description: 'Lịch sử làm bài kiểm tra'
    },
    review: {
      label: 'Ôn tập',
      icon: RefreshCw,
      color: 'warning',
      description: 'Lịch sử ôn tập từ vựng'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-4">
          Lịch sử học tập
        </h1>
        <p className="text-neutral-600">
          Theo dõi tiến độ và xem lại các hoạt động học tập của bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl p-2 shadow-inner">
            {Object.entries(tabConfig).map(([key, config]) => {
              const Icon = config.icon
              const isActive = activeTab === key
              
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                    isActive
                      ? `bg-white text-${config.color}-600 shadow-lg scale-105 border-2 border-${config.color}-200`
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50 hover:scale-102'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="font-bold">{config.label}</span>
                  {isActive && (
                    <div className={`w-2 h-2 bg-${config.color}-500 rounded-full animate-ping`}></div>
                  )}
                </button>
              )
            })}
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-blue-800">
                {tabConfig[activeTab].description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="p-6 text-center">
            <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {activeTab === 'quiz' ? (stats.totalQuizzes || 0) : (stats.totalPractices || 0)}
            </h3>
            <p className="text-neutral-600">
              {activeTab === 'practice' && 'Tổng lần luyện tập'}
              {activeTab === 'quiz' && 'Tổng bài kiểm tra'}
              {activeTab === 'review' && 'Tổng lần ôn tập'}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="p-6 text-center">
            <div className="bg-success-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {Math.round(stats.averageScore || 0)}
            </h3>
            <p className="text-neutral-600">Điểm trung bình</p>
          </div>
        </div>

        <div className="card">
          <div className="p-6 text-center">
            <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {activeTab === 'quiz' ? (stats.bestScore || 0) : Math.round(stats.accuracy || 0) + '%'}
            </h3>
            <p className="text-neutral-600">
              {activeTab === 'quiz' ? 'Điểm cao nhất' : 'Độ chính xác'}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="p-6 text-center">
            <div className="bg-warning-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900">
              {activeTab === 'quiz' ? (stats.recentQuizzes || 0) : (stats.recentPractices || 0)}
            </h3>
            <p className="text-neutral-600">Tuần này</p>
          </div>
        </div>
      </div>

      {/* Progress Message */}
      {stats.improvement && (
        <div className="card bg-gradient-to-r from-success-50 to-primary-50 border-success-200">
          <div className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <BarChart3 className="h-6 w-6 text-success-600" />
              <p className="text-success-800 font-medium">
                {stats.improvement.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and History */}
      <div className="card">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
              <History className="mr-2 h-5 w-5" />
              {activeTab === 'practice' && 'Lịch sử luyện tập'}
              {activeTab === 'quiz' && 'Lịch sử kiểm tra'}
              {activeTab === 'review' && 'Lịch sử ôn tập'}
            </h2>
            
            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-neutral-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="input"
                >
                  <option value="">Tất cả chủ đề</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'animals' && 'Động vật'}
                      {category === 'colors' && 'Màu sắc'}
                      {category === 'numbers' && 'Số đếm'}
                      {category === 'food' && 'Thức ăn'}
                      {category === 'family' && 'Gia đình'}
                      {category === 'body' && 'Cơ thể'}
                      {category === 'school' && 'Trường học'}
                      {!['animals', 'colors', 'numbers', 'food', 'family', 'body', 'school'].includes(category) && category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Practice History List */}
          <div className="space-y-6">
            {activeTab === 'quiz' ? (
              // Quiz Sessions List
              practices.map((session, index) => (
                <div key={session.id} className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline connector */}
                  {index < practices.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-6 bg-gradient-to-b from-primary-200 via-primary-300 to-transparent"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-white via-neutral-50/50 to-white rounded-2xl border border-neutral-200 hover:shadow-xl hover:border-primary-200 transition-all duration-500 group-hover:scale-[1.02] relative overflow-hidden cursor-pointer"
                       onClick={() => handleQuizSessionClick(session.id)}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success-50/30 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative z-10 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      {index + 1 + (currentPage - 1) * 5}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          {/* Quiz title and info */}
                          <div className="flex items-center flex-wrap gap-3 mb-4">
                            <h3 className="text-xl font-bold text-neutral-900 group-hover:text-success-700 transition-colors">
                              {session.title}
                            </h3>
                            
                            <span className="badge badge-success capitalize text-xs font-semibold">
                              {session.category}
                            </span>
                            
                            <span className="badge badge-secondary text-xs font-semibold">
                              {session._count?.practices || 0} câu hỏi
                            </span>
                          </div>
                          
                          {/* Quiz stats */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-xl p-3">
                              <p className="text-xs text-neutral-600 mb-1">Tổng điểm</p>
                              <p className="font-bold text-neutral-900">{session.totalScore}/{session.maxScore}</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                              <p className="text-xs text-blue-600 mb-1">Tỷ lệ đúng</p>
                              <p className="font-bold text-blue-800">
                                {Math.round((session.totalScore / session.maxScore) * 100) || 0}%
                              </p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                              <p className="text-xs text-purple-600 mb-1">Độ khó</p>
                              <p className="font-bold text-purple-800 capitalize">{session.difficulty}</p>
                            </div>
                          </div>
                          
                          {/* View details button */}
                          <div className="flex items-center text-sm text-primary-600 font-medium">
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </div>
                        </div>
                        
                        {/* Date and time */}
                        <div className="flex flex-col items-end space-y-3 lg:min-w-[220px]">
                          <div className="flex items-center text-sm text-neutral-500 bg-white px-4 py-2 rounded-full border shadow-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(session.completedAt).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          
                          {session.timeLimit && (
                            <div className="flex items-center text-sm text-neutral-500 bg-white px-4 py-2 rounded-full border shadow-sm">
                              <Clock className="mr-2 h-4 w-4" />
                              {session.timeLimit} phút
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Regular Practice List
              practices.map((practice, index) => (
                <div key={practice.id} className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Timeline connector */}
                  {index < practices.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-6 bg-gradient-to-b from-primary-200 via-primary-300 to-transparent"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-white via-neutral-50/50 to-white rounded-2xl border border-neutral-200 hover:shadow-xl hover:border-primary-200 transition-all duration-500 group-hover:scale-[1.02] relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50/30 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative z-10 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      {index + 1 + (currentPage - 1) * 5}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          {/* Word and badges */}
                          <div className="flex items-center flex-wrap gap-3 mb-4">
                            <h3 className="text-xl font-bold text-neutral-900 flex items-center group-hover:text-primary-700 transition-colors">
                              {practice.vocabulary.word}
                            </h3>
                            
                            <span className="badge badge-secondary capitalize text-xs font-semibold">
                              {practice.vocabulary.category}
                            </span>
                            
                            {practice.mode && (
                              <span className={`badge text-xs font-semibold animate-slide-in-right ${
                                practice.mode === 'practice' ? 'badge-primary' :
                                practice.mode === 'quiz' ? 'badge-success' :
                                'badge-warning'
                              }`}>
                                {practice.mode === 'practice' ? 'Luyện tập' :
                                 practice.mode === 'quiz' ? 'Kiểm tra' :
                                 'Ôn tập'}
                              </span>
                            )}
                          </div>
                          
                          {/* Translation */}
                          <p className="text-neutral-600 font-semibold mb-3 text-lg">
                            {practice.vocabulary.translation}
                          </p>
                          
                          {/* Transcription */}
                          <div className="bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-xl p-4 mb-4 border border-neutral-200">
                            <p className="text-sm text-neutral-700">
                              <span className="font-bold text-neutral-900">AI nghe được:</span> 
                              <span className="italic ml-2 font-medium">"{practice.transcription}"</span>
                            </p>
                          </div>
                          
                          {/* Feedback */}
                          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl p-4 border-l-4 border-blue-400 shadow-sm">
                            <p className="text-sm text-blue-800 leading-relaxed">
                              <span className="font-bold">Feedback AI:</span> {practice.feedback}
                            </p>
                          </div>
                        </div>
                        
                        {/* Score and date */}
                        <div className="flex flex-col items-end space-y-4 lg:min-w-[220px]">
                          <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-bold border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${getScoreColor(practice.score)}`}>
                            <Star className="mr-2 h-6 w-6" />
                            {practice.score} điểm
                          </div>
                          
                          <div className="flex items-center text-sm text-neutral-500 bg-white px-4 py-2 rounded-full border shadow-sm hover:shadow-md transition-shadow">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(practice.createdAt).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {practices.length === 0 && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center">
                  <History className="h-16 w-16 text-neutral-400" />
                </div>
                <div className="absolute top-0 right-1/2 transform translate-x-12 -translate-y-2">
                  <div className="w-6 h-6 bg-yellow-200 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-12">
                  <div className="w-4 h-4 bg-blue-200 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-neutral-700 mb-3">
                {activeTab === 'practice' && 'Chưa có lịch sử luyện tập'}
                {activeTab === 'quiz' && 'Chưa có lịch sử kiểm tra'}
                {activeTab === 'review' && 'Chưa có lịch sử ôn tập'}
              </h3>
              
              <p className="text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
                {activeTab === 'practice' && 'Bắt đầu hành trình luyện phát âm của bạn ngay hôm nay! Mỗi lần luyện tập sẽ giúp bạn cải thiện kỹ năng nói tiếng Anh.'}
                {activeTab === 'quiz' && 'Thử thách bản thân với các bài kiểm tra thú vị! Kiểm tra kiến thức và theo dõi tiến bộ của bạn.'}
                {activeTab === 'review' && 'Ôn tập là chìa khóa thành công! Hãy xem lại những từ vựng đã học để ghi nhớ lâu hơn.'}
              </p>
              
              <a 
                href={activeTab === 'practice' ? '/practice' : activeTab === 'quiz' ? '/quiz' : '/review'} 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>
                  {activeTab === 'practice' && 'Bắt đầu luyện tập'}
                  {activeTab === 'quiz' && 'Làm bài kiểm tra'}
                  {activeTab === 'review' && 'Bắt đầu ôn tập'}
                </span>
              </a>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-neutral-600 bg-neutral-50 px-4 py-2 rounded-full">
                  Hiển thị <span className="font-semibold">{((currentPage - 1) * 5) + 1}</span> - <span className="font-semibold">{Math.min(currentPage * 5, pagination.total)}</span> trong tổng số <span className="font-semibold">{pagination.total}</span> kết quả
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Trước</span>
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white shadow-lg'
                              : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Next button */}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= pagination.pages}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Tiếp</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage