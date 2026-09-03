import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEMO_ACCOUNTS = [
  { label: 'Log in as Admin', email: 'admin@baneleairbnb.co.za', colour: 'bg-airbnb-red text-white hover:bg-red-600' },
  { label: 'Log in as Host', email: 'host@baneleairbnb.co.za', colour: 'bg-blue-600 text-white hover:bg-blue-700' },
  { label: 'Log in as Guest', email: 'guest@baneleairbnb.co.za', colour: 'bg-gray-700 text-white hover:bg-gray-800' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Just fills in the fields — user still clicks Log in
  function handleFill(email) {
    setFormData({ email, password: 'password123' })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(formData.email, formData.password)
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
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
            <h1 className="text-2xl font-bold text-airbnb-dark">Welcome back</h1>
            <p className="text-airbnb-gray text-sm mt-1">Log in to your account</p>
          </div>

          {/* Fill-in buttons */}
          <div className="flex flex-col gap-2 mb-6">
            {DEMO_ACCOUNTS.map(({ label, email, colour }) => (
              <button
                key={email}
                type="button"
                onClick={() => handleFill(email)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${colour}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-airbnb-gray">or enter your details</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-airbnb-gray">
            Don't have an account?{' '}
            <Link to="/register" className="text-airbnb-dark font-medium underline hover:no-underline">
              Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
