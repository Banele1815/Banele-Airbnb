import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import listingRoutes from './routes/listingRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

// Brief-required aliases
app.use('/api/accommodations', listingRoutes)
app.use('/api/reservations', bookingRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Error handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
