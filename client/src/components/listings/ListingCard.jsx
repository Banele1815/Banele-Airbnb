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

  return (
    <article className="group cursor-pointer">
      <Link to={`/listings/${listing._id}`} className="block" aria-label={listing.title}>
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
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

          {/* Category badge */}
          {listing.category && (
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-airbnb-dark px-2 py-1 rounded-full">
              {listing.category}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-airbnb-dark text-sm truncate pr-2">{listing.title}</p>
            {listing.avgRating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <FiStar size={12} className="fill-airbnb-dark text-airbnb-dark" />
                <span className="text-xs text-airbnb-dark">{listing.avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-airbnb-gray truncate">{listing.location}</p>
          <p className="text-xs text-airbnb-gray">
            {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}
            {' · '}
            {listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-airbnb-dark">
            <span className="font-semibold">R{listing.pricePerNight?.toLocaleString()}</span>
            <span className="text-airbnb-gray font-normal"> / night</span>
          </p>
        </div>
      </Link>
    </article>
  )
}
