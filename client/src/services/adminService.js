import api from './api'

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats')
  return data
}

export async function getAdminUsers() {
  const { data } = await api.get('/admin/users')
  return data
}

export async function updateUserRole(id, role) {
  const { data } = await api.put(`/admin/users/${id}/role`, { role })
  return data
}

export async function adminDeleteUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`)
  return data
}

export async function getAdminListings() {
  const { data } = await api.get('/admin/listings')
  return data
}

export async function adminDeleteListing(id) {
  const { data } = await api.delete(`/admin/listings/${id}`)
  return data
}

export async function getAdminBookings() {
  const { data } = await api.get('/admin/bookings')
  return data
}

export async function uploadImages(files) {
  const form = new FormData()
  files.forEach((f) => form.append('images', f))
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.urls
}
