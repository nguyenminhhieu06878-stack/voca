import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { 
  BookOpen, 
  Search,
  Mic,
  Square,
  Volume2,
  ArrowLeft,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { vocabularyService } from '../services/vocabularyService'
import { practiceService } from '../services/practiceService'
import { useAudioRecorder } from '../hooks/useAudioRecorder'

const PracticePageNew = () => {
  const { vocabularyId } = useParams()
  const [searchParams] = useSearchParams()
  const [currentView, setCurrentView] = useState(vocabularyId ? 'practice' : 'mode-selection')
  const [practiceMode, setPracticeMode] = useState('') // 'words' or 'phrases'
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [vocabulary, setVocabulary] = useState([])
  const [selectedWord, setSelectedWord] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [fromLesson, setFromLesson] = useState('')
  const [toLesson, setToLesson] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [type, setType] = useState('') // 'word', 'phrase', 'sentence'
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [completedWords, setCompletedWords] = useState(new Map()) // Track completed words with scores
  const [categoryCompletions, setCategoryCompletions] = useState(new Map()) // Track category completion status

  // Check for search parameter from URL (from homepage quick search)
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
      // Auto-select appropriate mode based on search term
      const isPhrase = searchFromUrl.includes(' ') || 
                      searchFromUrl.toLowerCase().includes('good') ||
                      searchFromUrl.toLowerCase().includes('thank') ||
                      searchFromUrl.toLowerCase().includes('how are')
      
      if (isPhrase) {
        setPracticeMode('phrases')
        setType('phrase')
      } else {
        setPracticeMode('words')
        setType('word')
      }
      setCurrentView('vocabulary')
    }
  }, [searchParams])

  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording
  } = useAudioRecorder()

  // Load completed words from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('completedWords')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        
        // Handle old format (array of IDs) vs new format (Map entries)
        if (Array.isArray(data)) {
          if (data.length > 0 && typeof data[0] === 'string') {
            // Old format: array of IDs, convert to Map with default values
            const map = new Map()
            data.forEach(id => {
              map.set(id, { score: 0, isCorrect: false, timestamp: Date.now() })
            })
            setCompletedWords(map)
          } else {
            // New format: array of [key, value] pairs
            setCompletedWords(new Map(data))
          }
        }
      } catch (error) {
        console.error('Error loading completed words:', error)
        // Clear corrupted data
        localStorage.removeItem('completedWords')
        setCompletedWords(new Map())
      }
    }
  }, [])

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load vocabulary when category changes
  useEffect(() => {
    if (selectedCategory || searchTerm || difficulty || type || practiceMode) {
      loadVocabulary()
    }
  }, [selectedCategory, searchTerm, difficulty, type, practiceMode])

  // Load latest scores from database when vocabulary changes
  useEffect(() => {
    if (vocabulary.length > 0) {
      loadLatestScores()
    }
  }, [vocabulary])

  // Refresh scores when user returns to the page (e.g., from review mode)
  useEffect(() => {
    const handleFocus = () => {
      if (vocabulary.length > 0) {
        loadLatestScores()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [vocabulary])

  // Update category completions when completedWords changes
  useEffect(() => {
    const updateCategoryCompletions = async () => {
      if (categories.length > 0 && completedWords.size > 0) {
        const newCompletions = new Map()
        
        for (const category of categories) {
          const completion = await getCategoryCompletion(category)
          newCompletions.set(category, completion)
        }
        
        setCategoryCompletions(newCompletions)
      }
    }
    
    updateCategoryCompletions()
  }, [categories, completedWords, practiceMode])

  // Load specific vocabulary if vocabularyId is provided
  useEffect(() => {
    if (vocabularyId) {
      loadSpecificVocabulary(vocabularyId)
    }
  }, [vocabularyId])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await vocabularyService.getCategories()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadVocabulary = async () => {
    try {
      setLoading(true)
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      if (searchTerm) params.search = searchTerm
      if (difficulty) params.difficulty = difficulty
      
      // Auto-set type based on practice mode if not manually selected
      let typeFilter = type
      if (!typeFilter && practiceMode) {
        if (practiceMode === 'words') {
          typeFilter = 'word'
        } else if (practiceMode === 'phrases') {
          // For phrases mode, get both phrases and sentences
          // We'll handle this in the API call
        }
      }
      
      if (typeFilter) params.type = typeFilter

      const data = await vocabularyService.getVocabulary(params)
      let vocabularyList = data.vocabulary || []
      
      // If in phrases mode and no specific type selected, filter for phrases and sentences
      if (practiceMode === 'phrases' && !type) {
        vocabularyList = vocabularyList.filter(item => 
          item.type === 'phrase' || item.type === 'sentence'
        )
      }
      
      setVocabulary(vocabularyList)
    } catch (error) {
      console.error('Failed to load vocabulary:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSpecificVocabulary = async (id) => {
    try {
      setLoading(true)
      const data = await vocabularyService.getVocabularyById(id)
      setSelectedWord(data.vocabulary)
      setCurrentView('practice')
    } catch (error) {
      console.error('Failed to load vocabulary:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLatestScores = async () => {
    try {
      const vocabularyIds = vocabulary.map(word => word.id)
      if (vocabularyIds.length === 0) return

      console.log('🔍 Loading latest scores for vocabulary IDs:', vocabularyIds)
      const data = await practiceService.getLatestScores(vocabularyIds)
      
      console.log('📊 Latest scores from database:', data.latestScores)
      
      // Merge database scores with localStorage data
      const newCompletedWords = new Map(completedWords)
      
      Object.entries(data.latestScores).forEach(([vocabularyId, scoreData]) => {
        const existingData = newCompletedWords.get(vocabularyId)
        
        // Use database score if it's newer or higher than localStorage
        if (!existingData || scoreData.score > existingData.score || scoreData.timestamp > existingData.timestamp) {
          newCompletedWords.set(vocabularyId, scoreData)
        }
      })
      
      setCompletedWords(newCompletedWords)
      
      // Update localStorage with merged data
      localStorage.setItem('completedWords', JSON.stringify([...newCompletedWords]))
      
      console.log('✅ Updated completed words with latest scores')
    } catch (error) {
      console.error('Failed to load latest scores:', error)
      // Don't fail silently, but don't break the page either
    }
  }

  const handleModeSelect = (mode) => {
    setPracticeMode(mode)
    if (mode === 'words') {
      setType('word')
    } else if (mode === 'phrases') {
      setType('phrase')
    }
    setSearchTerm('') // Reset search when changing mode
    setFromLesson('') // Reset lesson range
    setToLesson('')
    setCurrentView('categories')
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSearchTerm('') // Reset search when selecting category
    setFromLesson('') // Reset lesson range
    setToLesson('')
    setCurrentView('vocabulary')
    // Refresh scores when entering vocabulary view
    setTimeout(() => {
      if (vocabulary.length > 0) {
        loadLatestScores()
      }
    }, 100)
  }

  const handleWordSelect = (word) => {
    setSelectedWord(word)
    setCurrentView('practice')
    setResult(null)
    clearRecording()
  }

  const handleAnalyzePronunciation = async () => {
    if (!audioBlob || !selectedWord) return

    try {
      setAnalyzing(true)
      const data = await practiceService.analyzePronunciation(selectedWord.id, audioBlob)
      
      // The backend returns the analysis data directly, not nested in practice
      setResult({
        transcription: data.transcription,
        score: data.score,
        feedback: data.feedback,
        isCorrect: data.isCorrect,
        specificErrors: data.specificErrors || '',
        suggestions: data.suggestions || ''
      })
      
      // Mark word as completed and save to localStorage with score
      const newCompletedWords = new Map(completedWords)
      newCompletedWords.set(selectedWord.id, {
        score: data.score,
        isCorrect: data.isCorrect,
        timestamp: Date.now()
      })
      setCompletedWords(newCompletedWords)
      localStorage.setItem('completedWords', JSON.stringify([...newCompletedWords]))
    } catch (error) {
      console.error('Failed to analyze pronunciation:', error)
      setResult({
        error: 'Failed to analyze pronunciation. Please try again.'
      })
    } finally {
      setAnalyzing(false)
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

  // Calculate category completion status
  const getCategoryCompletion = async (category) => {
    try {
      // Get all words for this category
      const params = {
        category: category,
        type: practiceMode === 'words' ? 'word' : undefined
      }
      
      // If phrases mode, we need to filter for phrases and sentences
      const data = await vocabularyService.getVocabulary(params)
      let categoryWords = data.vocabulary || []
      
      if (practiceMode === 'phrases') {
        categoryWords = categoryWords.filter(item => 
          item.type === 'phrase' || item.type === 'sentence'
        )
      }
      
      const total = categoryWords.length
      let perfect = 0
      
      categoryWords.forEach(word => {
        const result = completedWords.get(word.id)
        if (result && result.score === 100) {
          perfect++
        }
      })
      
      return {
        completed: perfect === total && total > 0,
        total,
        perfect,
        percentage: total > 0 ? Math.round((perfect / total) * 100) : 0
      }
    } catch (error) {
      console.error('Error calculating category completion:', error)
      return { completed: false, total: 0, perfect: 0, percentage: 0 }
    }
  }

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'bg-success-100 text-success-800',
      'Intermediate': 'bg-warning-100 text-warning-800',
      'Advanced': 'bg-error-100 text-error-800'
    }
    return colors[level] || 'bg-neutral-100 text-neutral-800'
  }

  if (loading && (currentView === 'categories' || currentView === 'mode-selection')) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Mode Selection View
  if (currentView === 'mode-selection') {
    return (
      <div className="py-4 sm:py-6">
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2 sm:mb-4">
            🎯 Practice Pronunciation
          </h1>
          <p className="text-base sm:text-xl text-neutral-600 px-2">
            Choose what you want to practice
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Words Practice */}
          <button
            onClick={() => handleModeSelect('words')}
            className="card hover:shadow-xl transition-all duration-300 hover:scale-105 text-center p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 sm:mb-4">
              Từ đơn
            </h2>
            <p className="text-neutral-600 mb-4">
              Luyện phát âm các từ vựng đơn lẻ
            </p>
            <div className="text-sm text-neutral-500">
              Phù hợp cho người mới bắt đầu
            </div>
          </button>

          {/* Phrases Practice */}
          <button
            onClick={() => handleModeSelect('phrases')}
            className="card hover:shadow-xl transition-all duration-300 hover:scale-105 text-center p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 sm:mb-4">
              Cụm từ & Câu
            </h2>
            <p className="text-neutral-600 mb-4">
              Luyện phát âm cụm từ và câu hoàn chỉnh
            </p>
            <div className="text-sm text-neutral-500">
              Phù hợp cho người có kinh nghiệm
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Categories View
  if (currentView === 'categories') {
    // Filter categories based on search term and lesson numbers
    let filteredCategories = categories.filter(category =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Filter by lesson number range if specified
    if (fromLesson || toLesson) {
      const from = parseInt(fromLesson) || 1
      const to = parseInt(toLesson) || filteredCategories.length
      
      filteredCategories = filteredCategories.slice(from - 1, to)
    }

    return (
      <div className="py-8">
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('mode-selection')}
            className="btn-secondary mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mode Selection
          </button>
          
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            🎯 {practiceMode === 'words' ? 'Từ đơn' : 'Cụm từ & Câu'}
          </h1>
          <p className="text-xl text-neutral-600 mb-6">
            Choose a category to start practicing
          </p>

          {/* Compact Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Text Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Tìm chủ đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-9 text-sm"
                  />
                </div>
              </div>
              
              {/* Lesson Range */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-neutral-600 whitespace-nowrap">Bài:</span>
                <input
                  type="number"
                  placeholder="Từ"
                  value={fromLesson}
                  onChange={(e) => setFromLesson(e.target.value)}
                  className="input text-sm w-16"
                  min="1"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={toLesson}
                  onChange={(e) => setToLesson(e.target.value)}
                  className="input text-sm w-16"
                  min="1"
                />
                {(searchTerm || fromLesson || toLesson) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setFromLesson('')
                      setToLesson('')
                    }}
                    className="text-sm text-neutral-500 hover:text-neutral-700 px-2"
                    title="Xóa bộ lọc"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Search Results Info */}
            {(searchTerm || fromLesson || toLesson) && (
              <div className="text-center mt-2 text-sm text-neutral-600">
                {filteredCategories.length > 0 ? (
                  <>
                    Hiển thị {filteredCategories.length} chủ đề
                    {searchTerm && ` cho "${searchTerm}"`}
                    {(fromLesson || toLesson) && ` (bài ${fromLesson || 1}-${toLesson || categories.length})`}
                  </>
                ) : (
                  'Không tìm thấy chủ đề nào'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">
              Không tìm thấy chủ đề nào
            </p>
            {searchTerm && (
              <p className="text-sm text-neutral-500 mb-4">
                Thử tìm kiếm: animals, colors, food, family, body, school
              </p>
            )}
            {(fromLesson || toLesson) && (
              <p className="text-sm text-neutral-500 mb-4">
                Thử điều chỉnh khoảng bài học (1-{categories.length})
              </p>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setFromLesson('')
                setToLesson('')
              }}
              className="btn-secondary"
            >
              Xem tất cả chủ đề
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
            // Find the original index of this category in the full list
            const originalIndex = categories.findIndex(cat => cat === category)
            const completion = categoryCompletions.get(category)
            return (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="card hover:shadow-lg transition-all duration-300 hover:scale-105 text-left relative"
              >
                {/* Perfect Completion Badge */}
                {completion?.completed && (
                  <div className="absolute top-3 right-3 bg-success-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-4xl mb-4 font-bold text-primary-600">
                    {originalIndex + 1}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {category}
                    </h3>
                    {completion && completion.total > 0 && (
                      <span className="text-sm font-medium text-neutral-600">
                        {completion.perfect}/{completion.total}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600 text-sm mb-2">
                    Practice {category.toLowerCase()} {practiceMode === 'words' ? 'words' : 'phrases & sentences'}
                  </p>
                  {completion && completion.total > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                        <span>Progress</span>
                        <span>{completion.percentage}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            completion.completed ? 'bg-success-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${completion.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
          </div>
        )}
      </div>
    )
  }

  // Vocabulary List View
  if (currentView === 'vocabulary') {
    const isFromSearch = searchParams.get('search') // Check if coming from homepage search
    
    return (
      <div className="py-8">
        <div className="mb-8">
          <button
            onClick={() => isFromSearch ? setCurrentView('mode-selection') : setCurrentView('categories')}
            className="btn-secondary mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isFromSearch ? 'Back to Home' : 'Back to Categories'}
          </button>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {isFromSearch ? (
              `Kết quả tìm kiếm: "${searchTerm}"`
            ) : (
              `${selectedCategory} - ${practiceMode === 'words' ? 'Từ đơn' : 'Cụm từ & Câu'}`
            )}
          </h1>
          <p className="text-neutral-600">
            {isFromSearch ? (
              `Tìm thấy ${vocabulary.length} kết quả cho từ khóa "${searchTerm}"`
            ) : (
              `Select a ${practiceMode === 'words' ? 'word' : 'phrase/sentence'} to practice pronunciation`
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder={`Tìm kiếm ${practiceMode === 'words' ? 'từ vựng' : 'cụm từ/câu'}... (ví dụ: cat, hello, good morning)`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                {searchTerm && (
                  <div className="mt-2 text-sm text-neutral-600">
                    Tìm thấy {vocabulary.length} kết quả cho "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-primary-600 hover:text-primary-700"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
              <div className="sm:w-48">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input"
                >
                  <option value="">Tất cả loại</option>
                  {practiceMode === 'words' ? (
                    <option value="word">Từ đơn</option>
                  ) : (
                    <>
                      <option value="phrase">Cụm từ</option>
                      <option value="sentence">Câu</option>
                    </>
                  )}
                </select>
              </div>
              <div className="sm:w-48">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input"
                >
                  <option value="">Tất cả mức độ</option>
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
              <div className="flex gap-2">
                {/* Progress clear button removed */}
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocabulary.map((word) => {
              const wordResult = completedWords.get(word.id)
              return (
                <button
                  key={word.id}
                  onClick={() => handleWordSelect(word)}
                  className="card hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {word.word}
                        </h3>
                        {wordResult && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-neutral-600">
                              {wordResult.score}/100
                            </span>
                            {wordResult.isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-success-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-warning-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">!</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                        {word.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-neutral-600 mb-2">
                      {word.translation}
                    </p>
                    
                    {word.phonetic && (
                      <p className="text-sm text-primary-600 mb-3">
                        /{word.phonetic}/
                      </p>
                    )}
                    
                    {word.example && (
                      <p className="text-sm text-neutral-500 italic">
                        "{word.example}"
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {!loading && vocabulary.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            {searchTerm ? (
              <div>
                <p className="text-neutral-600 mb-2">
                  Không tìm thấy {practiceMode === 'words' ? 'từ vựng' : 'cụm từ/câu'} nào cho "{searchTerm}"
                </p>
                <p className="text-sm text-neutral-500 mb-4">
                  Thử tìm kiếm: cat, dog, hello, good morning, I am happy, thank you
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-secondary"
                >
                  Xem tất cả {practiceMode === 'words' ? 'từ vựng' : 'cụm từ/câu'}
                </button>
              </div>
            ) : (
              <p className="text-neutral-600">
                Không có {practiceMode === 'words' ? 'từ vựng' : 'cụm từ/câu'} nào trong chủ đề này với bộ lọc hiện tại.
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Practice View
  if (currentView === 'practice' && selectedWord) {
    return (
      <div className="py-8">
        <div className="mb-8">
          <button
            onClick={() => vocabularyId ? setCurrentView('mode-selection') : setCurrentView('vocabulary')}
            className="btn-secondary mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Word Information */}
          <div className="card">
            <div className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                  {selectedWord.word}
                </h1>
                <p className="text-xl text-neutral-600 mb-3">
                  {selectedWord.translation}
                </p>
                {selectedWord.phonetic && (
                  <p className="text-lg text-primary-600 mb-4">
                    /{selectedWord.phonetic}/
                  </p>
                )}
                <button
                  onClick={() => playAudio(selectedWord.word)}
                  className="btn-secondary inline-flex items-center"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Listen
                </button>
              </div>

              {selectedWord.example && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Example:</h3>
                  <p className="text-neutral-700 italic">"{selectedWord.example}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Recording Panel */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Practice Recording
              </h2>

              <div className="text-center mb-6">
                <div className="mb-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="btn-primary btn-lg inline-flex items-center"
                      disabled={analyzing}
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="btn-danger btn-lg inline-flex items-center"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </button>
                  )}
                </div>

                {audioBlob && !isRecording && (
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-600">Recording ready!</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleAnalyzePronunciation}
                        disabled={analyzing}
                        className="btn-primary inline-flex items-center"
                      >
                        {analyzing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Target className="h-4 w-4 mr-2" />
                        )}
                        {analyzing ? 'Analyzing...' : 'Analyze'}
                      </button>
                      <button
                        onClick={clearRecording}
                        className="btn-secondary"
                        disabled={analyzing}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Results */}
              {result && (
                <div className="border-t pt-6">
                  {result.error ? (
                    <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-error-600 mr-2" />
                        <p className="text-error-800">{result.error}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Score Display with Check Mark */}
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                          {result.isCorrect ? (
                            <div className="bg-success-100 w-20 h-20 rounded-full flex items-center justify-center mr-4">
                              <CheckCircle className="h-10 w-10 text-success-600" />
                            </div>
                          ) : (
                            <div className="bg-warning-100 w-20 h-20 rounded-full flex items-center justify-center mr-4">
                              <AlertCircle className="h-10 w-10 text-warning-600" />
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-3xl font-bold text-neutral-900 mb-1">
                              {result.score}/100
                            </div>
                            <div className={`text-sm font-medium ${
                              result.isCorrect ? 'text-success-600' : 'text-warning-600'
                            }`}>
                              {result.isCorrect ? 'Phát âm chính xác!' : 'Cần luyện tập thêm'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="text-sm text-neutral-600 mb-1">You said:</p>
                        <p className="font-medium text-neutral-900">{result.transcription}</p>
                      </div>

                      <div className="bg-primary-50 rounded-lg p-4">
                        <p className="text-sm text-primary-600 mb-1">AI Feedback:</p>
                        <p className="text-neutral-900">{result.feedback}</p>
                      </div>

                      {result.specificErrors && (
                        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                          <p className="text-sm text-warning-600 mb-1">Specific Errors:</p>
                          <p className="text-neutral-900">{result.specificErrors}</p>
                        </div>
                      )}

                      {result.suggestions && (
                        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                          <p className="text-sm text-success-600 mb-1">Pronunciation Tips:</p>
                          <p className="text-neutral-900">{result.suggestions}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-center space-x-4 pt-4">
                        <button
                          onClick={() => {
                            setResult(null)
                            clearRecording()
                          }}
                          className="btn-secondary"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={() => setCurrentView('vocabulary')}
                          className="btn-primary"
                        >
                          Practice Another Word
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          🎯 Practice Page Loading...
        </h1>
        <p className="text-neutral-600">
          Please wait while we load the practice content.
        </p>
      </div>
    </div>
  )
}

export default PracticePageNew