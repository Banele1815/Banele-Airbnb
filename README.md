# Banele Airbnb Clone

A full-stack Airbnb clone built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT
- **Image uploads**: Multer

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A MongoDB Atlas account (or local MongoDB)

### 2. Environment setup
Copy `.env.example` to `.env` in the project root and fill in your values:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/banele-airbnb?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Install dependencies
```bash
# Root (server) dependencies
npm install

# Client dependencies
cd client && npm install && cd ..
```

### 4. Seed the database (recommended — adds 12 SA listings + demo users)
```bash
npm run seed
```

**Demo accounts** (password for all: `password123`):
| Role  | Email |
|-------|-------|
| Admin | admin@baneleairbnb.co.za |
| Host  | host@baneleairbnb.co.za |
| Guest | guest@baneleairbnb.co.za |

### 5. Run the app
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Available Routes

### Frontend
| Path | Description |
|------|-------------|
| `/` | Home — listings grid with category filter |
| `/listings` | Search results with filters |
| `/listings/:id` | Listing detail with booking card |
| `/listings/new` | Create listing (host/admin) |
| `/listings/:id/edit` | Edit listing (host/admin) |
| `/login` | Login |
| `/register` | Register (choose guest or host) |
| `/profile` | Edit profile |
| `/my-bookings` | View and manage bookings |
| `/admin` | Admin dashboard (admin only) |
| `/admin/listings` | Manage all listings |
| `/admin/users` | Manage users + roles |
| `/admin/bookings` | View all bookings |

### API Endpoints
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Token |
| PUT | `/api/auth/me` | Token |
| GET | `/api/listings` | Public |
| GET | `/api/listings/:id` | Public |
| POST | `/api/listings` | Host/Admin |
| PUT | `/api/listings/:id` | Host/Admin |
| DELETE | `/api/listings/:id` | Host/Admin |
| POST | `/api/bookings` | Token |
| GET | `/api/bookings/my` | Token |
| PUT | `/api/bookings/:id/cancel` | Token |
| POST | `/api/reviews` | Token |
| POST | `/api/upload` | Token |
| GET | `/api/admin/*` | Admin |
| GET | `/api/accommodations` | Alias → listings |
| GET | `/api/reservations` | Alias → bookings |

---

## Project Structure
```
Banele-Airbnb/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # Route pages
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── utils/
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── index.js
│   └── seed.js
├── .env.example
└── package.json
```
