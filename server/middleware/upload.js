import multer from 'multer'
import path from 'path'

// In-memory storage — files never touch the local disk. The buffer is
// handed to the upload controller, which saves it into MongoDB (see
// models/Image.js). This is what makes uploads work on serverless hosts
// like Vercel, whose filesystem is ephemeral/read-only outside /tmp.
const storage = multer.memoryStorage()

function fileFilter(_req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per file — keeps MongoDB documents small
})

export default upload
