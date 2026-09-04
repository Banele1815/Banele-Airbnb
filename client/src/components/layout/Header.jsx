import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiGlobe, FiMenu, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-airbnb-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5">
            <img src={logo} alt="Banele Airbnb" className="h-8 w-8 object-contain" />
            <span className="text-airbnb-red font-bold text-xl hidden sm:block">Banele</span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer px-4 py-2 gap-2 text-sm font-medium">
            <Link to="/listings" className="flex items-center gap-4">
              <span className="px-3 border-r border-gray-300">Anywhere</span>
              <span className="px-3 border-r border-gray-300">Any week</span>
              <span className="px-3 text-airbnb-gray">Add guests</span>
              <span className="bg-airbnb-red text-white p-2 rounded-full">
                <svg viewBox="0 0 32 32" className="h-3 w-3 fill-white">
                  <path d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13c3.09 0 5.93-1.08 8.15-2.88l7.37 7.37 1.41-1.41-7.37-7.37A12.95 12.95 0 0 0 26 13C26 5.82 20.18 0 13 0zm0 2c6.07 0 11 4.93 11 11S19.07 24 13 24 2 19.07 2 13 6.93 2 13 2z"/>
                </svg>
              </span>
            </Link>
          </div>

          {/* Right nav */}
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden md:block text-sm font-medium text-airbnb-red hover:bg-rose-50 rounded-full px-4 py-2 transition-colors"
              >
                Admin
              </Link>
            )}
            {user?.role === 'host' && (
              <Link
                to="/listings/new"
                className="hidden md:block text-sm font-medium text-airbnb-dark hover:bg-gray-100 rounded-full px-4 py-2 transition-colors"
              >
                Add your home
              </Link>
            )}
            {!user && (
              <Link
                to="/register"
                className="hidden md:block text-sm font-medium text-airbnb-dark hover:bg-gray-100 rounded-full px-4 py-2 transition-colors"
              >
                Become a host
              </Link>
            )}
            <button className="hidden md:flex items-center text-airbnb-dark hover:bg-gray-100 rounded-full p-2 transition-colors">
              <FiGlobe size={18} />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 hover:shadow-md transition-shadow"
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                <FiMenu size={16} className="text-airbnb-dark" />
                <div className="bg-airbnb-gray rounded-full p-1">
                  <FiUser size={16} className="text-white" />
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-airbnb-dark border-b border-gray-100">
                        {user.name}
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-airbnb-red hover:bg-gray-50"
                        >
                          Admin dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-airbnb-dark hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-airbnb-dark hover:bg-gray-50"
                      >
                        My bookings
                      </Link>
                      {user.role === 'host' && (
                        <Link
                          to="/listings/new"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-airbnb-dark hover:bg-gray-50"
                        >
                          Add listing
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-airbnb-dark hover:bg-gray-50 border-t border-gray-100"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-airbnb-dark hover:bg-gray-50"
                      >
                        Sign up
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-airbnb-dark hover:bg-gray-50"
                      >
                        Log in
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          to="/register"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-airbnb-dark hover:bg-gray-50"
                        >
                          Become a host
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
