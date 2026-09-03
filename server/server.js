import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
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

// Allowed origins — localhost in dev, any Vercel/Heroku URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, same-origin on Heroku)
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /\.herokuapp\.com$/.test(origin)
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

// Serve built React frontend in production (Heroku)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const clientDist = join(__dirname, '../client/dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  // All non-API routes return the React app (handles client-side routing)
  app.get('*', (_req, res) => {
    res.sendFile(join(clientDist, 'index.html'))
  })
}

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
