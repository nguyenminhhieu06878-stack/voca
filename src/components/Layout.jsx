import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main className={isHomePage ? '' : 'max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4'}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout