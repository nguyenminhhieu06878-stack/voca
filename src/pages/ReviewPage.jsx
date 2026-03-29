import { useState, useEffect } from 'react'
import { 
  RotateCcw,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Mic,
  Square,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Home,
  BookOpen
} from 'lucide-react'
import { practiceService } from '../services/practiceService'
import { reviewService } from '../services/reviewService'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { Link } from 'react-router-dom'

const ReviewPage = () => {
  const [practiceMode, setPracticeMode] = useState('') // 'words' or 'phrases'
  const [currentView, setCurrentView] = useState('mode-selection') // 'mode-selection', 'review', 'completed'
  const [reviewWords, setReviewWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [reviewComplete, setReviewComplete] = useState(false)
  const [reviewResults, setReviewResults] = useState([])

  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording
  } = useAudioRecorder()

  useEffect(() => {
    // Don't auto-load on mount, wait for mode selection
  }, [])

  const handleModeSelect = (mode) => {
    setPracticeMode(mode)
    setCurrentView('review')
    loadReviewWords(mode)
  }

  const loadReviewWords = async (mode = practiceMode) => {
    setLoading(true)
    try {
      console.log('🔍 Loading review items for mode:', mode)
      
      // Get review items from the new review system
      const reviewData = await reviewService.getReviewItems({ limit: 100 })
      console.log('📊 Review items received:', reviewData)
      
      // Filter by practice mode
      const filteredReviewItems = reviewData.reviewItems.filter(item => {
        const vocabularyType = item.vocabulary.type
        const matchesMode = mode === 'words' 
          ? vocabularyType === 'word'
          : (vocabularyType === 'phrase' || vocabularyType === 'sentence')
        return matchesMode
      })
      
      console.log('📝 Filtered review items:', filteredReviewItems)
      
      // Transform to match expected format
      const reviewWords = filteredReviewItems.map(item => ({
        id: item.vocabularyId,
        ...item.vocabulary,
        lastScore: item.lastScore,
        attempts: item.attempts,
        reviewItemId: item.id
      }))
      
      setReviewWords(reviewWords)
      
      if (reviewWords.length === 0) {
        setReviewComplete(true)
      }
    } catch (error) {
      console.error('Error loading review words:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePronunciation = async () => {
    if (!audioBlob) {
      alert('Vui lòng ghi âm trước khi nộp bài!')
      return
    }

    setAnalyzing(true)
    try {
      const currentWord = reviewWords[currentWordIndex]
      console.log('🎯 Analyzing pronunciation for review word:', {
        id: currentWord.id,
        word: currentWord.word,
        type: currentWord.type
      })
      
      const data = await practiceService.analyzePronunciation(currentWord.id, audioBlob, 'review')
      
      const analysisResult = {
        transcription: data.transcription,
        score: data.score,
        feedback: data.feedback,
        isCorrect: data.isCorrect,
        specificErrors: data.specificErrors || '',
        suggestions: data.suggestions || ''
      }
      
      setResult(analysisResult)
      
      // Add to review results
      const reviewResult = {
        word: currentWord,
        result: analysisResult,
        improved: analysisResult.score > currentWord.lastScore,
        passedThreshold: analysisResult.score >= 80
      }
      
      setReviewResults(prev => [...prev, reviewResult])
      
      if (analysisResult.score >= 80) {
        console.log('📝 This should update the practice page score when user returns')
      }
      
      clearRecording()
    } catch (error) {
      console.error('Error analyzing pronunciation:', error)
      alert('Có lỗi xảy ra khi phân tích phát âm. Vui lòng thử lại.')
    } finally {
      setAnalyzing(false)
    }
  }

  const nextWord = () => {
    if (currentWordIndex + 1 >= reviewWords.length) {
      setReviewComplete(true)
    } else {
      setCurrentWordIndex(prev => prev + 1)
      setResult(null)
      clearRecording()
    }
  }

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const resetReview = () => {
    setCurrentWordIndex(0)
    setResult(null)
    setReviewComplete(false)
    setReviewResults([])
    setCurrentView('mode-selection')
    setPracticeMode('')
    clearRecording()
  }

  const calculateImprovement = () => {
    const totalWords = reviewResults.length
    const improvedWords = reviewResults.filter(r => r.improved).length
    const passedWords = reviewResults.filter(r => r.passedThreshold).length
    const averageScore = reviewResults.reduce((sum, r) => sum + r.result.score, 0) / totalWords
    const improvementRate = (improvedWords / totalWords) * 100
    const passRate = (passedWords / totalWords) * 100

    return {
      totalWords,
      improvedWords,
      passedWords,
      averageScore: Math.round(averageScore),
      improvementRate: Math.round(improvementRate),
      passRate: Math.round(passRate)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading words to review...</p>
        </div>
      </div>
    )
  }

  // Mode Selection View
  if (currentView === 'mode-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Review Practice
                </h1>
                <p className="text-neutral-600">
                  Choose what type of content you want to review
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Words Review */}
                <button
                  onClick={() => handleModeSelect('words')}
                  className="card hover:shadow-lg transition-all duration-300 hover:scale-105 text-center p-6"
                >
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    Review Từ đơn
                  </h2>
                  <p className="text-neutral-600 text-sm">
                    Review words you got wrong
                  </p>
                </button>

                {/* Phrases Review */}
                <button
                  onClick={() => handleModeSelect('phrases')}
                  className="card hover:shadow-lg transition-all duration-300 hover:scale-105 text-center p-6"
                >
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    Review Cụm từ & Câu
                  </h2>
                  <p className="text-neutral-600 text-sm">
                    Review phrases and sentences you got wrong
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No review words found
  if (reviewWords.length === 0 && !loading && currentView === 'review') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card">
            <div className="p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Great Job!
              </h1>
              <p className="text-neutral-600 mb-6">
                You don't have any {practiceMode === 'words' ? 'words' : 'phrases/sentences'} that need review (all scores ≥ 80). Keep practicing to maintain your skills!
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentView('mode-selection')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Mode Selection</span>
                </button>
                <Link to="/practice" className="btn-primary flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Continue Practice</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Review completed
  if (reviewComplete && reviewResults.length > 0) {
    const stats = calculateImprovement()

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Review Complete!
                </h1>
                <p className="text-neutral-600">
                  Here's how you improved on your challenging {practiceMode === 'words' ? 'words' : 'phrases & sentences'}:
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalWords}</p>
                  <p className="text-sm text-neutral-600">{practiceMode === 'words' ? 'Words' : 'Phrases/Sentences'} Reviewed</p>
                </div>

                <div className="text-center">
                  <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.improvedWords}</p>
                  <p className="text-sm text-neutral-600">Improved</p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.averageScore}</p>
                  <p className="text-sm text-neutral-600">Avg Score</p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{stats.passedWords}</p>
                  <p className="text-sm text-neutral-600">Passed (≥80)</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-neutral-900">Detailed Results:</h3>
                {reviewResults.map((review, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {review.improved ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className="font-medium">{review.word.word}</span>
                        <span className="text-sm text-neutral-500">({review.word.translation})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-500">
                          {review.word.lastScore} → {review.result.score}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          review.result.score >= 80 ? 'bg-green-100 text-green-800' :
                          review.result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {review.result.score}/100
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 space-y-2">
                      <p><strong>You said:</strong> "{review.result.transcription}"</p>
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <p><strong>Feedback:</strong> {review.result.feedback}</p>
                        {review.result.specificErrors && (
                          <p className="mt-2"><strong>Specific Errors:</strong> {review.result.specificErrors}</p>
                        )}
                        {review.result.suggestions && (
                          <p className="mt-2"><strong>Tips:</strong> {review.result.suggestions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetReview}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Review Again</span>
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

  // Active review
  if (reviewWords.length > 0) {
    const currentWord = reviewWords[currentWordIndex]
    const progress = ((currentWordIndex + 1) / reviewWords.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="card mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentView('mode-selection')}
                    className="btn-secondary inline-flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </button>
                  <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-neutral-900">
                      Review {currentWordIndex + 1} of {reviewWords.length} - {practiceMode === 'words' ? 'Từ đơn' : 'Cụm từ & Câu'}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      Practice {practiceMode === 'words' ? 'words' : 'phrases/sentences'} that need review • Last score: {currentWord.lastScore}/100 • Attempts: {currentWord.attempts}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Word Card */}
          <div className="card">
            <div className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  Try again: {currentWord.type || 'word'}
                </h3>
                <div className="bg-orange-50 rounded-lg p-6 mb-4">
                  <p className="text-3xl font-bold text-orange-900 mb-2">
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

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-800">Needs review (score &lt; 80):</p>
                      <p className="text-sm text-yellow-700">Last score: {currentWord.lastScore}/100 • {currentWord.attempts} attempts</p>
                    </div>
                  </div>
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

                {audioBlob && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={clearRecording}
                      className="btn-secondary"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Record Again
                    </button>
                    
                    <button
                      onClick={handlePronunciation}
                      disabled={analyzing}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {analyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>AI is analyzing...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" />
                          <span>Check Pronunciation</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div className="mt-6 p-6 bg-neutral-50 rounded-lg">
                    <div className="text-center mb-4">
                      <div className={`text-4xl mb-2 ${
                        result.score >= 80 ? 'text-green-500' : 
                        result.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {result.score >= 80 ? '🎉' : result.score >= 60 ? '👍' : '💪'}
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">
                        {result.score}/100
                      </p>
                      <p className="text-sm text-neutral-600">
                        You said: "{result.transcription}"
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-neutral-700">{result.feedback}</p>
                    </div>

                    <button
                      onClick={nextWord}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      <span>
                        {currentWordIndex + 1 >= reviewWords.length ? 'Complete Review' : 'Next Word'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default ReviewPage