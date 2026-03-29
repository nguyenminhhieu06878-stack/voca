import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
  })

  if (isLoading) {
    return <LoadingSpinner text="Loading admin dashboard..." />
  }

  const { overview, topPerformers, practicesByCategory, dailyStats } = dashboardData || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Overview
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          System overview and analytics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Users</p>
                <p className="text-2xl font-semibold text-neutral-900 mt-1">
                  {overview?.totalUsers || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Vocabulary Words</p>
                <p className="text-2xl font-semibold text-neutral-900 mt-1">
                  {overview?.totalVocabulary || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-success-50 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-success-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Practices</p>
                <p className="text-2xl font-semibold text-neutral-900 mt-1">
                  {overview?.totalPractices || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-neutral-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">New Users (7d)</p>
                <p className="text-2xl font-semibold text-neutral-900 mt-1">
                  {overview?.recentUsers || 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-warning-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Award className="mr-2 h-5 w-5 text-warning-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Top Performers</h3>
            </div>
            <div className="space-y-3">
              {topPerformers?.slice(0, 5).map((performer, index) => (
                <div key={performer.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{performer.name}</p>
                      <p className="text-sm text-neutral-500">{performer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">{performer.averageScore}%</p>
                    <p className="text-sm text-neutral-500">{performer.practiceCount} practices</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="mr-2 h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Category Performance</h3>
            </div>
            <div className="space-y-4">
              {practicesByCategory?.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700 capitalize">
                      {category.category}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {category.accuracy}% accuracy
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.accuracy}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{category.totalPractices} practices</span>
                    <span>Avg: {category.averageScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      {dailyStats && dailyStats.length > 0 && (
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="mr-2 h-5 w-5 text-success-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Daily Activity (Last 30 Days)</h3>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {dailyStats.slice(0, 30).map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-neutral-500">
                    {new Date(stat.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div 
                    className="bg-primary-100 rounded text-xs py-1 px-2 font-medium"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${Math.min(stat.practices / 10, 1)})`,
                      color: stat.practices > 5 ? 'white' : '#171717'
                    }}
                  >
                    {stat.practices}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard