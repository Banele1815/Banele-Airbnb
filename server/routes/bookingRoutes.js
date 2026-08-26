import { Router } from 'express'
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
  confirmBooking,
} from '../controllers/bookingController.js'
import { protect, requireHost } from '../middleware/auth.js'

const router = Router()

router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/host', protect, requireHost, getHostBookings)
router.put('/:id/cancel', protect, cancelBooking)
router.put('/:id/confirm', protect, requireHost, confirmBooking)

export default router
