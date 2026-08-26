import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/authService'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  function handleProfileChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePasswordChange(e) {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    setProfileLoading(true)
    try {
      const updated = await updateProfile({ name: formData.name, bio: formData.bio })
      setUser(updated)
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' })
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setPasswordMsg({ type: '', text: '' })
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match.' })
    }
    if (passwordData.newPassword.length < 6) {
      return setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
    }
    setPasswordLoading(true)
    try {
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' })
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed.' })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-airbnb-dark mb-8">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-6 bg-gray-50 rounded-2xl border border-airbnb-light">
        <div className="w-16 h-16 rounded-full bg-airbnb-red text-white flex items-center justify-center text-2xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-airbnb-dark text-lg">{user?.name}</p>
          <p className="text-airbnb-gray text-sm capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Profile form */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-airbnb-dark mb-4">Personal information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-airbnb-dark mb-1">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleProfileChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-airbnb-dark mb-1">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className="input-field bg-gray-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-airbnb-gray mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-airbnb-dark mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleProfileChange}
              className="input-field resize-none"
              placeholder="Tell guests a bit about yourself..."
            />
          </div>
          {profileMsg.text && (
            <div className={`text-sm rounded-lg px-4 py-3 ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {profileMsg.text}
            </div>
          )}
          <button type="submit" disabled={profileLoading} className="btn-primary">
            {profileLoading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      <hr className="border-airbnb-light my-8" />

      {/* Change password */}
      <section>
        <h2 className="text-lg font-semibold text-airbnb-dark mb-4">Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-airbnb-dark mb-1">Current password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-airbnb-dark mb-1">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-airbnb-dark mb-1">Confirm new password</label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="input-field"
              required
            />
          </div>
          {passwordMsg.text && (
            <div className={`text-sm rounded-lg px-4 py-3 ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {passwordMsg.text}
            </div>
          )}
          <button type="submit" disabled={passwordLoading} className="btn-primary">
            {passwordLoading ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </section>
    </div>
  )
}
