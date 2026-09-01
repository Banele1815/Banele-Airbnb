import Accommodation from '../models/Accommodation.js'
import Review from '../models/Review.js'

// GET /api/listings
export async function getListings(req, res, next) {
  try {
    const {
      location, category, minPrice, maxPrice,
      guests, page = 1, limit = 20, search,
    } = req.query

    const filter = { isActive: true }

    if (location) {
      filter.location = { $regex: location, $options: 'i' }
    }
    if (category) {
      filter.category = category
    }
    if (minPrice || maxPrice) {
      filter.pricePerNight = {}
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice)
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice)
    }
    if (guests) {
      filter.maxGuests = { $gte: Number(guests) }
    }
    if (search) {
      filter.$text = { $search: search }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [listings, total] = await Promise.all([
      Accommodation.find(filter)
        .populate('host', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Accommodation.countDocuments(filter),
    ])

    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/listings/my
export async function getMyListings(req, res, next) {
  try {
    const listings = await Accommodation.find({ host: req.user._id }).sort({ createdAt: -1 })
    res.json(listings)
  } catch (err) {
    next(err)
  }
}

// GET /api/listings/:id
export async function getListing(req, res, next) {
  try {
    const listing = await Accommodation.findById(req.params.id).populate('host', 'name avatar bio')
    if (!listing) return res.status(404).json({ message: 'Accommodation not found.' })

    // Attach reviews
    const reviews = await Review.find({ listing: listing._id })
      .populate('guest', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ ...listing.toObject(), reviews })
  } catch (err) {
    next(err)
  }
}

// POST /api/listings
export async function createListing(req, res, next) {
  try {
    const listing = await Accommodation.create({ ...req.body, host: req.user._id })
    res.status(201).json(listing)
  } catch (err) {
    next(err)
  }
}

// PUT /api/listings/:id
export async function updateListing(req, res, next) {
  try {
    const listing = await Accommodation.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Accommodation not found.' })

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to update this listing.' })
    }

    const updated = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/listings/:id
export async function deleteListing(req, res, next) {
  try {
    const listing = await Accommodation.findById(req.params.id)
    if (!listing) return res.status(404).json({ message: 'Accommodation not found.' })

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this listing.' })
    }

    await listing.deleteOne()
    res.json({ message: 'Accommodation deleted.' })
  } catch (err) {
    next(err)
  }
}
