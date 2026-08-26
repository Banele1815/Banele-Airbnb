# Technology Stack

## Frontend (Public Site + Admin Dashboard)
- **Framework**: React.js
- **Styling**: CSS — consistent styling across the whole application
- **Routing**: client-side routing that updates the URL to reflect the current view (React Router recommended)
- **State**: local/component state for dynamic UI (cost calculator, filters, form fields, dropdowns)
- **File handling**: image upload + display on Create/Update Listing forms (optional per brief, but expected for full marks)

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose — schemas for Accommodation, Reservation, User
- **Auth**: JWT (JSON Web Tokens) for login sessions and protecting routes
- **File uploads**: Multer for multipart/form-data (image uploads) — optional per brief

## Recommended Data Shapes

### User
```js
{
  username: 'John Doe',
  password: 'password123',
  role: 'user', // or 'host'
}
```

### Accommodation / Reservation
```js
{
  id: 1,
  images: ["/images/new-york-lady-of-liberty.jpg"],
  type: "Entire apartment",
  location: "New York",
  guests: 4,
  bedrooms: 2,
  bathrooms: 2,
  amenities: ["wifi", "kitchen", "free parking"],
  rating: 4.5,
  reviews: 320,
  price: 320,
  title: "Modern Apartment in New York",
  host: "Johann",
  host_id: "6676f16fdace0e26aed41e79",
  weeklyDiscount: 0,
  cleaningFee: 50,
  serviceFee: 50,
  occupancyTaxes: 30,
  enhancedCleaning: true,
  selfCheckIn: true,
  description: "Stay in the heart of New York City...",
  specificRatings: {
    cleanliness: 4.8,
    communication: 4.7,
    checkIn: 4.9,
    accuracy: 4.6,
    location: 4.9,
    value: 4.5,
  }
}
```

## Conventions & Standards
- JWT used for both admin-dashboard auth and any protected API routes
- Proper HTTP status codes and consistent error-handling middleware throughout the backend
- Modular, reusable, commented code — small, single-purpose functions
- Mongoose schemas define validation/relationships at the model layer
- Clean separation of concerns: controllers handle logic, routes handle endpoints, middleware handles cross-cutting concerns (auth)

## Scope Notes
- Multer/image upload is marked **optional** in the brief but is scored as part of the Create/Update Listing rubric line, so it's worth implementing.
- Accommodation CRUD logic itself is graded under the **Backend** rubric, not the **Admin Dashboard** rubric — the dashboard just needs to call those endpoints correctly.