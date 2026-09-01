import Review from '../models/Review.js'
import Reservation from '../models/Reservation.js'

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { listing, booking: bookingId, rating, comment } = req.body

    if (!listing || !bookingId || !rating) {
      return res.status(400).json({ message: 'listing, booking and rating are required.' })
    }

    // Verify the booking belongs to this guest and is completed/confirmed
    const booking = await Reservation.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Reservation not found.' })

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only review your own bookings.' })
    }

    if (booking.reviewed) {
      return res.status(409).json({ message: 'You have already reviewed this booking.' })
    }

    const review = await Review.create({
      listing,
      guest: req.user._id,
      booking: bookingId,
      rating: Number(rating),
      comment,
    })

    // Mark booking as reviewed
    booking.reviewed = true
    await booking.save()

    await review.populate('guest', 'name avatar')
    res.status(201).json(review)
  } catch (err) {
    // Duplicate key — unique booking index
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this booking.' })
    }
    next(err)
  }
}

// GET /api/reviews/listing/:listingId
export async function getListingReviews(req, res, next) {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('guest', 'name avatar')
      .sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/reviews/:id
export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found.' })

    if (review.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this review.' })
    }

    await review.deleteOne()

    // Un-mark the booking so the user could theoretically re-review
    await Reservation.findByIdAndUpdate(review.booking, { reviewed: false })

    res.json({ message: 'Review deleted.' })
  } catch (err) {
    next(err)
  }
}
