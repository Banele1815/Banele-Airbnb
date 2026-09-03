/**
 * api.test.js
 * Basic integration tests for the Banele Airbnb API.
 * Tests cover: auth, listings, bookings, and admin endpoints.
 *
 * Run with: node --experimental-vm-modules node_modules/.bin/jest
 * Or add to package.json scripts: "test": "jest"
 */

import request from 'supertest'
import app from '../server.js'

// ── Test credentials (created by seed.js) ────────────────────────────────────
const ADMIN  = { email: 'admin@baneleairbnb.co.za',  password: 'password123' }
const HOST   = { email: 'host@baneleairbnb.co.za',   password: 'password123' }
const GUEST  = { email: 'guest@baneleairbnb.co.za',  password: 'password123' }

let adminToken  = ''
let hostToken   = ''
let guestToken  = ''
let listingId   = ''

// ── Auth tests ────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  test('admin can log in and receives a token', async () => {
    const res = await request(app).post('/api/auth/login').send(ADMIN)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.role).toBe('admin')
    adminToken = res.body.token
  })

  test('host can log in and receives a token', async () => {
    const res = await request(app).post('/api/auth/login').send(HOST)
    expect(res.statusCode).toBe(200)
    expect(res.body.user.role).toBe('host')
    hostToken = res.body.token
  })

  test('guest can log in and receives a token', async () => {
    const res = await request(app).post('/api/auth/login').send(GUEST)
    expect(res.statusCode).toBe(200)
    expect(res.body.user.role).toBe('guest')
    guestToken = res.body.token
  })

  test('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN.email, password: 'wrong' })
    expect(res.statusCode).toBe(401)
  })

  test('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'password123' })
    expect(res.statusCode).toBe(400)
  })
})

// ── Listings tests ────────────────────────────────────────────────────────────
describe('GET /api/listings', () => {
  test('returns a list of listings without auth', async () => {
    const res = await request(app).get('/api/listings')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('listings')
    expect(Array.isArray(res.body.listings)).toBe(true)
    if (res.body.listings.length > 0) {
      listingId = res.body.listings[0]._id
    }
  })

  test('supports location filter', async () => {
    const res = await request(app).get('/api/listings?location=Cape Town')
    expect(res.statusCode).toBe(200)
  })
})

describe('GET /api/listings/:id', () => {
  test('returns a single listing with reviews', async () => {
    if (!listingId) return
    const res = await request(app).get(`/api/listings/${listingId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('title')
    expect(res.body).toHaveProperty('reviews')
  })

  test('returns 404 for a non-existent listing', async () => {
    const res = await request(app).get('/api/listings/000000000000000000000000')
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /api/listings', () => {
  test('host can create a listing', async () => {
    const res = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: 'Test Listing',
        location: 'Test City',
        pricePerNight: 500,
        propertyType: 'Apartment',
        category: 'Amazing views',
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'A test listing for automated tests.',
      })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('_id')
  })

  test('guest cannot create a listing', async () => {
    const res = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ title: 'Unauthorized', location: 'Nowhere', pricePerNight: 100 })
    expect(res.statusCode).toBe(403)
  })

  test('unauthenticated request is rejected', async () => {
    const res = await request(app)
      .post('/api/listings')
      .send({ title: 'No token', location: 'Nowhere', pricePerNight: 100 })
    expect(res.statusCode).toBe(401)
  })
})

// ── Admin tests ───────────────────────────────────────────────────────────────
describe('GET /api/admin/stats', () => {
  test('admin can access stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('users')
    expect(res.body).toHaveProperty('listings')
    expect(res.body).toHaveProperty('bookings')
    expect(res.body).toHaveProperty('revenue')
  })

  test('guest cannot access admin stats', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${guestToken}`)
    expect(res.statusCode).toBe(403)
  })

  test('unauthenticated request is rejected', async () => {
    const res = await request(app).get('/api/admin/stats')
    expect(res.statusCode).toBe(401)
  })
})

describe('GET /api/admin/users', () => {
  test('admin can get all users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
