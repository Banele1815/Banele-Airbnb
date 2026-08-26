/**
 * Format a price in South African Rand.
 * @param {number} amount
 * @returns {string} e.g. "R 1,500"
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number') return 'R 0'
  return `R ${amount.toLocaleString('en-ZA')}`
}

/**
 * Format a date range for display.
 * @param {string|Date} checkIn
 * @param {string|Date} checkOut
 * @returns {string} e.g. "12 Jan – 15 Jan 2025"
 */
export function formatDateRange(checkIn, checkOut) {
  const opts = { day: 'numeric', month: 'short' }
  const start = new Date(checkIn).toLocaleDateString('en-ZA', opts)
  const end = new Date(checkOut).toLocaleDateString('en-ZA', { ...opts, year: 'numeric' })
  return `${start} – ${end}`
}

/**
 * Calculate the number of nights between two dates.
 * @param {string|Date} checkIn
 * @param {string|Date} checkOut
 * @returns {number}
 */
export function calcNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn)
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Truncate a string to a maximum length and append '…'
 */
export function truncate(str, max = 80) {
  if (!str || str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}
