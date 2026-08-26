import { Router } from 'express'
import {
  getListings,
  getMyListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js'
import { protect, requireHost } from '../middleware/auth.js'

const router = Router()

router.get('/', getListings)
router.get('/my', protect, getMyListings)
router.get('/:id', getListing)
router.post('/', protect, requireHost, createListing)
router.put('/:id', protect, requireHost, updateListing)
router.delete('/:id', protect, requireHost, deleteListing)

export default router
