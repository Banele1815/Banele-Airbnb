import User from '../models/User.js'
import Accommodation from '../models/Accommodation.js'
import Reservation from '../models/Reservation.js'

// GET /api/admin/stats
export async function getStats(req, res, next) {
  try {
    const [users, listings, bookings] = await Promise.all([
      User.countDocuments(),
      Accommodation.countDocuments({ isActive: true }),
      Reservation.countDocuments(),
    ])
    res.json({ users, listings, bookings })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/users
export async function getUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/users/:id/role
export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body
    if (!['guest', 'host', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ message: 'User deleted.' })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/listings  — all listings regardless of isActive
export async function getAllListings(req, res, next) {
  try {
    const listings = await Accommodation.find()
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
    res.json(listings)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/listings/:id
export async function adminDeleteListing(req, res, next) {
  try {
    const listing = await Accommodation.findByIdAndDelete(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Accommodation not found.' })
    res.json({ message: 'Accommodation deleted.' })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/bookings
export async function getAllBookings(req, res, next) {
  try {
    const bookings = await Reservation.find()
      .populate('listing', 'title location')
      .populate('guest', 'name email')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    next(err)
  }
}
