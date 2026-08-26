/**
 * Seed script — populates the database with SA demo listings and users.
 * Run once: node server/seed.js
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from './config/db.js'
import User from './models/User.js'
import Listing from './models/Listing.js'
import Booking from './models/Booking.js'
import Review from './models/Review.js'

const LISTINGS = [
  {
    title: 'Luxury Sea-View Villa – Clifton',
    description:
      'Perched above the iconic Clifton beaches, this stunning villa offers breathtaking Atlantic Ocean views. White-washed walls, a private infinity pool, and direct beach access make this the ultimate Cape Town escape. Perfect for families and groups seeking a premium coastal retreat.',
    location: 'Clifton, Cape Town',
    pricePerNight: 8500,
    propertyType: 'Villa',
    category: 'Beachfront',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Air conditioning', 'Parking', 'TV'],
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 10,
    cleaningFee: 850,
    serviceFee: 500,
    occupancyTaxes: 250,
  },
  {
    title: 'Cosy Garden Cottage – Stellenbosch Wine Country',
    description:
      'Nestled in the heart of the Cape Winelands, this charming stone cottage sits on a working wine estate. Wake up to mountain views, enjoy complimentary wine tastings, and explore the historic town just 5 minutes away. Ideal for couples and wine enthusiasts.',
    location: 'Stellenbosch, Western Cape',
    pricePerNight: 2200,
    propertyType: 'Cottage',
    category: 'Countryside',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Heating', 'Parking', 'TV'],
    photos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 15,
    cleaningFee: 300,
    serviceFee: 200,
    occupancyTaxes: 100,
  },
  {
    title: 'Modern Sandton Apartment – Heart of Johannesburg',
    description:
      'Sleek, contemporary apartment in the prestigious Sandton CBD. Floor-to-ceiling windows showcase the city skyline. Walking distance to Sandton City Mall, Nelson Mandela Square, and the Gautrain station. Perfect for business travellers and urban explorers.',
    location: 'Sandton, Johannesburg',
    pricePerNight: 1800,
    propertyType: 'Apartment',
    category: 'Amazing views',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'TV', 'Kitchen', 'Air conditioning', 'Gym', 'Parking'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 8,
    cleaningFee: 400,
    serviceFee: 300,
    occupancyTaxes: 150,
  },
  {
    title: 'Beachfront Bungalow – Umhlanga Rocks',
    description:
      'Step directly onto the golden sands of Umhlanga from this bright beachfront bungalow. Feel the warm Indian Ocean breeze, watch dolphins from the deck, and enjoy the vibrant promenade just steps away. Surfing, swimming, and sunset dining all within reach.',
    location: 'Umhlanga, KwaZulu-Natal',
    pricePerNight: 3200,
    propertyType: 'House',
    category: 'Beachfront',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['WiFi', 'Air conditioning', 'Kitchen', 'TV', 'Parking'],
    photos: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 12,
    cleaningFee: 500,
    serviceFee: 350,
    occupancyTaxes: 200,
  },
  {
    title: 'Drakensberg Mountain Cabin – Hiker\'s Paradise',
    description:
      'Escape to this rustic log cabin nestled in the foothills of the uKhahlamba Drakensberg. Surrounded by dramatic peaks and rolling grasslands, it\'s the perfect base for hiking, birding, and stargazing. A wood-burning fireplace keeps you warm on cool mountain nights.',
    location: 'Drakensberg, KwaZulu-Natal',
    pricePerNight: 1500,
    propertyType: 'Cabin',
    category: 'Cabins',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Heating', 'Kitchen', 'Parking'],
    photos: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 20,
    cleaningFee: 250,
    serviceFee: 150,
    occupancyTaxes: 80,
  },
  {
    title: 'Luxury Game Lodge – Waterberg Bushveld',
    description:
      'Experience the authentic African bush in this exclusive private game lodge. Fall asleep to the sounds of the wild and wake up for sunrise game drives. The lodge features a private plunge pool, outdoor shower, and boma for evening sundowners under the stars.',
    location: 'Waterberg, Limpopo',
    pricePerNight: 5500,
    propertyType: 'Villa',
    category: 'Luxury',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'Pool', 'Air conditioning', 'Kitchen', 'Parking'],
    photos: [
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 5,
    cleaningFee: 800,
    serviceFee: 600,
    occupancyTaxes: 300,
  },
  {
    title: 'Knysna Lagoon Houseboat',
    description:
      'A truly unique stay — a beautifully converted houseboat moored on the tranquil Knysna Lagoon. Watch the tides change, spot local birdlife, and kayak directly from your front deck. The iconic Knysna Heads are visible from the upper sun deck.',
    location: 'Knysna, Garden Route',
    pricePerNight: 2800,
    propertyType: 'Loft',
    category: 'Amazing views',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'TV', 'Air conditioning'],
    photos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 10,
    cleaningFee: 450,
    serviceFee: 280,
    occupancyTaxes: 140,
  },
  {
    title: 'Bo-Kaap Heritage Apartment – Cape Town',
    description:
      'Live like a local in one of Cape Town\'s most vibrant and colourful neighbourhoods. This restored apartment features original Cape Malay architecture, cobblestone street views, and is a short walk from the V&A Waterfront and De Waterkant. A cultural gem.',
    location: 'Bo-Kaap, Cape Town',
    pricePerNight: 1600,
    propertyType: 'Apartment',
    category: 'Countryside',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'TV', 'Air conditioning'],
    photos: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 10,
    cleaningFee: 300,
    serviceFee: 200,
    occupancyTaxes: 100,
  },
  {
    title: 'Franschhoek Farm Stay – Winelands Retreat',
    description:
      'A spacious farmhouse set on a working lavender farm in the Franschhoek valley. Surrounded by vineyards and mountain scenery, guests enjoy a private patio, farm-fresh breakfasts, and easy access to the village\'s world-class restaurants and galleries.',
    location: 'Franschhoek, Western Cape',
    pricePerNight: 3400,
    propertyType: 'Farm',
    category: 'Farms',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['WiFi', 'Kitchen', 'Heating', 'Parking', 'Pet-friendly'],
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 15,
    cleaningFee: 550,
    serviceFee: 400,
    occupancyTaxes: 200,
  },
  {
    title: 'Panoramic Studio – Signal Hill, Cape Town',
    description:
      'A stylish, compact studio with sweeping panoramic views over Cape Town, the harbour and Table Mountain. Features a private roof terrace perfect for sundowners. Centrally located near De Waterkant, Green Point, and the V&A Waterfront.',
    location: 'Green Point, Cape Town',
    pricePerNight: 1200,
    propertyType: 'Studio',
    category: 'Amazing views',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'TV', 'Kitchen', 'Air conditioning', 'Dedicated workspace'],
    photos: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 10,
    cleaningFee: 200,
    serviceFee: 150,
    occupancyTaxes: 75,
  },
  {
    title: 'Plettenberg Bay Beach House',
    description:
      'A large, airy beach house just metres from the famous Robberg Beach. Spacious open-plan living, a wrap-around deck for whale watching, and a braai area for South African sundowners. One of the country\'s most sought-after coastal towns.',
    location: 'Plettenberg Bay, Garden Route',
    pricePerNight: 4200,
    propertyType: 'House',
    category: 'Beachfront',
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 3,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Parking', 'TV', 'Washing machine', 'Pet-friendly'],
    photos: [
      'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469796466635-455ede028aca?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 15,
    cleaningFee: 700,
    serviceFee: 450,
    occupancyTaxes: 220,
  },
  {
    title: 'Luxury Penthouse – V&A Waterfront, Cape Town',
    description:
      'The pinnacle of Cape Town luxury. This penthouse apartment sits directly on the V&A Waterfront with unobstructed views of Table Mountain, Robben Island, and the Atlantic Ocean. Features a rooftop jacuzzi, private cinema, and concierge service. An unforgettable experience.',
    location: 'V&A Waterfront, Cape Town',
    pricePerNight: 12000,
    propertyType: 'Apartment',
    category: 'Luxury',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['WiFi', 'Pool', 'Hot tub', 'TV', 'Kitchen', 'Air conditioning', 'Gym', 'Parking', 'Dedicated workspace'],
    photos: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&auto=format&fit=crop',
    ],
    weeklyDiscount: 8,
    cleaningFee: 1500,
    serviceFee: 900,
    occupancyTaxes: 500,
  },
]

async function seed() {
  await connectDB()
  console.log('🌱  Seeding database…')

  // Clear existing data
  await Promise.all([
    Review.deleteMany(),
    Booking.deleteMany(),
    Listing.deleteMany(),
    User.deleteMany(),
  ])
  console.log('🗑   Cleared existing data')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const [adminUser, hostUser, guestUser] = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@baneleairbnb.co.za',
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform administrator.',
    },
    {
      name: 'Banele Dlamini',
      email: 'host@baneleairbnb.co.za',
      password: hashedPassword,
      role: 'host',
      bio: 'South African property host with listings across the Western Cape and KZN.',
    },
    {
      name: 'Thembi Nkosi',
      email: 'guest@baneleairbnb.co.za',
      password: hashedPassword,
      role: 'guest',
      bio: 'Avid traveller and food lover.',
    },
  ])

  console.log('👤  Created 3 users (admin / host / guest — password: password123)')

  // Create listings
  const listingDocs = await Listing.insertMany(
    LISTINGS.map((l) => ({ ...l, host: hostUser._id }))
  )
  console.log(`🏠  Created ${listingDocs.length} listings`)

  // Create 2 sample bookings
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const inThreeDays = new Date()
  inThreeDays.setDate(inThreeDays.getDate() + 4)

  await Booking.insertMany([
    {
      listing: listingDocs[0]._id,
      guest: guestUser._id,
      checkIn: tomorrow,
      checkOut: inThreeDays,
      guests: 2,
      totalPrice: listingDocs[0].pricePerNight * 3,
      status: 'confirmed',
    },
    {
      listing: listingDocs[2]._id,
      guest: guestUser._id,
      checkIn: new Date('2025-01-10'),
      checkOut: new Date('2025-01-15'),
      guests: 2,
      totalPrice: listingDocs[2].pricePerNight * 5,
      status: 'completed',
      reviewed: true,
    },
  ])
  console.log('📅  Created 2 sample bookings')

  // Create 2 sample reviews
  await Review.insertMany([
    {
      listing: listingDocs[0]._id,
      guest: guestUser._id,
      booking: (await Booking.findOne({ guest: guestUser._id, listing: listingDocs[0]._id }))._id,
      rating: 5,
      comment: 'Absolutely stunning villa! The views over Clifton Beach are unreal. The pool is incredible and the host was super responsive. Will definitely be back.',
    },
    {
      listing: listingDocs[2]._id,
      guest: guestUser._id,
      booking: (await Booking.findOne({ guest: guestUser._id, listing: listingDocs[2]._id }))._id,
      rating: 4,
      comment: 'Great location in Sandton. The apartment is exactly as described — clean, modern and well-equipped. Slight traffic noise but nothing major.',
    },
  ])
  console.log('⭐  Created 2 sample reviews')

  console.log('\n✅  Seed complete!\n')
  console.log('Demo credentials (password: password123)')
  console.log('  Admin : admin@baneleairbnb.co.za')
  console.log('  Host  : host@baneleairbnb.co.za')
  console.log('  Guest : guest@baneleairbnb.co.za')
  console.log()

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
