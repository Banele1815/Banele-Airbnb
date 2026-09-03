import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import {
  FiList, FiUsers, FiCalendar, FiArrowRight,
  FiDollarSign, FiTrendingUp, FiPlus, FiEye,
  FiHome, FiStar,
} from 'react-icons/fi'
import { getAdminStats } from '../../services/adminService'

// Status badge colours
const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-green-50  text-green-700',
  cancelled: 'bg-gray-100  text-gray-600',
  completed: 'bg-blue-50   text-blue-700',
}

// Booking status stacked bar chart (pure CSS — no extra libraries)
function StatusChart({ breakdown }) {
  const statuses = [
    { key: 'confirmed', label: 'Confirmed', colour: 'bg-green-500' },
    { key: 'pending',   label: 'Pending',   colour: 'bg-yellow-400' },
    { key: 'completed', label: 'Completed', colour: 'bg-blue-500' },
    { key: 'cancelled', label: 'Cancelled', colour: 'bg-gray-300' },
  ]

  const total = statuses.reduce((sum, s) => sum + (breakdown[s.key] ?? 0), 0)

  return (
    <div>
      {/* Stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-100 mb-4">
        {total === 0 ? (
          <div className="flex-1 bg-gray-200" />
        ) : (
          statuses.map(({ key, colour }) => {
            const pct = ((breakdown[key] ?? 0) / total) * 100
            return pct > 0 ? (
              <div
                key={key}
                className={`${colour} transition-all`}
                style={{ width: `${pct}%` }}
                title={`${key}: ${breakdown[key]}`}
              />
            ) : null
          })
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {statuses.map(({ key, label, colour }) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${colour}`} />
            <span className="text-xs text-airbnb-gray">{label}</span>
            <span className="ml-auto text-xs font-semibold text-airbnb-dark">
              {breakdown[key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton loader for a single stat card
function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-7 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError('Could not load dashboard data. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      label: 'Total Listings',
      value: stats?.listings,
      icon: FiHome,
      to: '/admin/listings',
      colour: 'bg-rose-50 text-airbnb-red',
      note: 'Active properties',
    },
    {
      label: 'Total Users',
      value: stats?.users,
      icon: FiUsers,
      to: '/admin/users',
      colour: 'bg-blue-50 text-blue-600',
      note: `+${stats?.newUsersThisMonth ?? 0} this month`,
    },
    {
      label: 'Total Bookings',
      value: stats?.bookings,
      icon: FiCalendar,
      to: '/admin/bookings',
      colour: 'bg-green-50 text-green-600',
      note: `${stats?.statusBreakdown?.confirmed ?? 0} confirmed`,
    },
    {
      label: 'Total Revenue',
      value: stats?.revenue != null
        ? `R${stats.revenue.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`
        : null,
      icon: FiDollarSign,
      to: '/admin/bookings',
      colour: 'bg-purple-50 text-purple-600',
      note: 'Confirmed + completed',
    },
  ]

  return (
    <div className="space-y-8">

      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-airbnb-dark">Overview</h2>
          <p className="text-airbnb-gray text-sm mt-1">
            Welcome to the admin dashboard — here's what's happening.
          </p>
        </div>
        <Link
          to="/listings/new"
          className="btn-primary text-sm flex items-center gap-2 w-fit"
        >
          <FiPlus size={15} /> Add new listing
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map(({ label, value, icon: Icon, to, colour, note }) => (
            <Link
              key={label}
              to={to}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow flex items-start gap-4 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colour}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-airbnb-gray font-medium uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-3xl font-bold text-airbnb-dark mt-0.5 truncate">
                  {value != null ? value : '—'}
                </p>
                <p className="text-xs text-airbnb-gray mt-1">{note}</p>
              </div>
              <FiArrowRight
                size={15}
                className="text-airbnb-gray group-hover:text-airbnb-dark transition-colors mt-1 flex-shrink-0"
              />
            </Link>
          ))}
      </div>

      {/* Middle row: chart + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Booking status breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FiTrendingUp size={18} className="text-airbnb-red" />
              <h3 className="text-base font-semibold text-airbnb-dark">Booking Status Breakdown</h3>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs text-airbnb-red font-medium hover:underline flex items-center gap-1"
            >
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded-full" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <StatusChart breakdown={stats?.statusBreakdown ?? {}} />
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-airbnb-dark mb-5">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to="/listings/new"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-airbnb-red text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <FiPlus size={16} /> Add new listing
            </Link>
            <Link
              to="/admin/listings"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 text-airbnb-dark text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <FiList size={16} /> Manage listings
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 text-airbnb-dark text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <FiUsers size={16} /> Manage users
            </Link>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 text-airbnb-dark text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <FiCalendar size={16} /> View all bookings
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-50 text-airbnb-dark text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <FiEye size={16} /> View live site
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom row: recent bookings + recent listings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-airbnb-dark">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-xs text-airbnb-red font-medium hover:underline flex items-center gap-1">
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : !stats?.recentBookings?.length ? (
            <p className="text-center text-airbnb-gray text-sm py-10">No bookings yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentBookings.map((b) => (
                <div key={b._id} className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-airbnb-red text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {b.guest?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-airbnb-dark truncate">
                      {b.guest?.name ?? 'Unknown guest'}
                    </p>
                    <p className="text-xs text-airbnb-gray truncate">
                      {b.listing?.title ?? 'Unknown listing'}
                      {b.checkIn && (
                        <span className="ml-1">
                          · {format(new Date(b.checkIn), 'd MMM')}
                          {' → '}
                          {format(new Date(b.checkOut), 'd MMM yyyy')}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[b.status] ?? ''}`}>
                      {b.status}
                    </span>
                    <p className="text-xs text-airbnb-gray mt-1">
                      R{(b.totalPrice ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent listings */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-airbnb-dark">Recent Listings</h3>
            <Link to="/admin/listings" className="text-xs text-airbnb-red font-medium hover:underline flex items-center gap-1">
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="h-5 w-14 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : !stats?.recentListings?.length ? (
            <p className="text-center text-airbnb-gray text-sm py-10">No listings yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentListings.map((l) => (
                <Link
                  key={l._id}
                  to={`/listings/${l._id}`}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={l.photos?.[0] ?? '/placeholder-home.svg'}
                    alt={l.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = '/placeholder-home.svg' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-airbnb-dark truncate">{l.title}</p>
                    <p className="text-xs text-airbnb-gray truncate">
                      {l.location}
                      {l.host?.name && <span> · {l.host.name}</span>}
                    </p>
                    <p className="text-xs text-airbnb-gray mt-0.5 capitalize">{l.propertyType}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-airbnb-dark">
                      R{(l.pricePerNight ?? 0).toLocaleString()}
                      <span className="text-xs font-normal text-airbnb-gray">/night</span>
                    </p>
                    {l.avgRating > 0 && (
                      <p className="text-xs text-airbnb-gray mt-0.5 flex items-center justify-end gap-0.5">
                        <FiStar size={11} className="text-airbnb-red" />
                        {l.avgRating.toFixed(1)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
