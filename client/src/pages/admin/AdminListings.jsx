import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi'
import { getAdminListings, adminDeleteListing } from '../../services/adminService'

export default function AdminListings() {
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      listings.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q)
      )
    )
  }, [search, listings])

  async function fetchListings() {
    setLoading(true)
    try {
      const data = await getAdminListings()
      setListings(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return
    setDeleting(id)
    try {
      await adminDeleteListing(id)
      setListings((prev) => prev.filter((l) => l._id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-airbnb-dark">All Listings</h2>
        <Link to="/listings/new" className="btn-primary text-sm flex items-center gap-1 w-fit">
          <FiPlus size={16} /> Add listing
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-airbnb-gray" />
        <input
          type="text"
          placeholder="Search by title or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-airbnb-gray">
            <p>No listings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">Listing</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden sm:table-cell">Host</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">Price/night</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden sm:table-cell">Rating</th>
                  <th className="text-right px-4 py-3 font-medium text-airbnb-gray">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((listing) => (
                  <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.photos?.[0] || '/placeholder-home.svg'}
                          alt={listing.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.src = '/placeholder-home.svg' }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-airbnb-dark truncate max-w-[180px]">{listing.title}</p>
                          <p className="text-xs text-airbnb-gray capitalize">{listing.propertyType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-airbnb-gray hidden md:table-cell">{listing.location}</td>
                    <td className="px-4 py-3 text-airbnb-gray hidden sm:table-cell">{listing.host?.name || '—'}</td>
                    <td className="px-4 py-3 font-medium text-airbnb-dark">
                      R{listing.pricePerNight?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-airbnb-gray hidden sm:table-cell">
                      {listing.avgRating > 0 ? `★ ${listing.avgRating.toFixed(1)}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/listings/${listing._id}/edit`}
                          className="p-1.5 rounded-lg text-airbnb-gray hover:text-airbnb-dark hover:bg-gray-100 transition-colors"
                          title="Edit listing"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          disabled={deleting === listing._id}
                          className="p-1.5 rounded-lg text-airbnb-gray hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete listing"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-airbnb-gray">
        Showing {filtered.length} of {listings.length} listings
      </p>
    </div>
  )
}
