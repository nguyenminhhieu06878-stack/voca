import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit3, 
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Save
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminVocabulary = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVocab, setEditingVocab] = useState(null)
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    category: '',
    difficulty: 'easy',
    phonetic: '',
    example: '',
    audioUrl: ''
  })

  // Fetch vocabulary
  const { data: vocabData, isLoading } = useQuery({
    queryKey: ['admin-vocabulary', { page: currentPage, search: searchTerm, category: selectedCategory }],
    queryFn: () => adminService.getVocabulary({ 
      page: currentPage, 
      limit: 15,
      search: searchTerm || undefined,
      category: selectedCategory || undefined
    }),
  })

  // Add vocabulary mutation
  const addVocabMutation = useMutation({
    mutationFn: adminService.addVocabulary,
    onSuccess: () => {
      toast.success('Vocabulary added successfully')
      queryClient.invalidateQueries(['admin-vocabulary'])
      setShowAddModal(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add vocabulary')
    }
  })

  // Update vocabulary mutation
  const updateVocabMutation = useMutation({
    mutationFn: ({ id, data }) => adminService.updateVocabulary(id, data),
    onSuccess: () => {
      toast.success('Vocabulary updated successfully')
      queryClient.invalidateQueries(['admin-vocabulary'])
      setEditingVocab(null)
      resetForm()
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update vocabulary')
    }
  })

  // Delete vocabulary mutation
  const deleteVocabMutation = useMutation({
    mutationFn: adminService.deleteVocabulary,
    onSuccess: () => {
      toast.success('Vocabulary deleted successfully')
      queryClient.invalidateQueries(['admin-vocabulary'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete vocabulary')
    }
  })

  const resetForm = () => {
    setFormData({
      word: '',
      translation: '',
      category: '',
      difficulty: 'easy',
      phonetic: '',
      example: '',
      audioUrl: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.word || !formData.translation || !formData.category) {
      toast.error('Word, translation, and category are required')
      return
    }

    if (editingVocab) {
      updateVocabMutation.mutate({ id: editingVocab.id, data: formData })
    } else {
      addVocabMutation.mutate(formData)
    }
  }

  const handleEdit = (vocab) => {
    setEditingVocab(vocab)
    setFormData({
      word: vocab.word,
      translation: vocab.translation,
      category: vocab.category,
      difficulty: vocab.difficulty,
      phonetic: vocab.phonetic || '',
      example: vocab.example || '',
      audioUrl: vocab.audioUrl || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = (vocab) => {
    if (window.confirm(`Are you sure you want to delete "${vocab.word}"?`)) {
      deleteVocabMutation.mutate(vocab.id)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading vocabulary..." />
  }

  const vocabulary = vocabData?.vocabulary || []
  const pagination = vocabData?.pagination || {}

  const categories = ['animals', 'colors', 'numbers', 'food', 'family', 'body', 'school']
  const difficulties = ['easy', 'medium', 'hard']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
            <BookOpen className="mr-3 h-6 w-6" />
            Vocabulary Management
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage vocabulary words and categories
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingVocab(null)
            resetForm()
            setShowAddModal(true)
          }}
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vocabulary
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search vocabulary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                className="input pl-10 pr-8"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Table */}
      <div className="card">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Word</th>
                  <th className="table-head">Translation</th>
                  <th className="table-head">Category</th>
                  <th className="table-head">Difficulty</th>
                  <th className="table-head">Practices</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {vocabulary.map((vocab) => (
                  <tr key={vocab.id} className="table-row">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-neutral-900">{vocab.word}</p>
                        {vocab.phonetic && (
                          <p className="text-sm text-primary-600 font-mono">{vocab.phonetic}</p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <p className="text-neutral-900">{vocab.translation}</p>
                    </td>
                    <td className="table-cell">
                      <span className="badge badge-secondary capitalize">
                        {vocab.category}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge capitalize ${
                        vocab.difficulty === 'easy' ? 'bg-success-100 text-success-800 border-success-200' :
                        vocab.difficulty === 'medium' ? 'bg-warning-100 text-warning-800 border-warning-200' :
                        'bg-error-100 text-error-800 border-error-200'
                      }`}>
                        {vocab.difficulty}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-neutral-900 font-medium">
                        {vocab._count.practices}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(vocab)}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(vocab)}
                          className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                          title="Delete"
                          disabled={deleteVocabMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
              <div className="text-sm text-neutral-600">
                Page {pagination.page} of {pagination.pages} 
                ({pagination.total} words)
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="btn-ghost btn-sm disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium">
                  {currentPage}
                </span>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= pagination.pages}
                  className="btn-ghost btn-sm disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {editingVocab ? 'Edit Vocabulary' : 'Add New Vocabulary'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingVocab(null)
                    resetForm()
                  }}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Word */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Word *
                  </label>
                  <input
                    type="text"
                    value={formData.word}
                    onChange={(e) => setFormData({...formData, word: e.target.value})}
                    className="input"
                    placeholder="Enter English word"
                    required
                  />
                </div>

                {/* Translation */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Translation *
                  </label>
                  <input
                    type="text"
                    value={formData.translation}
                    onChange={(e) => setFormData({...formData, translation: e.target.value})}
                    className="input"
                    placeholder="Enter Vietnamese translation"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="input"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phonetic */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phonetic (IPA)
                  </label>
                  <input
                    type="text"
                    value={formData.phonetic}
                    onChange={(e) => setFormData({...formData, phonetic: e.target.value})}
                    className="input"
                    placeholder="e.g., /kæt/"
                  />
                </div>

                {/* Example */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Example Sentence
                  </label>
                  <input
                    type="text"
                    value={formData.example}
                    onChange={(e) => setFormData({...formData, example: e.target.value})}
                    className="input"
                    placeholder="Example sentence using the word"
                  />
                </div>

                {/* Audio URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Audio URL
                  </label>
                  <input
                    type="url"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({...formData, audioUrl: e.target.value})}
                    className="input"
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={addVocabMutation.isLoading || updateVocabMutation.isLoading}
                    className="flex-1 btn-primary"
                  >
                    {(addVocabMutation.isLoading || updateVocabMutation.isLoading) ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner mr-2"></div>
                        {editingVocab ? 'Updating...' : 'Adding...'}
                      </div>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingVocab ? 'Update' : 'Add'} Vocabulary
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingVocab(null)
                      resetForm()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminVocabulary