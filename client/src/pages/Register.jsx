import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'guest',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.')
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <svg viewBox="0 0 32 32" className="h-10 w-10 fill-airbnb-red mx-auto mb-3">
              <path d="M16 1C10.477 1 6 7.477 6 14c0 7.732 9.057 16.122 9.444 16.484a.75.75 0 0 0 1.112 0C16.943 30.122 26 21.732 26 14c0-6.523-4.477-13-10-13zm0 18.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
            </svg>
            <h1 className="text-2xl font-bold text-airbnb-dark">Create your account</h1>
            <p className="text-airbnb-gray text-sm mt-1">Join Banele Airbnb today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-airbnb-dark mb-1">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-airbnb-dark mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-airbnb-dark mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-airbnb-dark mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Repeat your password"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-airbnb-dark mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {['guest', 'host'].map((r) => (
                  <label
                    key={r}
                    className={`flex items-center justify-center gap-2 border rounded-xl p-3 cursor-pointer transition-colors ${
                      formData.role === r
                        ? 'border-airbnb-dark bg-gray-50 font-medium'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={formData.role === r}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-lg">{r === 'guest' ? '🏖️' : '🏡'}</span>
                    <span className="text-sm capitalize">{r === 'guest' ? 'Book stays' : 'Host my home'}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-airbnb-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-airbnb-dark font-medium underline hover:no-underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
