import api from './api'

/**
 * Create a new booking.
 * @param {object} payload - { listing, checkIn, checkOut, guests, totalPrice }
 */
export async function createBooking(payload) {
  const { data } = await api.post('/bookings', payload)
  return data
}

/**
 * Get all bookings for the current user (guest).
 */
export async function getMyBookings() {
  const { data } = await api.get('/bookings/my')
  return data
}

/**
 * Get all bookings for the current user's listings (host view).
 */
export async function getHostBookings() {
  const { data } = await api.get('/bookings/host')
  return data
}

/**
 * Cancel a booking by ID.
 */
export async function cancelBooking(id) {
  const { data } = await api.put(`/bookings/${id}/cancel`)
  return data
}

/**
 * Confirm a booking (host action).
 */
export async function confirmBooking(id) {
  const { data } = await api.put(`/bookings/${id}/confirm`)
  return data
}
