import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import Image from '../models/Image.js'

const router = Router()

/**
 * POST /api/upload
 * Upload up to 10 images. Saves each one straight into MongoDB (no disk,
 * no external storage service) and returns an array of URLs that serve
 * the image back out via GET /api/images/:id.
 */
router.post('/', protect, upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' })
    }

    const docs = await Image.insertMany(
      req.files.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname,
      }))
    )

    const urls = docs.map((doc) => `/api/images/${doc._id}`)
    res.status(201).json({ urls })
  } catch (err) {
    next(err)
  }
})

export default router
