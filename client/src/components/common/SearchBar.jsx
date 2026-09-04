import { useState } from 'react'
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

/**
 * SearchBar
 * @param {Function} onSearch       - Called with { location, checkIn, checkOut, guests }
 * @param {object}   initialValues  - Pre-populated values (optional)
 */
export default function SearchBar({ onSearch, initialValues = {} }) {
  const [location, setLocation] = useState(initialValues.location || '')
  const [checkIn, setCheckIn] = useState(
    initialValues.checkIn ? new Date(initialValues.checkIn) : null
  )
  const [checkOut, setCheckOut] = useState(
    initialValues.checkOut ? new Date(initialValues.checkOut) : null
  )
  const [guests, setGuests] = useState(initialValues.guests || '')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch({
      ...(location && { location }),
      ...(checkIn && { checkIn: checkIn.toISOString() }),
      ...(checkOut && { checkOut: checkOut.toISOString() }),
      ...(guests && { guests }),
    })
  }

  // Force high stacking configurations directly onto the inner dropdown elements
  const popperModifiers = [
    {
      name: 'preventOverflow',
      options: {
        boundary: 'viewport',
      },
    },
    {
      name: 'styles',
      enabled: true,
      phase: 'write',
      fn: ({ state }) => {
        state.styles.popper = {
          ...state.styles.popper,
          zIndex: '999999',
          position: 'absolute',
        };
      },
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-stretch md:items-center bg-white border border-gray-200 rounded-2xl md:rounded-full shadow-md overflow-hidden"
      role="search"
      aria-label="Search listings"
    >
      {/* Location */}
      <div className="flex items-center gap-2 px-5 py-3 md:flex-1 border-b md:border-b-0 md:border-r border-gray-200">
        <FiMapPin size={16} className="text-airbnb-gray flex-shrink-0" />
        <div className="flex-1">
          <label htmlFor="search-location" className="block text-xs font-bold text-airbnb-dark">Where</label>
          <input
            id="search-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search destinations"
            className="w-full text-sm text-airbnb-dark outline-none placeholder:text-airbnb-gray"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="flex items-center gap-2 px-5 py-3 md:w-44 border-b md:border-b-0 md:border-r border-gray-200">
        <FiCalendar size={16} className="text-airbnb-gray flex-shrink-0" />
        <div className="flex-1">
          <label className="block text-xs font-bold text-airbnb-dark">Check in</label>
          <DatePicker
            selected={checkIn}
            onChange={(date) => { setCheckIn(date); if (checkOut && date >= checkOut) setCheckOut(null) }}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            placeholderText="Add date"
            className="w-full text-sm text-airbnb-dark outline-none cursor-pointer placeholder:text-airbnb-gray"
            dateFormat="d MMM yyyy"
            popperModifiers={popperModifiers}
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="flex items-center gap-2 px-5 py-3 md:w-44 border-b md:border-b-0 md:border-r border-gray-200">
        <FiCalendar size={16} className="text-airbnb-gray flex-shrink-0" />
        <div className="flex-1">
          <label className="block text-xs font-bold text-airbnb-dark">Check out</label>
          <DatePicker
            selected={checkOut}
            onChange={(date) => setCheckOut(date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
            placeholderText="Add date"
            className="w-full text-sm text-airbnb-dark outline-none cursor-pointer placeholder:text-airbnb-gray"
            dateFormat="d MMM yyyy"
            popperModifiers={popperModifiers}
          />
        </div>
      </div>

      {/* Guests + Submit */}
      <div className="flex items-center gap-2 px-5 py-3 md:w-52">
        <FiUsers size={16} className="text-airbnb-gray flex-shrink-0" />
        <div className="flex-1">
          <label htmlFor="search-guests" className="block text-xs font-bold text-airbnb-dark">Guests</label>
          <input
            id="search-guests"
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="Add guests"
            className="w-full text-sm text-airbnb-dark outline-none placeholder:text-airbnb-gray"
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="bg-airbnb-red hover:bg-rose-600 text-white rounded-full p-3 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <FiSearch size={16} />
        </button>
      </div>
    </form>
  )
}
