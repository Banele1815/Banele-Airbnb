# Product Overview

## What This Is
An Airbnb clone made up of three integrated parts:
1. **Public Frontend** — a browsable listings site (Home, Location, Location Details pages)
2. **Admin Dashboard** — property management interface for hosts/admins
3. **Backend API** — Node.js/Express/MongoDB service powering both frontends

## Purpose
Recreate core Airbnb functionality end-to-end: browsing/searching accommodations, viewing listing details with a live cost calculator, making reservations, and (for admins) creating/updating/deleting listings — all behind JWT-based authentication.

## Target Users
- **Guests** — browse locations, view listing details, calculate costs, make reservations
- **Hosts/Admins** — log in, manage (CRUD) their property listings, view reservations for their properties

## Core Features

### Public Frontend
- **Home page**: hero banner with CTA, "Inspiration for your next trip" location cards, "Discover Airbnb Experiences," "Things to do on your trip / at home," ShopAirbnb section, "Inspiration for future getaways" tabs, static footer + copyright footer
- **Location page**: filterable list of location cards (type, name, amenities, rating, reviews, price/night) with a heading showing total accommodations for the selected location
- **Location Details page**: heading + subheading, rating/location, image gallery (1 large + 4 small), two-column layout (left: accommodation details, right: cost calculator), dynamic cost calculator (nightly rate × nights, weekly discount, cleaning fee, service fee, occupancy taxes) with date pickers and guest count, reservation button that writes to MongoDB
- **Top header**: logo, location filter, profile section (login page or view reservations table)

### Admin Dashboard
- **Top header**: logo + nav links; greeting with username + dropdown (view reservations, log out) when logged in; "Become a host" link when logged out
- **Login page**: email/password form with input validation and clear error messages; redirects to dashboard on success
- **Create Listing page**: full field set (title, location, description, bedrooms, bathrooms, guests, type, price, amenities, images, weekly discount, cleaning fee, service fee, occupancy taxes) with validation and image upload
- **View Listings page**: list of listings (title, location, price, main image) with update/delete actions
- **Update Listing page**: same form as Create, pre-filled with existing data; saves and reflects changes
- JWT-based auth guarding dashboard access; session maintained across navigation

### Backend API
- Accommodation CRUD (create, read all, delete)
- User login (authentication)
- Reservation CRUD (create, get by host, get by user, delete)
- JWT auth middleware protecting relevant routes

## Success Criteria
Graded against three separate rubrics:
- Admin Dashboard — /100
- Frontend — /140
- Backend — /150

Scoring covers functionality, styling/responsiveness, authentication, navigation/routing, error handling & user feedback, and code quality/documentation (clean, modular, commented code).