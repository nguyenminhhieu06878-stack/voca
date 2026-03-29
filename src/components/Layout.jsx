import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className={isHomePage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout