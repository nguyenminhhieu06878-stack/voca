import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import { 
  BarChart3, 
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const AdminAnalytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminService.getAnalytics,
  })

  if (isLoading) {
    return <LoadingSpinner text="Loading analytics..." />
  }

  const { 
    practicesByDay, 
    practicesByCategory, 
    scoreDistribution,
    userGrowth,
    topCategories,
    averageScoreByCategory
  } = analyticsData || {}

  // Practices by Day (Line Chart)
  const practicesByDayData = {
    labels: practicesByDay?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Practices',
        data: practicesByDay?.map(d => d.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Category Performance (Bar Chart)
  const categoryPerformanceData = {
    labels: averageScoreByCategory?.map(c => c.category.charAt(0).toUpperCase() + c.category.slice(1)) || [],
    datasets: [
      {
        label: 'Average Score',
        data: averageScoreByCategory?.map(c => c.avgScore) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }

  // Score Distribution (Doughnut Chart)
  const scoreDistributionData = {
    labels: ['Excellent (90-100)', 'Good (70-89)', 'Fair (50-69)', 'Poor (0-49)'],
    datasets: [
      {
        data: [
          scoreDistribution?.excellent || 0,
          scoreDistribution?.good || 0,
          scoreDistribution?.fair || 0,
          scoreDistribution?.poor || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  // Top Categories (Pie Chart)
  const topCategoriesData = {
    labels: topCategories?.map(c => c.category.charAt(0).toUpperCase() + c.category.slice(1)) || [],
    datasets: [
      {
        data: topCategories?.map(c => c.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  }

  // User Growth (Line Chart)
  const userGrowthData = {
    labels: userGrowth?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'New Users',
        data: userGrowth?.map(d => d.count) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 flex items-center">
          <BarChart3 className="mr-3 h-6 w-6" />
          Analytics & Reports
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Detailed insights and performance metrics
        </p>
      </div>

      {/* Practice Activity */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Activity className="mr-2 h-5 w-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-neutral-900">Practice Activity (Last 30 Days)</h3>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={practicesByDayData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="mr-2 h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Average Score by Category</h3>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={categoryPerformanceData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <PieChart className="mr-2 h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Score Distribution</h3>
            </div>
            <div style={{ height: '300px' }}>
              <Doughnut data={scoreDistributionData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <PieChart className="mr-2 h-5 w-5 text-success-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Most Practiced Categories</h3>
            </div>
            <div style={{ height: '300px' }}>
              <Pie data={topCategoriesData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="mr-2 h-5 w-5 text-success-500" />
              <h3 className="text-lg font-semibold text-neutral-900">User Growth (Last 30 Days)</h3>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
