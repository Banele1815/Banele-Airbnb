import { Router } from 'express'
import path from 'path'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = Router()

/**
 * POST /api/upload
 * Upload up to 10 images. Returns array of public URLs.
 */
router.post('/', protect, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' })
  }

  const urls = req.files.map(
    (file) => `/uploads/${file.filename}`
  )

  res.status(201).json({ urls })
})

export default router
