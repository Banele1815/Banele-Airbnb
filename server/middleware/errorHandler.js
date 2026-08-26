/**
 * notFound — catch-all for unmatched routes
 */
export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  error.status = 404
  next(error)
}

/**
 * errorHandler — central error response
 * Must be registered last in Express middleware chain.
 */
export function errorHandler(err, req, res, _next) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages.join('. ') })
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` })
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    return res.status(409).json({ message: `${field} already exists.` })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token has expired.' })
  }

  const statusCode = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (statusCode === 500) {
    console.error('[Server Error]', err)
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
