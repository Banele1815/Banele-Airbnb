import { Router } from 'express'
import Image from '../models/Image.js'

const router = Router()

/**
 * GET /api/images/:id
 * Streams an uploaded image straight out of MongoDB with the right
 * Content-Type — this is the read side of the "no disk, no cloud
 * storage" upload approach in routes/uploadRoutes.js.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id).select('data contentType')
    if (!image) return res.status(404).json({ message: 'Image not found.' })

    res.set('Content-Type', image.contentType)
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(image.data)
  } catch (err) {
    next(err)
  }
})

export default router
