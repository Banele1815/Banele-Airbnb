import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Redirects unauthenticated users to /login.
 * Stores the current location so the user is sent back after login.
 *
 * @param {string} requiredRole - Optional: 'host' or 'guest' — redirects home if role doesn't match
 */
export default function useRequireAuth(requiredRole = null) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true })
    } else if (requiredRole && user.role !== requiredRole) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate, location, requiredRole])

  return { user, loading }
}
