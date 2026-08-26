import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiList, FiUsers, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { getAdminStats } from '../../services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Listings', value: stats?.listings, icon: FiList, to: '/admin/listings', color: 'bg-rose-50 text-airbnb-red' },
    { label: 'Total Users', value: stats?.users, icon: FiUsers, to: '/admin/users', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Bookings', value: stats?.bookings, icon: FiCalendar, to: '/admin/bookings', color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-airbnb-dark">Overview</h2>
        <p className="text-airbnb-gray text-sm mt-1">Welcome to the admin dashboard.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-airbnb-gray font-medium uppercase tracking-wide">{label}</p>
              <p className="text-3xl font-bold text-airbnb-dark mt-0.5">
                {loading ? '—' : (value ?? 0).toLocaleString()}
              </p>
            </div>
            <FiArrowRight size={16} className="text-airbnb-gray" />
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-airbnb-dark mb-4">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/listings" className="btn-primary text-sm px-4 py-2 rounded-lg inline-block">
            Manage listings
          </Link>
          <Link to="/admin/users" className="btn-secondary text-sm px-4 py-2 rounded-lg inline-block">
            Manage users
          </Link>
          <Link to="/listings/new" className="btn-secondary text-sm px-4 py-2 rounded-lg inline-block">
            Add new listing
          </Link>
        </div>
      </div>
    </div>
  )
}
