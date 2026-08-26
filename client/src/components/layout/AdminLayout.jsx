import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiList, FiUsers, FiCalendar,
  FiLogOut, FiMenu, FiX, FiHome,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { to: '/admin/listings', label: 'Listings', icon: FiList },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function isActive(to, exact) {
    return exact ? location.pathname === to : location.pathname.startsWith(to)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-airbnb-dark text-white flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="h-7 w-7 fill-airbnb-red">
              <path d="M16 1C10.477 1 6 7.477 6 14c0 7.732 9.057 16.122 9.444 16.484a.75.75 0 0 0 1.112 0C16.943 30.122 26 21.732 26 14c0-6.523-4.477-13-10-13zm0 18.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
            </svg>
            <span className="font-bold text-lg text-white">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-airbnb-red flex items-center justify-center font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/50 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive(to, exact)
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FiHome size={18} /> View site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <FiLogOut size={18} /> Log out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-airbnb-gray hover:text-airbnb-dark"
            aria-label="Open sidebar"
          >
            <FiMenu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-airbnb-dark">
            {NAV.find((n) => isActive(n.to, n.exact))?.label ?? 'Admin'}
          </h1>
          <div className="ml-auto text-sm text-airbnb-gray hidden sm:block">
            Logged in as <span className="font-medium text-airbnb-dark">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
