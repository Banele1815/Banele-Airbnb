import api from './api'

/**
 * Log in with email + password.
 * Returns { token, user }
 */
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

/**
 * Register a new user.
 * Returns { token, user }
 */
export async function register({ name, email, password, role }) {
  const { data } = await api.post('/auth/register', { name, email, password, role })
  return data
}

/**
 * Fetch the currently authenticated user's profile.
 */
export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

/**
 * Update profile info or change password.
 * Accepts any subset of { name, bio, currentPassword, newPassword }
 */
export async function updateProfile(payload) {
  const { data } = await api.put('/auth/me', payload)
  return data
}
