import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import accommodationRoutes from './routes/accommodationRoutes.js'
import reservationRoutes from './routes/reservationRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

// Connect to MongoDB (lazy — only once per cold start)
let dbConnected = false
async function ensureDB() {
  if (!dbConnected) {
    await connectDB()
    dbConnected = true
  }
}

// Allowed origins — localhost in dev, any Vercel preview/prod URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, same-origin on Vercel)
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true)
      }
      callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Note: images are no longer served from local disk — they live in MongoDB
// and are streamed back out via /api/images/:id (see routes/imageRoutes.js).
// This is what makes uploads survive on serverless hosts with no persistent
// filesystem, without needing an external storage service.

// Ensure DB connected before any API route
app.use('/api', async (_req, _res, next) => {
  try {
    await ensureDB()
    next()
  } catch (err) {
    next(err)
  }
})

// API Routes — brief-exact paths (primary)
app.use('/api/users', userRoutes)
app.use('/api/accommodations', accommodationRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/admin', adminRoutes)

// Aliases kept so the existing client code (services/*.js) keeps working unmodified
app.use('/api/auth', userRoutes)
app.use('/api/listings', accommodationRoutes)
app.use('/api/bookings', reservationRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Error handling
app.use(notFound)
app.use(errorHandler)

// ── Local dev: start server normally ──
// On Vercel the file is imported as a serverless function — no listen() needed
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

// Export for Vercel serverless
export default app
