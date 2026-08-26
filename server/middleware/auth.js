import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * protect — verifies JWT and attaches req.user
 */
export async function protect(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated. Please log in.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

/**
 * requireHost — must come after protect
 * Ensures the authenticated user has the 'host' role.
 */
export function requireHost(req, res, next) {
  if (req.user?.role !== 'host' && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'This action requires a host account.' })
  }
  next()
}

/**
 * requireAdmin — must come after protect
 * Ensures the authenticated user has the 'admin' role.
 */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' })
  }
  next()
}
