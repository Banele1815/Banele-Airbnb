import { useState, useEffect } from 'react'
import { getMyBookings } from '../services/bookingService'

/**
 * Fetches the current user's bookings.
 * @returns {{ bookings, loading, error, refetch }}
 */
export default function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchBookings() {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return { bookings, loading, error, refetch: fetchBookings }
}
