import api from './api'

/**
 * Fetch all listings, optionally filtered.
 * @param {object} params - e.g. { location, category, minPrice, maxPrice, guests }
 */
export async function getListings(params = {}) {
  const { data } = await api.get('/listings', { params })
  return data
}

/**
 * Fetch a single listing by ID.
 */
export async function getListing(id) {
  const { data } = await api.get(`/listings/${id}`)
  return data
}

/**
 * Create a new listing (host only).
 */
export async function createListing(payload) {
  const { data } = await api.post('/listings', payload)
  return data
}

/**
 * Update an existing listing (owner only).
 */
export async function updateListing(id, payload) {
  const { data } = await api.put(`/listings/${id}`, payload)
  return data
}

/**
 * Delete a listing (owner only).
 */
export async function deleteListing(id) {
  const { data } = await api.delete(`/listings/${id}`)
  return data
}

/**
 * Fetch all listings belonging to the current host.
 */
export async function getMyListings() {
  const { data } = await api.get('/listings/my')
  return data
}
