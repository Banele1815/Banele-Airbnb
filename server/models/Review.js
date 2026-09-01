import mongoose from 'mongoose'
import Accommodation from './Accommodation.js'

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      default: '',
    },
  },
  { timestamps: true }
)

// One review per booking
reviewSchema.index({ booking: 1 }, { unique: true })
reviewSchema.index({ listing: 1 })
reviewSchema.index({ guest: 1 })

// After saving a review, recalculate avgRating and reviewCount on the listing
reviewSchema.post('save', async function () {
  await recalcListingRating(this.listing)
})

// After deleting a review, recalculate as well
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await recalcListingRating(doc.listing)
})

async function recalcListingRating(listingId) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { listing: listingId } },
    {
      $group: {
        _id: '$listing',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ])

  if (stats.length > 0) {
    await Accommodation.findByIdAndUpdate(listingId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    })
  } else {
    await Accommodation.findByIdAndUpdate(listingId, { avgRating: 0, reviewCount: 0 })
  }
}

const Review = mongoose.model('Review', reviewSchema)
export default Review
