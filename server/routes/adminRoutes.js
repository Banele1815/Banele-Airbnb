import { Router } from 'express'
import { protect, requireAdmin } from '../middleware/auth.js'
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllListings,
  adminDeleteListing,
  getAllBookings,
} from '../controllers/adminController.js'

const router = Router()

// All admin routes require authentication + admin role
router.use(protect, requireAdmin)

router.get('/stats', getStats)
router.get('/users', getUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/listings', getAllListings)
router.delete('/listings/:id', adminDeleteListing)
router.get('/bookings', getAllBookings)

export default router
