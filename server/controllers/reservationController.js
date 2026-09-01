import Reservation from '../models/Reservation.js'
import Accommodation from '../models/Accommodation.js'

// POST /api/bookings
export async function createBooking(req, res, next) {
  try {
    const { listing: listingId, checkIn, checkOut, guests, totalPrice } = req.body

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'listing, checkIn and checkOut are required.' })
    }

    const listing = await Accommodation.findById(listingId)
    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: 'Accommodation not found.' })
    }

    // Prevent hosts from booking their own listings
    if (listing.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own listing.' })
    }

    if (Number(guests) > listing.maxGuests) {
      return res.status(400).json({
        message: `This listing allows a maximum of ${listing.maxGuests} guests.`,
      })
    }

    // Check for date conflicts on confirmed/pending bookings
    const conflict = await Reservation.findOne({
      listing: listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    })

    if (conflict) {
      return res.status(409).json({ message: 'These dates are already booked.' })
    }

    const nights = Math.round(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    )
    const computedTotal = nights * listing.pricePerNight

    const booking = await Reservation.create({
      listing: listingId,
      guest: req.user._id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number(guests) || 1,
      totalPrice: totalPrice || computedTotal,
      status: 'confirmed',
    })

    await booking.populate('listing', 'title location photos pricePerNight')
    res.status(201).json(booking)
  } catch (err) {
    next(err)
  }
}

// GET /api/bookings/my  (guest)
export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Reservation.find({ guest: req.user._id })
      .populate('listing', 'title location photos pricePerNight')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    next(err)
  }
}

// GET /api/bookings/host  (host sees bookings on their listings)
export async function getHostBookings(req, res, next) {
  try {
    // Find all listings that belong to this host
    const listings = await Accommodation.find({ host: req.user._id }).select('_id')
    const listingIds = listings.map((l) => l._id)

    const bookings = await Reservation.find({ listing: { $in: listingIds } })
      .populate('listing', 'title location photos')
      .populate('guest', 'name email avatar')
      .sort({ createdAt: -1 })

    res.json(bookings)
  } catch (err) {
    next(err)
  }
}

// PUT /api/bookings/:id/cancel
export async function cancelBooking(req, res, next) {
  try {
    const booking = await Reservation.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Reservation not found.' })

    // Only the guest who made it (or the host of the listing) can cancel
    const isGuest = booking.guest.toString() === req.user._id.toString()
    const listing = await Accommodation.findById(booking.listing)
    const isHost = listing?.host.toString() === req.user._id.toString()

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorised to cancel this booking.' })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation is already cancelled.' })
    }
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking.' })
    }

    booking.status = 'cancelled'
    await booking.save()
    res.json(booking)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/reservations/:id  (brief-required hard delete)
export async function deleteReservation(req, res, next) {
  try {
    const booking = await Reservation.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Reservation not found.' })

    const isGuest = booking.guest.toString() === req.user._id.toString()
    const listing = await Accommodation.findById(booking.listing)
    const isHost = listing?.host.toString() === req.user._id.toString()

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorised to delete this reservation.' })
    }

    await booking.deleteOne()
    res.json({ message: 'Reservation deleted.' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/bookings/:id/confirm  (host only)
export async function confirmBooking(req, res, next) {
  try {
    const booking = await Reservation.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Reservation not found.' })

    const listing = await Accommodation.findById(booking.listing)
    if (listing?.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to confirm this booking.' })
    }

    booking.status = 'confirmed'
    await booking.save()
    res.json(booking)
  } catch (err) {
    next(err)
  }
}
