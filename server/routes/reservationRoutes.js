import { Router } from 'express'
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
  confirmBooking,
  deleteReservation,
} from '../controllers/reservationController.js'
import { protect, requireHost } from '../middleware/auth.js'

const router = Router()

router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/user', protect, getMyBookings) // brief-exact path (alias of /my)
router.get('/host', protect, requireHost, getHostBookings)
router.put('/:id/cancel', protect, cancelBooking)
router.put('/:id/confirm', protect, requireHost, confirmBooking)
router.delete('/:id', protect, deleteReservation) // brief-required hard delete

export default router
