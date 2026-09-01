import mongoose from 'mongoose'

// Stores uploaded image bytes directly in MongoDB instead of on local disk.
// This is what makes uploads survive on serverless hosts (Vercel etc.) with
// no external file storage service (Cloudinary/S3) required — MongoDB is
// already part of the stack, so images just live there as their own small
// documents (kept separate from Accommodation docs so listing reads stay fast).
const imageSchema = new mongoose.Schema(
  {
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

const Image = mongoose.model('Image', imageSchema)
export default Image
