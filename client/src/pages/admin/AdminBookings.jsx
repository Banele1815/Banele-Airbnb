import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { FiSearch } from 'react-icons/fi'
import { getAdminBookings } from '../../services/adminService'

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-airbnb-gray',
  completed: 'bg-blue-50 text-blue-700',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAdminBookings()
      .then((data) => { setBookings(data); setFiltered(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      bookings.filter(
        (b) =>
          b.listing?.title?.toLowerCase().includes(q) ||
          b.guest?.name?.toLowerCase().includes(q) ||
          b.guest?.email?.toLowerCase().includes(q)
      )
    )
  }, [search, bookings])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-airbnb-dark">All Bookings</h2>

      <div className="relative">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-airbnb-gray" />
        <input
          type="text"
          placeholder="Search by listing or guest…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-airbnb-gray">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-airbnb-gray">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">Listing</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden sm:table-cell">Guest</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden md:table-cell">Dates</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-airbnb-dark truncate max-w-[160px]">{b.listing?.title || '—'}</p>
                      <p className="text-xs text-airbnb-gray">{b.listing?.location}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-airbnb-dark">{b.guest?.name || '—'}</p>
                      <p className="text-xs text-airbnb-gray">{b.guest?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-airbnb-gray text-xs hidden md:table-cell">
                      {format(new Date(b.checkIn), 'd MMM yyyy')} →{' '}
                      {format(new Date(b.checkOut), 'd MMM yyyy')}
                    </td>
                    <td className="px-4 py-3 font-medium text-airbnb-dark">
                      R{b.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[b.status] || ''}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-airbnb-gray">Showing {filtered.length} of {bookings.length} bookings</p>
    </div>
  )
}
