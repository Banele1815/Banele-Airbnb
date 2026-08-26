import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi'
import { getMyBookings, cancelBooking } from '../services/bookingService'
import StarRating from '../components/common/StarRating'
import { createReview } from '../services/reviewService'

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-gray-100 text-airbnb-gray border border-gray-200',
  completed: 'bg-blue-50 text-blue-700 border border-blue-200',
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [reviewModal, setReviewModal] = useState(null) // { bookingId, listingId }
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getMyBookings()
        setBookings(data)
      } catch (err) {
        console.error('Failed to load bookings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const now = new Date()
  const upcoming = bookings.filter(
    (b) => new Date(b.checkOut) >= now && b.status !== 'cancelled'
  )
  const past = bookings.filter(
    (b) => new Date(b.checkOut) < now || b.status === 'cancelled'
  )
  const displayed = activeTab === 'upcoming' ? upcoming : past

  async function handleCancel(bookingId) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await cancelBooking(bookingId)
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      )
    } catch (err) {
      console.error('Cancel failed', err)
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault()
    setReviewLoading(true)
    try {
      await createReview({
        listing: reviewModal.listingId,
        booking: reviewModal.bookingId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      })
      setReviewModal(null)
      setReviewData({ rating: 5, comment: '' })
    } catch (err) {
      console.error('Review failed', err)
    } finally {
      setReviewLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-airbnb-dark mb-6">My bookings</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-airbnb-light mb-6">
        {['upcoming', 'past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-airbnb-dark text-airbnb-dark'
                : 'border-transparent text-airbnb-gray hover:text-airbnb-dark'
            }`}
          >
            {tab} ({tab === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-100 rounded-2xl">
              <div className="w-28 h-28 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-airbnb-gray">
          <p className="text-xl mb-2">No {activeTab} bookings</p>
          {activeTab === 'upcoming' && (
            <Link to="/listings" className="text-sm underline hover:no-underline text-airbnb-dark">
              Browse stays
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((booking) => (
            <div key={booking._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
              {/* Photo */}
              <Link to={`/listings/${booking.listing?._id}`} className="flex-shrink-0">
                <img
                  src={booking.listing?.photos?.[0] || '/placeholder-home.jpg'}
                  alt={booking.listing?.title}
                  className="w-full sm:w-28 h-28 object-cover rounded-xl"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/listings/${booking.listing?._id}`}
                    className="font-semibold text-airbnb-dark hover:underline truncate"
                  >
                    {booking.listing?.title}
                  </Link>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[booking.status] || ''}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-airbnb-gray mt-1">
                  <FiMapPin size={12} />
                  <span>{booking.listing?.location}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-airbnb-gray mt-2">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    <span>
                      {format(new Date(booking.checkIn), 'd MMM')} – {format(new Date(booking.checkOut), 'd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers size={12} />
                    <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-airbnb-dark mt-2">
                  R{booking.totalPrice?.toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 sm:gap-2 justify-end flex-shrink-0">
                {booking.status === 'confirmed' && new Date(booking.checkIn) > now && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {booking.status === 'completed' && !booking.reviewed && (
                  <button
                    onClick={() => setReviewModal({ bookingId: booking._id, listingId: booking.listing?._id })}
                    className="text-xs px-3 py-1.5 rounded-lg border border-airbnb-dark text-airbnb-dark hover:bg-gray-50 transition-colors"
                  >
                    Leave review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-airbnb-dark mb-4">Leave a review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-airbnb-dark mb-2">Rating</label>
                <StarRating
                  value={reviewData.rating}
                  onChange={(r) => setReviewData((prev) => ({ ...prev, rating: r }))}
                />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-airbnb-dark mb-1">Comment</label>
                <textarea
                  id="comment"
                  rows={4}
                  value={reviewData.comment}
                  onChange={(e) => setReviewData((prev) => ({ ...prev, comment: e.target.value }))}
                  className="input-field resize-none"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" disabled={reviewLoading} className="btn-primary flex-1">
                  {reviewLoading ? 'Submitting...' : 'Submit review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
