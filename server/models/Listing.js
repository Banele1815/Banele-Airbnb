import mongoose from 'mongoose'

const listingSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [1, 'Price must be at least R1'],
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Studio', 'Farm'],
      default: 'Apartment',
    },
    category: {
      type: String,
      enum: ['Beachfront', 'Cabins', 'Amazing views', 'Tiny homes', 'Farms', 'Luxury', 'Pools', 'Countryside', ''],
      default: '',
    },
    maxGuests: {
      type: Number,
      required: true,
      min: [1, 'Must allow at least 1 guest'],
      default: 1,
    },
    bedrooms: {
      type: Number,
      min: 0,
      default: 1,
    },
    bathrooms: {
      type: Number,
      min: 1,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    photos: {
      type: [String],
      default: [],
    },
    weeklyDiscount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    cleaningFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    serviceFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    occupancyTaxes: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Denormalised for quick reads — updated by review post-save hook
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Text index for search
listingSchema.index({ title: 'text', location: 'text', description: 'text' })
listingSchema.index({ host: 1 })
listingSchema.index({ location: 1 })
listingSchema.index({ pricePerNight: 1 })

const Listing = mongoose.model('Listing', listingSchema)
export default Listing
