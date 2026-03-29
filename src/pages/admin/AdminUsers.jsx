import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  Users, 
  Search, 
  Eye, 
  Shield, 
  UserCheck,
  Calendar,
  Target,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const queryClient = useQueryClient()

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', { page: currentPage, search: searchTerm }],
    queryFn: () => adminService.getUsers({ 
      page: currentPage, 
      limit: 10,
      search: searchTerm || undefined 
    }),
  })

  // Fetch user details
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ['admin-user-details', selectedUser],
    queryFn: () => adminService.getUserDetails(selectedUser),
    enabled: !!selectedUser,
  })

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminService.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated successfully')
      queryClient.invalidateQueries(['admin-users'])
      queryClient.invalidateQueries(['admin-user-details'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update user role')
    }
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully')
      queryClient.invalidateQueries(['admin-users'])
      setSelectedUser(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete user')
    }
  })

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateRoleMutation.mutate({ userId, role: newRole })
    }
  }

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone and will delete all their data.`)) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading users..." />
  }

  const users = usersData?.users || []
  const pagination = usersData?.pagination || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
          <Users className="mr-3 h-6 w-6" />
          Users Management
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </form>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">User</th>
                      <th className="table-head">Role</th>
                      <th className="table-head">Practices</th>
                      <th className="table-head">Joined</th>
                      <th className="table-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {users.map((user) => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{user.name}</p>
                              <p className="text-sm text-neutral-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`badge ${
                            user.role === 'admin' 
                              ? 'badge-destructive' 
                              : 'badge-secondary'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Student
                              </>
                            )}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="text-neutral-900 font-medium">
                            {user._count.practices}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="text-neutral-500 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedUser(user.id)}
                              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                                title="Make Admin"
                                disabled={updateRoleMutation.isLoading}
                              >
                                <Shield className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                              title="Delete User"
                              disabled={deleteUserMutation.isLoading}
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
                    ({pagination.total} users)
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

        {/* User Details Sidebar */}
        <div className="space-y-6">
          {selectedUser && userDetails ? (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">User Details</h3>
                
                {userDetailsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 pb-4 border-b border-neutral-200">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {userDetails.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{userDetails.user.name}</p>
                        <p className="text-sm text-neutral-500">{userDetails.user.email}</p>
                        <span className={`badge mt-1 ${
                          userDetails.user.role === 'admin' 
                            ? 'badge-destructive' 
                            : 'badge-secondary'
                        }`}>
                          {userDetails.user.role}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary-50 rounded-lg">
                        <Target className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-primary-900">
                          {userDetails.stats.totalPractices}
                        </p>
                        <p className="text-xs text-primary-600">Practices</p>
                      </div>
                      
                      <div className="text-center p-3 bg-success-50 rounded-lg">
                        <UserCheck className="h-5 w-5 text-success-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-success-900">
                          {userDetails.stats.accuracy}%
                        </p>
                        <p className="text-xs text-success-600">Accuracy</p>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                      <p className="text-lg font-bold text-neutral-900">
                        {userDetails.stats.averageScore}
                      </p>
                      <p className="text-xs text-neutral-600">Average Score</p>
                    </div>

                    {/* Account Info */}
                    <div className="space-y-2 pt-4 border-t border-neutral-200">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-neutral-400 mr-2" />
                        <span className="text-neutral-600">Joined:</span>
                        <span className="ml-2 text-neutral-900">
                          {new Date(userDetails.user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Recent Practices */}
                    <div className="pt-4 border-t border-neutral-200">
                      <h4 className="font-medium text-neutral-900 mb-3">Recent Practices</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                        {userDetails.recentPractices.slice(0, 5).map((practice) => (
                          <div key={practice.id} className="flex justify-between items-center p-2 bg-neutral-50 rounded">
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {practice.vocabulary.word}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {practice.vocabulary.translation}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${
                                practice.score >= 80 ? 'text-success-600' : 
                                practice.score >= 60 ? 'text-warning-600' : 'text-error-600'
                              }`}>
                                {practice.score}%
                              </p>
                              <p className="text-xs text-neutral-500">
                                {new Date(practice.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Role Management */}
                    {userDetails.user.role !== 'admin' && (
                      <div className="pt-4 border-t border-neutral-200">
                        <button
                          onClick={() => handleRoleChange(userDetails.user.id, 'admin')}
                          disabled={updateRoleMutation.isLoading}
                          className="w-full btn-destructive text-sm"
                        >
                          {updateRoleMutation.isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="spinner mr-2"></div>
                              Updating...
                            </div>
                          ) : (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="p-6">
                <div className="text-center py-8 text-neutral-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                  <p>Select a user to view details</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsers