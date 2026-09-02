import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSliders, FiX, FiMap, FiList } from 'react-icons/fi'
import ListingCard from '../components/listings/ListingCard'
import ListingsMapView from '../components/listings/ListingsMapView'
import SearchBar from '../components/common/SearchBar'
import { getListings } from '../services/listingService'
import { DEMO_LISTINGS, filterDemoListings } from '../utils/seedData'

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Studio', 'Farm']

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showMapMobile, setShowMapMobile] = useState(false)

  // Local filter state (applied on "Apply")
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '')

  const filters = {
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    category: searchParams.get('category') || '',
    propertyType: searchParams.get('propertyType') || '',
  }

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== '')
        )
        const data = await getListings(params)
        // Handle both array and { listings, total } response shapes
        const arr = Array.isArray(data) ? data : (data.listings || [])
        const total = Array.isArray(data) ? data.length : (data.total ?? arr.length)
        setListings(arr)
        setTotalCount(total)
      } catch (err) {
        // Fall back to static demo data when API is unavailable
        console.warn('API unavailable — using demo data', err.message)
        const demo = filterDemoListings(filters)
        setListings(demo)
        setTotalCount(demo.length)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  function handleSearch(params) {
    setSearchParams(params)
  }

  function applyFilters() {
    const next = new URLSearchParams(searchParams)
    if (minPrice) next.set('minPrice', minPrice); else next.delete('minPrice')
    if (maxPrice) next.set('maxPrice', maxPrice); else next.delete('maxPrice')
    if (propertyType) next.set('propertyType', propertyType); else next.delete('propertyType')
    setSearchParams(next)
    setShowFilters(false)
  }

  function clearFilters() {
    setMinPrice('')
    setMaxPrice('')
    setPropertyType('')
    const next = new URLSearchParams(searchParams)
    next.delete('minPrice')
    next.delete('maxPrice')
    next.delete('propertyType')
    setSearchParams(next)
    setShowFilters(false)
  }

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.propertyType

  return (
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search bar */}
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} initialValues={filters} />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border transition-colors ${
            hasActiveFilters
              ? 'border-airbnb-dark bg-airbnb-dark text-white'
              : 'border-gray-300 text-airbnb-dark hover:border-airbnb-dark'
          }`}
        >
          <FiSliders size={15} />
          Filters
          {hasActiveFilters && (
            <span className="bg-white text-airbnb-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {[filters.minPrice, filters.maxPrice, filters.propertyType].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {filters.category && (
          <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-airbnb-dark px-3 py-1.5 rounded-full">
            {filters.category}
            <button onClick={() => { const n = new URLSearchParams(searchParams); n.delete('category'); setSearchParams(n) }}>
              <FiX size={13} />
            </button>
          </span>
        )}
        {filters.location && (
          <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-airbnb-dark px-3 py-1.5 rounded-full">
            📍 {filters.location}
            <button onClick={() => { const n = new URLSearchParams(searchParams); n.delete('location'); setSearchParams(n) }}>
              <FiX size={13} />
            </button>
          </span>
        )}
        {filters.propertyType && (
          <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-airbnb-dark px-3 py-1.5 rounded-full">
            {filters.propertyType}
            <button onClick={() => { const n = new URLSearchParams(searchParams); n.delete('propertyType'); setSearchParams(n) }}>
              <FiX size={13} />
            </button>
          </span>
        )}
        {(filters.minPrice || filters.maxPrice) && (
          <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-airbnb-dark px-3 py-1.5 rounded-full">
            R{filters.minPrice || '0'} – R{filters.maxPrice || '∞'}
            <button onClick={() => { const n = new URLSearchParams(searchParams); n.delete('minPrice'); n.delete('maxPrice'); setSearchParams(n) }}>
              <FiX size={13} />
            </button>
          </span>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Price range */}
            <div>
              <label className="block text-sm font-semibold text-airbnb-dark mb-3">Price range (R/night)</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-airbnb-gray text-sm">R</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min={0}
                    className="input-field pl-7 text-sm"
                  />
                </div>
                <span className="text-airbnb-gray">–</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-airbnb-gray text-sm">R</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min={0}
                    className="input-field pl-7 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Property type */}
            <div>
              <label className="block text-sm font-semibold text-airbnb-dark mb-3">Property type</label>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <label key={t} className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                    propertyType === t ? 'border-airbnb-dark bg-gray-50 font-medium' : 'border-gray-200 hover:border-gray-400'
                  }`}>
                    <input
                      type="radio"
                      name="propertyType"
                      value={t}
                      checked={propertyType === t}
                      onChange={() => setPropertyType(propertyType === t ? '' : t)}
                      className="sr-only"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Quick price presets */}
            <div>
              <label className="block text-sm font-semibold text-airbnb-dark mb-3">Budget presets</label>
              <div className="space-y-2">
                {[
                  { label: 'Budget (under R2 000)', min: '', max: '2000' },
                  { label: 'Mid-range (R2 000 – R5 000)', min: '2000', max: '5000' },
                  { label: 'Luxury (over R5 000)', min: '5000', max: '' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => { setMinPrice(preset.min); setMaxPrice(preset.max) }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                      minPrice === preset.min && maxPrice === preset.max
                        ? 'border-airbnb-dark bg-gray-50 font-medium'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={clearFilters} className="text-sm font-medium text-airbnb-dark underline hover:no-underline">
              Clear all filters
            </button>
            <button onClick={applyFilters} className="btn-primary text-sm px-6 py-2">
              Show results
            </button>
          </div>
        </div>
      )}

      {/* Results count + mobile map toggle */}
      {!loading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-airbnb-gray">
            <span className="font-medium text-airbnb-dark">{totalCount}</span> {totalCount === 1 ? 'stay' : 'stays'}
            {filters.location && <span> in <span className="font-medium text-airbnb-dark">{filters.location}</span></span>}
          </p>
          <button
            onClick={() => setShowMapMobile((v) => !v)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium border border-airbnb-dark rounded-full px-4 py-2"
          >
            {showMapMobile ? <><FiList size={14} /> Show list</> : <><FiMap size={14} /> Show map</>}
          </button>
        </div>
      )}

      {/* Listings — split list/map view (list left, sticky map right), like real Airbnb */}
      <div className="lg:flex lg:gap-8 lg:items-start">
        <div className={`flex-1 min-w-0 ${showMapMobile ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="bg-gray-200 rounded-2xl w-48 h-32 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-24 text-airbnb-gray">
              <p className="text-2xl mb-2">No results</p>
              <p className="text-sm mb-4">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn-secondary text-sm">Clear filters</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Map — sticky on desktop, full-screen toggle on mobile */}
        {!loading && listings.length > 0 && (
          <div className={`${showMapMobile ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24 w-full lg:w-[42%] lg:flex-shrink-0 h-[60vh] lg:h-[calc(100vh-140px)] mt-4 lg:mt-0`}>
            <ListingsMapView listings={listings} />
          </div>
        )}
      </div>
    </div>
  )
}