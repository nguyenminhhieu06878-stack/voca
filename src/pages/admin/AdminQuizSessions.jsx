import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  Trophy, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminQuizSessions = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedMode, setSelectedMode] = useState('')
  const [selectedSession, setSelectedSession] = useState(null)
  const queryClient = useQueryClient()

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ['admin-quiz-sessions', { page: currentPage, userId: selectedUserId, mode: selectedMode }],
    queryFn: () => adminService.getQuizSessions({ 
      page: currentPage, 
      limit: 20,
      userId: selectedUserId || undefined,
      practiceMode: selectedMode || undefined
    }),
  })

  const { data: usersData } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => adminService.getUsers({ limit: 100 }),
  })

  // Delete quiz session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: adminService.deleteQuizSession,
    onSuccess: () => {
      toast.success('Quiz session deleted successfully')
      queryClient.invalidateQueries(['admin-quiz-sessions'])
      setSelectedSession(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete quiz session')
    }
  })

  const handleDeleteSession = (sessionId, userName) => {
    if (window.confirm(`Are you sure you want to delete this quiz session for "${userName}"?`)) {
      deleteSessionMutation.mutate(sessionId)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600 bg-success-50 border-success-200'
    if (score >= 60) return 'text-warning-600 bg-warning-50 border-warning-200'
    return 'text-error-600 bg-error-50 border-error-200'
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading quiz sessions..." />
  }

  const sessions = sessionsData?.sessions || []
  const pagination = sessionsData?.pagination || {}
  const users = usersData?.users || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
          <Trophy className="mr-3 h-6 w-6" />
          Quiz Sessions
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Monitor all quiz sessions and results
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value)
                  setCurrentPage(1)
                }}
                className="input pl-10 pr-8"
              >
                <option value="">All Modes</option>
                <option value="single_word">Single Word</option>
                <option value="phrase_sentence">Phrase & Sentence</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {session.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{session.user.name}</p>
                          <p className="text-sm text-neutral-500">{session.user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="btn-ghost btn-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSession(session.id, session.user.name)}
                          disabled={deleteSessionMutation.isLoading}
                          className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-center p-2 bg-neutral-50 rounded">
                        <p className="text-xs text-neutral-500">Mode</p>
                        <p className="text-sm font-medium text-neutral-900 capitalize">
                          {session.practiceMode.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <div className="text-center p-2 bg-neutral-50 rounded">
                        <p className="text-xs text-neutral-500">Category</p>
                        <p className="text-sm font-medium text-neutral-900 capitalize">
                          {session.category}
                        </p>
                      </div>
                      
                      <div className="text-center p-2 bg-neutral-50 rounded">
                        <p className="text-xs text-neutral-500">Score</p>
                        <p className={`text-sm font-bold ${
                          session.totalScore >= 80 ? 'text-success-600' :
                          session.totalScore >= 60 ? 'text-warning-600' : 'text-error-600'
                        }`}>
                          {session.totalScore}%
                        </p>
                      </div>
                      
                      <div className="text-center p-2 bg-neutral-50 rounded">
                        <p className="text-xs text-neutral-500">Correct</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {session.correctCount}/{session.totalQuestions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(session.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.timeSpent ? `${Math.round(session.timeSpent / 60)}m` : 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sessions.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-500 mb-2">
                    No quiz sessions found
                  </h3>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">
                    Page {pagination.page} of {pagination.pages} ({pagination.total} sessions)
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
        </div>

        {/* Session Details Sidebar */}
        <div>
          {selectedSession ? (
            <div className="card sticky top-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Session Details</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-600 mb-1">Total Score</p>
                    <p className="text-3xl font-bold text-primary-900">{selectedSession.totalScore}%</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-success-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-success-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-success-900">{selectedSession.correctCount}</p>
                      <p className="text-xs text-success-600">Correct</p>
                    </div>
                    
                    <div className="text-center p-3 bg-error-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-error-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-error-900">
                        {selectedSession.totalQuestions - selectedSession.correctCount}
                      </p>
                      <p className="text-xs text-error-600">Incorrect</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <h4 className="font-medium text-neutral-900 mb-3">Session Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Mode:</span>
                        <span className="text-neutral-900 font-medium capitalize">
                          {selectedSession.practiceMode.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Category:</span>
                        <span className="text-neutral-900 font-medium capitalize">
                          {selectedSession.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Questions:</span>
                        <span className="text-neutral-900 font-medium">
                          {selectedSession.totalQuestions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Time Spent:</span>
                        <span className="text-neutral-900 font-medium">
                          {selectedSession.timeSpent ? `${Math.round(selectedSession.timeSpent / 60)} min` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Completed:</span>
                        <span className="text-neutral-900 font-medium">
                          {new Date(selectedSession.completedAt || selectedSession.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="p-6">
                <div className="text-center py-8 text-neutral-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                  <p>Select a session to view details</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminQuizSessions
