import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FiShare2, FiHeart, FiStar, FiMapPin, FiUsers,
  FiBriefcase, FiHome, FiShield, FiCheck, FiChevronDown, FiChevronUp,
} from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useAuth } from '../context/AuthContext'
import { getListing } from '../services/listingService'
import { createBooking } from '../services/bookingService'
import StarRating from '../components/common/StarRating'

const SPECIFIC_RATING_LABELS = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'communication', label: 'Communication' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'location', label: 'Location' },
  { key: 'value', label: 'Value' },
]

function RatingBar({ value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-airbnb-dark rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm text-airbnb-dark w-8 text-right">{value?.toFixed(1)}</span>
    </div>
  )
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [guests, setGuests] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [activePhoto, setActivePhoto] = useState(0)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [showHouseRules, setShowHouseRules] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListing(id)
        setListing(data)
      } catch (err) {
        console.error('Failed to load listing', err)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  const nights = checkIn && checkOut
    ? Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    : 0

  const basePrice = nights * (listing?.pricePerNight || 0)
  const weeklyDiscountAmt = nights >= 7 && listing?.weeklyDiscount
    ? Math.round(basePrice * (listing.weeklyDiscount / 100))
    : 0
  const cleaningFee = listing?.cleaningFee || 0
  const serviceFee = listing?.serviceFee || 0
  const occupancyTaxes = listing?.occupancyTaxes || 0
  const totalPrice = basePrice - weeklyDiscountAmt + cleaningFee + serviceFee + occupancyTaxes

  async function handleBook() {
    if (!user) return navigate('/login')
    if (!checkIn || !checkOut) return setBookingError('Please select check-in and check-out dates.')
    if (nights < 1) return setBookingError('Check-out must be after check-in.')
    setBookingError('')
    setBookingLoading(true)
    try {
      await createBooking({ listing: id, checkIn, checkOut, guests, totalPrice })
      navigate('/my-bookings')
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-2/3" />
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8">
          <div className="col-span-2 bg-gray-200 aspect-[4/3]" />
          <div className="col-span-2 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-gray-200 aspect-[4/3]" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-airbnb-gray">
        <p className="text-xl">Listing not found.</p>
        <Link to="/" className="btn-primary inline-block mt-4">Go home</Link>
      </div>
    )
  }

  const photos = listing.photos?.length ? listing.photos : ['/placeholder-home.jpg']
  const amenities = listing.amenities || []
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Title ── */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-airbnb-dark">{listing.title}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-airbnb-gray flex-wrap">
            {listing.avgRating > 0 && (
              <>
                <FiStar className="text-airbnb-dark fill-airbnb-dark" size={13} />
                <span className="font-medium text-airbnb-dark">{listing.avgRating.toFixed(1)}</span>
                {listing.reviewCount > 0 && <span>· {listing.reviewCount} reviews</span>}
                <span>·</span>
              </>
            )}
            <FiMapPin size={13} />
            <span>{listing.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <button className="flex items-center gap-1 text-sm font-medium underline hover:text-airbnb-dark">
            <FiShare2 size={15} /> Share
          </button>
          <button className="flex items-center gap-1 text-sm font-medium underline hover:text-airbnb-dark">
            <FiHeart size={15} /> Save
          </button>
          {(user?.role === 'host' || user?.role === 'admin') && (
            <Link
              to={`/listings/${id}/edit`}
              className="text-sm font-medium text-airbnb-gray underline hover:text-airbnb-dark"
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* ── Photo gallery ── */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden mb-8 max-h-[480px]">
        <div
          className="col-span-2 row-span-2 cursor-pointer"
          onClick={() => setActivePhoto(0)}
        >
          <img
            src={photos[activePhoto] || photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        {photos.slice(1, 5).map((photo, i) => (
          <div key={i} className="overflow-hidden">
            <img
              src={photo}
              alt={`${listing.title} photo ${i + 2}`}
              className={`w-full h-full object-cover hover:brightness-90 transition-all cursor-pointer ${activePhoto === i + 1 ? 'brightness-75' : ''}`}
              onClick={() => setActivePhoto(i + 1)}
            />
          </div>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Accommodation type & host */}
          <div className="flex items-center justify-between pb-6 border-b border-airbnb-light">
            <div>
              <h2 className="text-xl font-semibold text-airbnb-dark">
                {listing.propertyType} hosted by {listing.host?.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-airbnb-gray mt-1">
                <span>{listing.maxGuests} guests</span>
                <span>·</span>
                <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-airbnb-red text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
              {listing.host?.name?.[0]?.toUpperCase()}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-5 pb-6 border-b border-airbnb-light">
            <div className="flex items-start gap-4">
              <FiHome size={24} className="text-airbnb-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-airbnb-dark">Entire {listing.propertyType?.toLowerCase()}</p>
                <p className="text-sm text-airbnb-gray">You'll have the place to yourself.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiShield size={24} className="text-airbnb-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-airbnb-dark">Enhanced clean</p>
                <p className="text-sm text-airbnb-gray">This host committed to a 5-step enhanced cleaning process.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiBriefcase size={24} className="text-airbnb-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-airbnb-dark">Self check-in</p>
                <p className="text-sm text-airbnb-gray">Check yourself in with the key lockbox.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiUsers size={24} className="text-airbnb-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-airbnb-dark">Up to {listing.maxGuests} guests</p>
                <p className="text-sm text-airbnb-gray">Plenty of room for everyone.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pb-6 border-b border-airbnb-light">
            <p className="text-airbnb-dark leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Where you'll sleep */}
          <div className="pb-6 border-b border-airbnb-light">
            <h3 className="text-xl font-semibold text-airbnb-dark mb-4">Where you'll sleep</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: listing.bedrooms || 1 }, (_, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl p-5">
                  <span className="text-3xl mb-2 block">🛏️</span>
                  <p className="font-medium text-airbnb-dark text-sm">Bedroom {i + 1}</p>
                  <p className="text-xs text-airbnb-gray">1 queen bed</p>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="pb-6 border-b border-airbnb-light">
              <h3 className="text-xl font-semibold text-airbnb-dark mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {visibleAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-airbnb-dark">
                    <FiCheck size={16} className="text-airbnb-dark flex-shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
              {amenities.length > 6 && (
                <button
                  onClick={() => setShowAllAmenities((v) => !v)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  {showAllAmenities ? (
                    <><FiChevronUp size={15} /> Show less</>
                  ) : (
                    <><FiChevronDown size={15} /> Show all {amenities.length} amenities</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* 7 nights summary */}
          {checkIn && checkOut && nights > 0 && (
            <div className="pb-6 border-b border-airbnb-light">
              <h3 className="text-xl font-semibold text-airbnb-dark mb-2">
                {nights} night{nights !== 1 ? 's' : ''} in {listing.location?.split(',')[0]}
              </h3>
              <p className="text-sm text-airbnb-gray">
                {checkIn.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} –{' '}
                {checkOut.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}

          {/* Reviews */}
          {listing.reviews?.length > 0 && (
            <div className="pb-6 border-b border-airbnb-light">
              <div className="flex items-center gap-2 mb-6">
                <FiStar size={20} className="fill-airbnb-dark text-airbnb-dark" />
                <span className="text-xl font-semibold text-airbnb-dark">
                  {listing.avgRating?.toFixed(1)} · {listing.reviews.length} review{listing.reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Specific ratings */}
              {listing.specificRatings && (
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8">
                  {SPECIFIC_RATING_LABELS.map(({ key, label }) => (
                    listing.specificRatings[key] != null && (
                      <div key={key} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-airbnb-dark">{label}</span>
                        <div className="flex items-center gap-2 flex-1">
                          <RatingBar value={listing.specificRatings[key]} />
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listing.reviews.slice(0, 6).map((review) => (
                  <div key={review._id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-airbnb-gray text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {review.guest?.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-airbnb-dark">{review.guest?.name}</p>
                        <p className="text-xs text-airbnb-gray">
                          {new Date(review.createdAt).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly size={14} />
                    <p className="text-sm text-airbnb-dark leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host details */}
          <div className="pb-6 border-b border-airbnb-light">
            <h3 className="text-xl font-semibold text-airbnb-dark mb-4">About your host</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-airbnb-red text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                {listing.host?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-airbnb-dark text-lg">{listing.host?.name}</p>
                <p className="text-sm text-airbnb-gray mb-2">Host</p>
                {listing.host?.bio && (
                  <p className="text-sm text-airbnb-dark leading-relaxed">{listing.host.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-airbnb-gray">
                  {listing.reviewCount > 0 && <span>⭐ {listing.reviewCount} reviews</span>}
                  <span>✓ Identity verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* House rules, health & safety, cancellation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-airbnb-dark">Things to know</h3>

            {[
              {
                title: 'House rules',
                icon: '🏠',
                items: ['Check-in: 3:00 PM – 10:00 PM', 'Checkout: 11:00 AM', 'No smoking', 'No pets', 'No parties or events', `Maximum ${listing.maxGuests} guests`],
                state: showHouseRules,
                setState: setShowHouseRules,
              },
            ].map(({ title, icon, items, state, setState }) => (
              <div key={title} className="border border-gray-200 rounded-2xl p-5">
                <button
                  onClick={() => setState((v) => !v)}
                  className="w-full flex items-center justify-between"
                >
                  <span className="font-semibold text-airbnb-dark flex items-center gap-2">
                    <span>{icon}</span>{title}
                  </span>
                  {state ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
                {state && (
                  <ul className="mt-4 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="text-sm text-airbnb-dark flex items-center gap-2">
                        <FiCheck size={14} className="text-airbnb-gray flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="border border-gray-200 rounded-2xl p-5">
              <h4 className="font-semibold text-airbnb-dark mb-3 flex items-center gap-2">
                <span>🛡️</span> Health &amp; safety
              </h4>
              <ul className="space-y-2">
                {['Committed to Airbnb\'s enhanced cleaning process', 'Airbnb\'s social-distancing guidelines apply', 'Carbon monoxide alarm installed', 'Smoke alarm installed'].map((item) => (
                  <li key={item} className="text-sm text-airbnb-dark flex items-center gap-2">
                    <FiCheck size={14} className="text-airbnb-gray flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 rounded-2xl p-5">
              <h4 className="font-semibold text-airbnb-dark mb-3 flex items-center gap-2">
                <span>📋</span> Cancellation policy
              </h4>
              <p className="text-sm text-airbnb-dark">
                Free cancellation for 48 hours. After that, cancel before check-in and get a 50% refund, minus the first night and service fee.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column: Booking card ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 border border-gray-200 rounded-2xl shadow-xl p-6">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold text-airbnb-dark">
                R{listing.pricePerNight?.toLocaleString()}
              </span>
              <span className="text-airbnb-gray">/ night</span>
              {listing.avgRating > 0 && (
                <div className="flex items-center gap-1 ml-auto text-sm">
                  <FiStar size={13} className="fill-airbnb-dark text-airbnb-dark" />
                  <span className="font-medium">{listing.avgRating.toFixed(1)}</span>
                  <span className="text-airbnb-gray">({listing.reviewCount})</span>
                </div>
              )}
            </div>

            {/* Date pickers */}
            <div className="border border-gray-300 rounded-xl overflow-hidden mb-3">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                <div className="p-3">
                  <label className="block text-xs font-bold text-airbnb-dark mb-1">CHECK-IN</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => { setCheckIn(date); if (checkOut && date >= checkOut) setCheckOut(null) }}
                    selectsStart startDate={checkIn} endDate={checkOut}
                    minDate={new Date()} placeholderText="Add date"
                    className="text-sm text-airbnb-dark w-full outline-none cursor-pointer"
                    dateFormat="d MMM yyyy"
                  />
                </div>
                <div className="p-3">
                  <label className="block text-xs font-bold text-airbnb-dark mb-1">CHECK-OUT</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd startDate={checkIn} endDate={checkOut}
                    minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
                    placeholderText="Add date"
                    className="text-sm text-airbnb-dark w-full outline-none cursor-pointer"
                    dateFormat="d MMM yyyy"
                  />
                </div>
              </div>
              <div className="border-t border-gray-300 p-3">
                <label className="block text-xs font-bold text-airbnb-dark mb-1">GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="text-sm text-airbnb-dark w-full outline-none bg-transparent cursor-pointer"
                >
                  {Array.from({ length: listing.maxGuests || 1 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {bookingError && (
              <p className="text-sm text-red-500 mb-3">{bookingError}</p>
            )}

            <button onClick={handleBook} disabled={bookingLoading} className="btn-primary w-full mb-3">
              {bookingLoading ? 'Reserving…' : 'Reserve'}
            </button>
            <p className="text-center text-xs text-airbnb-gray mb-4">You won't be charged yet</p>

            {/* ── Cost calculator ── */}
            {nights > 0 && (
              <div className="space-y-3 text-sm border-t border-airbnb-light pt-4">
                <div className="flex justify-between text-airbnb-dark">
                  <span>R{listing.pricePerNight?.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                  <span>R{basePrice.toLocaleString()}</span>
                </div>
                {weeklyDiscountAmt > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Weekly discount ({listing.weeklyDiscount}%)</span>
                    <span>−R{weeklyDiscountAmt.toLocaleString()}</span>
                  </div>
                )}
                {cleaningFee > 0 && (
                  <div className="flex justify-between text-airbnb-dark">
                    <span>Cleaning fee</span>
                    <span>R{cleaningFee.toLocaleString()}</span>
                  </div>
                )}
                {serviceFee > 0 && (
                  <div className="flex justify-between text-airbnb-dark">
                    <span>Service fee</span>
                    <span>R{serviceFee.toLocaleString()}</span>
                  </div>
                )}
                {occupancyTaxes > 0 && (
                  <div className="flex justify-between text-airbnb-dark">
                    <span>Occupancy taxes &amp; fees</span>
                    <span>R{occupancyTaxes.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-airbnb-dark border-t border-airbnb-light pt-3">
                  <span>Total</span>
                  <span>R{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
