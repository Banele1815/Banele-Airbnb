import { useState, useEffect } from 'react'
import { getListings } from '../services/listingService'

/**
 * Fetches listings with optional filters.
 * Re-fetches whenever filters change.
 *
 * @param {object} filters - Query params passed to the API
 * @returns {{ listings, loading, error, refetch }}
 */
export default function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filterKey = JSON.stringify(filters)

  async function fetchListings() {
    setLoading(true)
    setError(null)
    try {
      const data = await getListings(filters)
      setListings(Array.isArray(data) ? data : data.listings || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  return { listings, loading, error, refetch: fetchListings }
}
