import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ListingCard from '../components/listings/ListingCard'
import SearchBar from '../components/common/SearchBar'
import { getListings } from '../services/listingService'
import { DEMO_LISTINGS, filterDemoListings } from '../utils/seedData'

const CATEGORIES = [
  { label: 'Beachfront', icon: '🏖️' },
  { label: 'Cabins', icon: '🏕️' },
  { label: 'Amazing views', icon: '🌄' },
  { label: 'Tiny homes', icon: '🏠' },
  { label: 'Farms', icon: '🌾' },
  { label: 'Luxury', icon: '✨' },
  { label: 'Pools', icon: '🏊' },
  { label: 'Countryside', icon: '🌿' },
]

const EXPERIENCES = [
  { title: 'Cooking classes', icon: '🍳', count: '1,200+ experiences' },
  { title: 'Art & crafts', icon: '🎨', count: '850+ experiences' },
  { title: 'Outdoor adventures', icon: '🧗', count: '2,400+ experiences' },
  { title: 'Music & dance', icon: '🎵', count: '640+ experiences' },
]

const INSPIRATION_TABS = ['South Africa', 'Africa', 'Beach escapes', 'Mountain retreats']

const GETAWAYS = [
  { label: 'Beach houses', emoji: '🏖️', query: 'Beachfront', description: 'Wake up steps from the sand' },
  { label: 'Unique stays', emoji: '🌿', query: 'Countryside', description: 'Quiet, off-the-beaten-path homes' },
  { label: 'Luxury villas', emoji: '✨', query: 'Luxury', description: 'Space and style for a special trip' },
  { label: 'Mountain cabins', emoji: '🏔️', query: 'Cabins', description: 'Cosy retreats above the clouds' },
]

const INSPIRATION_DATA = {
  'South Africa': [
    { city: 'Cape Town', type: 'Beach & Mountain', distance: '20 min drive' },
    { city: 'Johannesburg', type: 'City stays', distance: '30 min drive' },
    { city: 'Durban', type: 'Coastal vibes', distance: '15 min drive' },
    { city: 'Stellenbosch', type: 'Wine country', distance: '45 min drive' },
    { city: 'Kruger Park', type: 'Safari', distance: '5 hr drive' },
    { city: 'Knysna', type: 'Garden Route', distance: '6 hr drive' },
  ],
  Africa: [
    { city: 'Nairobi', type: 'City & Safari', distance: '2 hr flight' },
    { city: 'Marrakech', type: 'Culture & Medinas', distance: '8 hr flight' },
    { city: 'Zanzibar', type: 'Island paradise', distance: '3 hr flight' },
    { city: 'Cairo', type: 'History & Culture', distance: '7 hr flight' },
    { city: 'Victoria Falls', type: 'Adventure', distance: '2 hr flight' },
    { city: 'Lagos', type: 'Coastal city', distance: '4 hr flight' },
  ],
  'Beach escapes': [
    { city: 'Clifton', type: 'Atlantic beaches', distance: '20 min drive' },
    { city: 'Umhlanga', type: 'KZN coast', distance: '20 min drive' },
    { city: 'Plettenberg Bay', type: 'Garden Route', distance: '5 hr drive' },
    { city: 'Hermanus', type: 'Whale watching', distance: '1 hr drive' },
    { city: 'Mossel Bay', type: 'Surfing & beaches', distance: '4 hr drive' },
    { city: 'Sodwana Bay', type: 'Diving paradise', distance: '5 hr drive' },
  ],
  'Mountain retreats': [
    { city: 'Drakensberg', type: 'Hiking & views', distance: '3 hr drive' },
    { city: 'Magaliesberg', type: 'Scenic getaway', distance: '1 hr drive' },
    { city: 'Swartberg', type: 'Remote peaks', distance: '4 hr drive' },
    { city: 'Boulders Peak', type: 'Quiet retreat', distance: '2 hr drive' },
    { city: 'Cedarberg', type: 'Rock formations', distance: '3 hr drive' },
    { city: 'Waterberg', type: 'Bush & wildlife', distance: '2 hr drive' },
  ],
}

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeTab, setActiveTab] = useState('South Africa')
  const [getawaysTab, setGetawaysTab] = useState('Grid view')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getListings({ category: activeCategory })
        const arr = Array.isArray(data) ? data : (data.listings || [])
        setListings(arr)
      } catch (err) {
        console.warn('API unavailable — using demo data', err.message)
        setListings(filterDemoListings({ category: activeCategory || undefined }))
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [activeCategory])

  function handleSearch(params) {
    navigate(`/listings?${new URLSearchParams(params).toString()}`)
  }

  return (
    <div>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-rose-50 to-pink-100 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-airbnb-dark mb-4">
            Find your next stay
          </h1>
          <p className="text-airbnb-gray text-lg mb-8">
            Discover unique homes, apartments, and experiences around the world.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* ── Category filter ── */}
      <section className="sticky top-20 z-40 bg-white border-b border-airbnb-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex flex-col items-center gap-1 min-w-fit pb-2 border-b-2 transition-colors ${
                !activeCategory ? 'border-airbnb-dark text-airbnb-dark' : 'border-transparent text-airbnb-gray hover:text-airbnb-dark hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">🏡</span>
              <span className="text-xs font-medium">All</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label === activeCategory ? null : cat.label)}
                className={`flex flex-col items-center gap-1 min-w-fit pb-2 border-b-2 transition-colors ${
                  activeCategory === cat.label ? 'border-airbnb-dark text-airbnb-dark' : 'border-transparent text-airbnb-gray hover:text-airbnb-dark hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listings grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-airbnb-gray">
            <p className="text-xl mb-2">No listings found</p>
            <p className="text-sm">Try a different category or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ── Inspiration for your next trip ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-airbnb-dark mb-2">Inspiration for your next trip</h2>
          <p className="text-airbnb-gray mb-8">Find popular destinations and unique stays.</p>

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
            {INSPIRATION_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-airbnb-dark text-airbnb-dark'
                    : 'border-transparent text-airbnb-gray hover:text-airbnb-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Location grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(INSPIRATION_DATA[activeTab] || []).map((item) => (
              <Link
                key={item.city}
                to={`/listings?location=${encodeURIComponent(item.city)}`}
                className="flex items-center gap-4 p-3 bg-white rounded-2xl hover:shadow-md transition-shadow group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🏙️
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-airbnb-dark group-hover:underline">{item.city}</p>
                  <p className="text-xs text-airbnb-gray">{item.type}</p>
                  <p className="text-xs text-airbnb-gray">{item.distance}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Discover Airbnb Experiences ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-airbnb-dark mb-2">Discover Airbnb Experiences</h2>
          <p className="text-airbnb-gray mb-8">Unique activities hosted by local experts.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {EXPERIENCES.map((exp) => (
              <div
                key={exp.title}
                className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-3">{exp.icon}</div>
                <p className="font-semibold text-airbnb-dark text-sm">{exp.title}</p>
                <p className="text-xs text-airbnb-gray mt-1">{exp.count}</p>
              </div>
            ))}
          </div>

          {/* Things to do on your trip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div
              className="relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-sky-400 to-blue-600 flex items-end p-6"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Experiences</p>
                <h3 className="text-2xl font-bold text-white mb-3">Things to do on your trip</h3>
                <button className="bg-white text-airbnb-dark text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                  Explore experiences
                </button>
              </div>
            </div>
            <div
              className="relative rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-amber-400 to-orange-500 flex items-end p-6"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Online</p>
                <h3 className="text-2xl font-bold text-white mb-3">Things to do at home</h3>
                <button className="bg-white text-airbnb-dark text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                  Explore online experiences
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ShopAirbnb ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-airbnb-dark mb-3">Give the gift of Airbnb</h2>
              <p className="text-airbnb-gray mb-6">
                Share the magic of travel with gift cards for stays and experiences.
              </p>
              <button className="btn-primary">Shop gift cards</button>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                {['🎁', '🏡', '✈️', '🌍'].map((emoji, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-rose-100 to-pink-200 rounded-2xl flex items-center justify-center text-4xl"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inspiration for future getaways ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-airbnb-dark mb-2">Inspiration for future getaways</h2>
          <p className="text-airbnb-gray mb-6">Browse getaway ideas as a grid, or scan them as a list.</p>

          {/* Tab bar */}
          <div className="flex gap-1 border-b border-gray-200 mb-8">
            {['Grid view', 'List view'].map((tab) => (
              <button
                key={tab}
                onClick={() => setGetawaysTab(tab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  getawaysTab === tab
                    ? 'border-airbnb-dark text-airbnb-dark'
                    : 'border-transparent text-airbnb-gray hover:text-airbnb-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {getawaysTab === 'Grid view' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GETAWAYS.map((item) => (
                <Link
                  key={item.label}
                  to={`/listings?category=${encodeURIComponent(item.query)}`}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[3/4] flex items-end p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30">
                    {item.emoji}
                  </div>
                  <p className="relative font-semibold text-airbnb-dark group-hover:underline">{item.label}</p>
                </Link>
              ))}
            </div>
          ) : (
            /* List format */
            <div className="flex flex-col divide-y divide-gray-200 border-t border-b border-gray-200">
              {GETAWAYS.map((item) => (
                <Link
                  key={item.label}
                  to={`/listings?category=${encodeURIComponent(item.query)}`}
                  className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors px-2 group"
                >
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-airbnb-dark group-hover:underline">{item.label}</p>
                    <p className="text-xs text-airbnb-gray">{item.description}</p>
                  </div>
                  <span className="text-airbnb-gray group-hover:text-airbnb-dark transition-colors">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
