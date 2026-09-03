import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiStar } from 'react-icons/fi'

/**
 * ListingCard
 * Displays a single listing in the grid.
 * @param {object} listing - Listing object from API
 */
export default function ListingCard({ listing }) {
  const [wishListed, setWishListed] = useState(false)
  const [imgError, setImgError] = useState(false)

  const photo = !imgError && listing.photos?.[0]
    ? listing.photos[0]
    : '/placeholder-home.svg'

  const amenities = listing.amenities || []

  return (
    <article className="group cursor-pointer">
      <Link
        to={`/listings/${listing._id}`}
        aria-label={listing.title}
        className="flex gap-4 items-stretch h-40 sm:h-44 bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Photo — left */}
        <div className="relative w-40 sm:w-48 h-full flex-shrink-0 overflow-hidden bg-gray-100">
          <img
            src={photo}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setWishListed((w) => !w)
            }}
            aria-label={wishListed ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 p-1"
          >
            <FiHeart
              size={22}
              className={`transition-colors drop-shadow ${
                wishListed ? 'fill-airbnb-red text-airbnb-red' : 'fill-white/60 text-white'
              }`}
            />
          </button>
        </div>

        {/* Details — right */}
        <div className="flex-1 min-w-0 py-3 pr-4 flex flex-col justify-center gap-1.5 overflow-hidden">
          {listing.category && (
            <p className="text-xs font-medium text-airbnb-gray uppercase tracking-wide">
              {listing.category}
            </p>
          )}

          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-airbnb-dark text-sm truncate">{listing.title}</p>
            {listing.avgRating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <FiStar size={12} className="fill-airbnb-dark text-airbnb-dark" />
                <span className="text-xs text-airbnb-dark">{listing.avgRating.toFixed(1)}</span>
                <span className="text-xs text-airbnb-gray">
                  ({listing.reviewCount ?? 0})
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-airbnb-gray truncate">{listing.location}</p>

          <p className="text-xs text-airbnb-gray">
            {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
            {' · '}
            {listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''}
          </p>

          <p className="text-xs text-airbnb-gray truncate min-h-[1rem]">
            {amenities.length > 0 ? amenities.slice(0, 3).join(' · ') : '\u00A0'}
          </p>

          <p className="text-sm text-airbnb-dark mt-1">
            <span className="font-semibold">R{listing.pricePerNight?.toLocaleString()}</span>
            <span className="text-airbnb-gray font-normal"> / night</span>
          </p>
        </div>
      </Link>
    </article>
  )
}
