# Project Structure

```
Banele-Airbnb/
├── client/                          # React + Vite frontend
│   ├── index.html
│   ├── vite.config.js               # /api proxy → :5000
│   ├── tailwind.config.js           # airbnb brand colours
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                 # ReactDOM.createRoot, BrowserRouter
│       ├── App.jsx                  # AuthProvider, Layout wrapper, all Routes
│       ├── index.css                # Tailwind directives + .btn-primary / .input-field utilities
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.jsx       # Sticky nav, user dropdown, auth-aware links
│       │   │   ├── Footer.jsx
│       │   │   └── Layout.jsx       # flex-col min-h-screen wrapper
│       │   ├── common/
│       │   │   ├── Button.jsx       # primary / secondary / danger / ghost variants
│       │   │   ├── Input.jsx        # forwardRef, error + helper text, aria
│       │   │   ├── Modal.jsx        # Escape key, body-scroll lock, overlay close
│       │   │   ├── SearchBar.jsx    # location / check-in / check-out / guests
│       │   │   ├── StarRating.jsx   # interactive + readonly
│       │   │   └── Spinner.jsx      # fullPage or inline
│       │   └── listings/
│       │       └── ListingCard.jsx  # photo, wishlist toggle, rating, price
│       ├── pages/
│       │   ├── Home.jsx             # Hero, category filter, listings grid
│       │   ├── Listings.jsx         # Search-params-driven filtered grid
│       │   ├── ListingDetail.jsx    # Photo gallery, booking card, reviews
│       │   ├── Login.jsx
│       │   ├── Register.jsx         # Guest / host role selector
│       │   ├── Profile.jsx          # Edit info + change password
│       │   ├── CreateListing.jsx    # 3-step wizard (info → pricing/amenities → photos)
│       │   └── MyBookings.jsx       # Upcoming / past tabs, cancel, leave review
│       ├── context/
│       │   └── AuthContext.jsx      # login / register / logout, token in localStorage
│       ├── hooks/
│       │   ├── useListings.js
│       │   ├── useBookings.js
│       │   └── useRequireAuth.js    # Role-aware redirect
│       ├── services/
│       │   ├── api.js               # Axios instance, JWT + 401 interceptors
│       │   ├── authService.js
│       │   ├── listingService.js
│       │   ├── bookingService.js
│       │   └── reviewService.js
│       └── utils/
│           ├── formatters.js        # formatPrice, formatDateRange, calcNights, truncate
│           └── constants.js         # PROPERTY_TYPES, CATEGORIES, AMENITIES, enums
│
├── server/                          # Node + Express backend
│   ├── index.js                     # App entry: CORS, routes, static uploads, error handlers
│   ├── config/
│   │   └── db.js                    # Mongoose connect
│   ├── models/
│   │   ├── User.js                  # bcrypt pre-save, comparePassword, toJSON strips password
│   │   ├── Listing.js               # text index, avgRating/reviewCount denormalised
│   │   ├── Booking.js               # date validation, reviewed flag
│   │   └── Review.js                # post-save hook recalcs listing rating
│   ├── controllers/
│   │   ├── authController.js        # register, login, getMe, updateMe
│   │   ├── listingController.js     # CRUD + filters + pagination
│   │   ├── bookingController.js     # create (conflict check), cancel, confirm
│   │   └── reviewController.js      # create, list, delete
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── reviewRoutes.js
│   ├── middleware/
│   │   ├── auth.js                  # protect (JWT), requireHost (role guard)
│   │   └── errorHandler.js          # notFound + central error handler
│   └── utils/                       # (reserved for server-side helpers)
│
├── uploads/                         # Served at /uploads (gitignored)
├── .env.example
├── .gitignore
└── package.json                     # "type":"module", concurrently dev script
```

## Route Map

| Method | Path                        | Auth         | Description                    |
|--------|-----------------------------|--------------|--------------------------------|
| POST   | /api/auth/register          | Public       | Create account                 |
| POST   | /api/auth/login             | Public       | Log in, receive JWT            |
| GET    | /api/auth/me                | protect      | Get current user               |
| PUT    | /api/auth/me                | protect      | Update profile / password      |
| GET    | /api/listings               | Public       | List with filters + pagination |
| GET    | /api/listings/my            | protect      | Host's own listings            |
| GET    | /api/listings/:id           | Public       | Single listing + reviews       |
| POST   | /api/listings               | requireHost  | Create listing                 |
| PUT    | /api/listings/:id           | requireHost  | Update listing (owner only)    |
| DELETE | /api/listings/:id           | requireHost  | Delete listing (owner only)    |
| POST   | /api/bookings               | protect      | Create booking                 |
| GET    | /api/bookings/my            | protect      | Guest's bookings               |
| GET    | /api/bookings/host          | requireHost  | Bookings on host's listings    |
| PUT    | /api/bookings/:id/cancel    | protect      | Cancel booking                 |
| PUT    | /api/bookings/:id/confirm   | requireHost  | Confirm booking                |
| POST   | /api/reviews                | protect      | Submit review                  |
| GET    | /api/reviews/listing/:id    | Public       | Reviews for a listing          |
| DELETE | /api/reviews/:id            | protect      | Delete own review              |

## Conventions

- **Components**: PascalCase filenames (`ListingCard.jsx`), one component per file
- **Hooks**: camelCase prefixed with `use` (`useAuth.js`, `useListings.js`)
- **Services**: camelCase, grouped by domain (`listingService.js`, `bookingService.js`)
- **Routes (frontend)**: kebab-case URL paths (`/listings/:id`, `/my-bookings`)
- **Models**: PascalCase singular (`Listing`, `User`, `Booking`, `Review`)
- **Controllers**: camelCase, named after route resource (`listingController.js`)
- **ESM**: both `server/` and `client/` use ES module syntax (`import`/`export`)

## Key Data Relationships
- A `User` can be both a host and a guest (role field: `'guest'` | `'host'`)
- A `Listing` belongs to one host (`User`)
- A `Booking` links a guest (`User`) to a `Listing` with check-in/out dates and status
- A `Review` is linked to one `Booking` (unique constraint) — only completed bookings can be reviewed
- Saving a `Review` automatically recalculates `avgRating` and `reviewCount` on the parent `Listing`
