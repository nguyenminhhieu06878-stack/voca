import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  Target, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  BookOpen,
  Star,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminPractices = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const queryClient = useQueryClient()

  // Fetch practices
  const { data: practicesData, isLoading } = useQuery({
    queryKey: ['admin-practices', { page: currentPage, userId: selectedUserId, category: selectedCategory }],
    queryFn: () => adminService.getPractices({ 
      page: currentPage, 
      limit: 20,
      userId: selectedUserId || undefined,
      category: selectedCategory || undefined
    }),
  })

  // Fetch users for filter
  const { data: usersData } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => adminService.getUsers({ limit: 100 }),
  })

  // Delete practice mutation
  const deletePracticeMutation = useMutation({
    mutationFn: adminService.deletePractice,
    onSuccess: () => {
      toast.success('Practice deleted successfully')
      queryClient.invalidateQueries(['admin-practices'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete practice')
    }
  })

  const handleDeletePractice = (practiceId, word) => {
    if (window.confirm(`Are you sure you want to delete this practice for "${word}"?`)) {
      deletePracticeMutation.mutate(practiceId)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🌟'
    if (score >= 70) return '👍'
    if (score >= 50) return '👌'
    return '💪'
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading practices..." />
  }

  const practices = practicesData?.practices || []
  const pagination = practicesData?.pagination || {}
  const users = usersData?.users || []

  const categories = ['animals', 'colors', 'numbers', 'food', 'family', 'body', 'school']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
          <Target className="mr-3 h-6 w-6" />
          Practice Sessions
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Monitor all pronunciation practice sessions
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Filter */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value)
                  setCurrentPage(1)
                }}
                className="input pl-10 pr-8"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

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

      {/* Practices Table */}
      <div className="card">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">User</th>
                  <th className="table-head">Word</th>
                  <th className="table-head">Transcription</th>
                  <th className="table-head">Score</th>
                  <th className="table-head">Result</th>
                  <th className="table-head">Date</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {practices.map((practice) => (
                  <tr key={practice.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {practice.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 text-sm">{practice.user.name}</p>
                          <p className="text-xs text-neutral-500">{practice.user.email}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-neutral-900">{practice.vocabulary.word}</p>
                        <p className="text-sm text-neutral-500">{practice.vocabulary.translation}</p>
                        <span className="badge badge-secondary capitalize mt-1">
                          {practice.vocabulary.category}
                        </span>
                      </div>
                    </td>
                    
                    <td className="table-cell">
                      <p className="text-neutral-900 font-mono text-sm">
                        "{practice.transcription}"
                      </p>
                    </td>
                    
                    <td className="table-cell">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(practice.score)}`}>
                        <Star className="mr-1 h-3 w-3" />
                        {practice.score} {getScoreEmoji(practice.score)}
                      </div>
                    </td>
                    
                    <td className="table-cell">
                      <div className="flex items-center">
                        {practice.isCorrect ? (
                          <div className="flex items-center text-success-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-error-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Incorrect</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(practice.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    
                    <td className="table-cell">
                      <button
                        onClick={() => handleDeletePractice(practice.id, practice.vocabulary.word)}
                        disabled={deletePracticeMutation.isLoading}
                        className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete Practice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {practices.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-500 mb-2">
                No practice sessions found
              </h3>
              <p className="text-neutral-400">
                Practice sessions will appear here once users start practicing
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
              <div className="text-sm text-neutral-600">
                Page {pagination.page} of {pagination.pages} 
                ({pagination.total} practices)
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

      {/* Practice Details Modal - Could be added later */}
      {/* You can expand this to show detailed feedback for each practice */}
    </div>
  )
}

export default AdminPractices