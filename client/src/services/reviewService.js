import api from './api'

/**
 * Submit a review for a listing.
 * @param {object} payload - { listing, booking, rating, comment }
 */
export async function createReview(payload) {
  const { data } = await api.post('/reviews', payload)
  return data
}

/**
 * Get all reviews for a specific listing.
 */
export async function getListingReviews(listingId) {
  const { data } = await api.get(`/reviews/listing/${listingId}`)
  return data
}

/**
 * Delete a review by ID (owner only).
 */
export async function deleteReview(id) {
  const { data } = await api.delete(`/reviews/${id}`)
  return data
}
