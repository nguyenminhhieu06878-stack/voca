import { useState, useEffect } from 'react'
import { 
  Trophy,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Mic,
  Square,
  Volume2,
  ArrowRight,
  Award
} from 'lucide-react'
import { vocabularyService } from '../services/vocabularyService'
import { practiceService } from '../services/practiceService'
import { quizService } from '../services/quizService'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { Link } from 'react-router-dom'

const QuizPage = () => {
  const [quizState, setQuizState] = useState('setup') // 'setup', 'active', 'completed'
  const [practiceMode, setPracticeMode] = useState('') // 'words' or 'phrases'
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizSettings, setQuizSettings] = useState({
    category: '',
    difficulty: '',
    questionCount: 10,
    timeLimit: 300 // 5 minutes
  })
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryResults, setCategoryResults] = useState({}) // Store quiz results by category
  const [currentResult, setCurrentResult] = useState(null) // Store current question result
  const [questionResults, setQuestionResults] = useState({}) // Track results for each question
  const [currentQuizSession, setCurrentQuizSession] = useState(null) // Current quiz session

  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording
  } = useAudioRecorder()

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load category results when practice mode changes
  useEffect(() => {
    if (practiceMode) {
      loadCategoryResults()
    }
  }, [practiceMode])

  // Timer effect
  useEffect(() => {
    let timer
    if (quizState === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizState, timeLeft])

  const loadCategories = async () => {
    try {
      const data = await vocabularyService.getCategories()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
    }
  }

  const loadCategoryResults = async () => {
    try {
      const data = await quizService.getResultsByCategory(practiceMode)
      const resultsMap = {}
      data.categoryResults.forEach(result => {
        // Only show results for the current practice mode
        if (result.practiceMode === practiceMode) {
          resultsMap[result.category] = result
        }
      })
      setCategoryResults(resultsMap)
    } catch (error) {
      console.error('Error loading category results:', error)
      setCategoryResults({})
    }
  }

  const startQuiz = async () => {
    setLoading(true)
    try {
      const params = {
        category: quizSettings.category,
        difficulty: quizSettings.difficulty,
        limit: quizSettings.questionCount
      }
      
      // Add type filter based on practice mode
      if (practiceMode === 'words') {
        params.type = 'word'
      } else if (practiceMode === 'phrases') {
        // Will filter for phrases and sentences after getting data
      }
      
      const data = await vocabularyService.getVocabulary(params)
      let vocabulary = data.vocabulary || []
      
      console.log('Vocabulary data:', data)
      console.log('Vocabulary array:', vocabulary)
      console.log('Is array:', Array.isArray(vocabulary))
      
      // Filter for phrases mode if needed
      if (practiceMode === 'phrases') {
        vocabulary = vocabulary.filter(item => 
          item.type === 'phrase' || item.type === 'sentence'
        )
      }
      
      if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
        alert(`Không tìm thấy ${practiceMode === 'words' ? 'từ vựng' : 'cụm từ/câu'} phù hợp. Vui lòng thử lại với bộ lọc khác.`)
        return
      }

      // Shuffle and select questions - use spread to ensure it's an array
      const shuffled = [...vocabulary].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, Math.min(quizSettings.questionCount, vocabulary.length))
      
      // Create quiz session
      const sessionTitle = `${quizSettings.category} Quiz - ${selected.length} Questions`
      const sessionData = await quizService.createSession({
        title: sessionTitle,
        category: quizSettings.category,
        difficulty: quizSettings.difficulty,
        timeLimit: Math.floor(quizSettings.timeLimit / 60), // Convert to minutes
        practiceMode: practiceMode
      })
      
      setCurrentQuizSession(sessionData.quizSession)
      setQuestions(selected)
      setCurrentQuestion(0)
      setAnswers([])
      setTimeLeft(quizSettings.timeLimit)
      setQuizState('active')
    } catch (error) {
      console.error('Error starting quiz:', error)
      alert('Có lỗi xảy ra khi bắt đầu quiz. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!audioBlob) {
      alert('Vui lòng ghi âm trước khi nộp bài!')
      return
    }

    setAnalyzing(true)
    try {
      const currentWord = questions[currentQuestion]
      
      const data = await practiceService.analyzePronunciation(
        currentWord.id, 
        audioBlob, 
        'quiz',
        currentQuizSession?.id
      )
      
      const answer = {
        question: currentWord,
        userAnswer: data.transcription,
        score: data.score,
        isCorrect: data.isCorrect,
        feedback: data.feedback,
        specificErrors: data.specificErrors || '',
        suggestions: data.suggestions || ''
      }

      // Store current result for display
      setCurrentResult(answer)
      
      // Track result for this question
      setQuestionResults(prev => ({
        ...prev,
        [currentQuestion]: answer
      }))

      setAnswers(prev => [...prev, answer])
      clearRecording()

      // Auto-advance after 2 seconds or wait for user action
      setTimeout(() => {
        if (currentQuestion + 1 >= questions.length) {
          completeQuiz()
        } else {
          setCurrentQuestion(prev => prev + 1)
          setCurrentResult(null)
        }
      }, 2000)
    } catch (error) {
      console.error('Error analyzing pronunciation:', error)
      alert('Có lỗi xảy ra khi phân tích phát âm. Vui lòng thử lại.')
    } finally {
      setAnalyzing(false)
    }
  }

  const completeQuiz = async () => {
    // Calculate final scores
    const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
    const maxScore = answers.length * 100
    
    // Update quiz session with final scores
    if (currentQuizSession) {
      try {
        await quizService.updateSession(currentQuizSession.id, {
          totalScore,
          maxScore
        })
        // Reload category results to update percentages
        await loadCategoryResults()
      } catch (error) {
        console.error('Error updating quiz session:', error)
      }
    }
    
    setQuizState('completed')
  }

  const resetQuiz = () => {
    setQuizState('setup')
    setQuestions([])
    setCurrentQuestion(0)
    setAnswers([])
    setTimeLeft(0)
    setCurrentQuizSession(null)
    setCurrentResult(null)
    setQuestionResults({})
    clearRecording()
    // Reload category results to get latest data
    loadCategoryResults()
  }

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateResults = () => {
    const totalQuestions = answers.length
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const averageScore = answers.reduce((sum, a) => sum + a.score, 0) / totalQuestions
    const accuracy = (correctAnswers / totalQuestions) * 100

    return {
      totalQuestions,
      correctAnswers,
      averageScore: Math.round(averageScore),
      accuracy: Math.round(accuracy)
    }
  }

  // Setup Phase
  if (quizState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Pronunciation Quiz
                </h1>
                <p className="text-neutral-600">
                  Test your pronunciation skills with our AI-powered quiz
                </p>
              </div>

              <div className="space-y-6">
                {/* Practice Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Practice Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPracticeMode('words')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        practiceMode === 'words'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-medium">Từ đơn</div>
                      <div className="text-sm text-neutral-500">Single words</div>
                    </button>
                    <button
                      onClick={() => setPracticeMode('phrases')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        practiceMode === 'phrases'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-medium">Cụm từ & Câu</div>
                      <div className="text-sm text-neutral-500">Phrases & sentences</div>
                    </button>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    value={quizSettings.category}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, category: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">All Categories</option>
                    {Array.isArray(categories) && categories.map(category => {
                      const result = categoryResults[category]
                      const displayText = result 
                        ? `${category.charAt(0).toUpperCase() + category.slice(1)} (${result.percentage}%)`
                        : category.charAt(0).toUpperCase() + category.slice(1)
                      
                      return (
                        <option key={category} value={category}>
                          {displayText}
                        </option>
                      )
                    })}
                  </select>
                  
                  {/* Category Results Display */}
                  {Object.keys(categoryResults).length > 0 && (
                    <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                      <h4 className="text-sm font-medium text-neutral-700 mb-2">Your Quiz History:</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {Object.values(categoryResults).map(result => (
                          <div key={result.category} className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">
                              {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                                result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {result.percentage}%
                              </div>
                              <span className="text-xs text-neutral-400">
                                {result.totalScore}/{result.maxScore}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Difficulty Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={quizSettings.difficulty}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={quizSettings.questionCount}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                    className="input w-full"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Time Limit
                  </label>
                  <select
                    value={quizSettings.timeLimit}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="input w-full"
                  >
                    <option value={180}>3 Minutes</option>
                    <option value={300}>5 Minutes</option>
                    <option value={600}>10 Minutes</option>
                    <option value={900}>15 Minutes</option>
                  </select>
                </div>

                <button
                  onClick={startQuiz}
                  disabled={loading || !practiceMode}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4" />
                      <span>Start Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Active Quiz Phase
  if (quizState === 'active' && questions.length > 0) {
    const currentWord = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Quiz Header */}
          <div className="card mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      Question {currentQuestion + 1} of {questions.length}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      {currentWord.category} • {currentWord.difficulty}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Question Indicators */}
              <div className="flex justify-center space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                      index < currentQuestion
                        ? questionResults[index]?.isCorrect
                          ? 'bg-success-500 text-white'
                          : 'bg-warning-500 text-white'
                        : index === currentQuestion
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {index < currentQuestion ? (
                      questionResults[index]?.isCorrect ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )
                    ) : (
                      index + 1
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="card">
            <div className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  Pronounce this {currentWord.type || 'word'}:
                </h3>
                <div className="bg-primary-50 rounded-lg p-6 mb-4">
                  <p className="text-3xl font-bold text-primary-900 mb-2">
                    {currentWord.word}
                  </p>
                  <p className="text-neutral-600 mb-2">
                    {currentWord.translation}
                  </p>
                  {currentWord.phonetic && (
                    <p className="text-sm text-neutral-500 font-mono">
                      {currentWord.phonetic}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => playAudio(currentWord.word)}
                  className="btn-secondary flex items-center space-x-2 mx-auto mb-6"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Recording Controls */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <Mic className="h-6 w-6" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center animate-pulse shadow-lg"
                    >
                      <Square className="h-6 w-6" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-neutral-600">
                  {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>

                {audioBlob && !currentResult && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={clearRecording}
                      className="btn-secondary"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Record Again
                    </button>
                    
                    <button
                      onClick={submitAnswer}
                      disabled={analyzing}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {analyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Analyzing pronunciation...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" />
                          <span>Submit Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Show Result After Analysis */}
                {currentResult && (
                  <div className="mt-6 p-6 bg-neutral-50 rounded-lg">
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center mb-3">
                        {currentResult.isCorrect ? (
                          <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mr-3">
                            <CheckCircle className="h-8 w-8 text-success-600" />
                          </div>
                        ) : (
                          <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mr-3">
                            <XCircle className="h-8 w-8 text-warning-600" />
                          </div>
                        )}
                        <div className="text-left">
                          <div className="text-2xl font-bold text-neutral-900">
                            {currentResult.score}/100
                          </div>
                          <div className={`text-sm font-medium ${
                            currentResult.isCorrect ? 'text-success-600' : 'text-warning-600'
                          }`}>
                            {currentResult.isCorrect ? '✅ Correct!' : '💪 Keep trying!'}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600">
                        You said: "{currentResult.userAnswer}"
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-neutral-700 text-sm">{currentResult.feedback}</p>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-sm text-neutral-500">Moving to next question...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Completed Quiz Phase
  if (quizState === 'completed') {
    const results = calculateResults()

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Quiz Completed!
                </h1>
                <p className="text-neutral-600">
                  Great job! Here are your results:
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{results.totalQuestions}</p>
                  <p className="text-sm text-neutral-600">Total Questions</p>
                </div>

                <div className="text-center">
                  <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{results.correctAnswers}</p>
                  <p className="text-sm text-neutral-600">Correct</p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{results.averageScore}</p>
                  <p className="text-sm text-neutral-600">Avg Score</p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{results.accuracy}%</p>
                  <p className="text-sm text-neutral-600">Accuracy</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-neutral-900">Detailed Results:</h3>
                {answers.map((answer, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {answer.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">{answer.question.word}</span>
                        <span className="text-sm text-neutral-500">({answer.question.translation})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          answer.score >= 80 ? 'bg-green-100 text-green-800' :
                          answer.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {answer.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 space-y-2">
                      <p><strong>You said:</strong> "{answer.userAnswer}"</p>
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <p><strong>Feedback:</strong> {answer.feedback}</p>
                        {answer.specificErrors && (
                          <p className="mt-2"><strong>Specific Errors:</strong> {answer.specificErrors}</p>
                        )}
                        {answer.suggestions && (
                          <p className="mt-2"><strong>Tips:</strong> {answer.suggestions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetQuiz}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Take Another Quiz</span>
                </button>
                
                <Link
                  to="/practice"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Target className="h-4 w-4" />
                  <span>Continue Practice</span>
                </Link>
                
                <Link
                  to="/"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default QuizPage