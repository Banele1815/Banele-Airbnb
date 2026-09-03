/**
 * userController.js
 * Handles user authentication and profile management.
 * Routes are mounted at /api/auth and /api/users.
 */

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * Signs a JWT token for the given user ID.
 * Expiry is controlled by JWT_EXPIRES_IN env variable (default 7 days).
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} signed JWT token
 */
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * POST /api/auth/register
 * Public — creates a new user account.
 * Body: { name, email, password, role? }
 * Role defaults to 'guest' if not provided.
 * Returns 409 if email is already registered.
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    // Check for duplicate email
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const user = await User.create({ name, email, password, role })
    const token = signToken(user._id)

    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Public — authenticates a user and returns a JWT token.
 * Body: { email, password }
 * Returns 401 if credentials are invalid.
 * Password field is selected explicitly (it has select:false on the model).
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    // Explicitly select password — it is hidden by default on the model
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken(user._id)
    // toJSON() strips the password field before sending
    const userData = user.toJSON()

    res.json({ token, user: userData })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Protected — returns the currently authenticated user's profile.
 * The user is attached to req.user by the protect middleware.
 */
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/auth/me
 * Protected — updates the logged-in user's name, bio, or password.
 * Body: { name?, bio?, currentPassword?, newPassword? }
 * Password change requires currentPassword for verification.
 * Returns 401 if currentPassword is wrong.
 */
export async function updateMe(req, res, next) {
  try {
    const { name, bio, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    if (name) user.name = name
    if (bio !== undefined) user.bio = bio

    // Handle optional password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password.' })
      }
      const valid = await user.comparePassword(currentPassword)
      if (!valid) {
        return res.status(401).json({ message: 'Current password is incorrect.' })
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' })
      }
      user.password = newPassword
    }

    await user.save()
    res.json(user.toJSON())
  } catch (err) {
    next(err)
  }
}
