import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
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
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      type: Number,
      required: true,
      min: [1, 'At least 1 guest required'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    // Set to true once the guest has submitted a review for this booking
    reviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Validate check-out is after check-in
bookingSchema.pre('save', function (next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error('Check-out date must be after check-in date'))
  }
  next()
})

bookingSchema.index({ guest: 1, status: 1 })
bookingSchema.index({ listing: 1, status: 1 })
bookingSchema.index({ checkIn: 1, checkOut: 1 })

const Reservation = mongoose.model('Reservation', bookingSchema)
export default Reservation
