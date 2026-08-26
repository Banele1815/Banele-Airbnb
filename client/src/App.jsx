import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import Spinner from './components/common/Spinner'

// Pages
import Home from './pages/Home'
import Listings from './pages/Listings'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import MyBookings from './pages/MyBookings'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminListings from './pages/admin/AdminListings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'

/**
 * ProtectedRoute — redirects unauthenticated users to /login.
 * @param {string|string[]} role  optional required role(s)
 */
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  if (role) {
    const allowed = Array.isArray(role) ? role : [role]
    if (!allowed.includes(user.role)) return <Navigate to="/" replace />
  }
  return children
}

/** AdminRoute — requires admin role, wraps in AdminLayout */
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <AdminLayout>{children}</AdminLayout>
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-7xl font-bold text-airbnb-red mb-4">404</p>
      <h1 className="text-2xl font-semibold text-airbnb-dark mb-2">Page not found</h1>
      <p className="text-airbnb-gray mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary inline-block">Go home</a>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Admin routes — own layout, NO main Layout wrapper ── */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/listings" element={<AdminRoute><AdminListings /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />

        {/* ── All other routes wrapped in main Layout ── */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/*
                  IMPORTANT: /listings/new must be declared BEFORE /listings/:id
                  so React Router doesn't treat "new" as a dynamic :id segment.
                */}
                <Route
                  path="/listings/new"
                  element={
                    <ProtectedRoute role={['host', 'admin']}>
                      <CreateListing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listings/:id/edit"
                  element={
                    <ProtectedRoute role={['host', 'admin']}>
                      <UpdateListing />
                    </ProtectedRoute>
                  }
                />
                <Route path="/listings/:id" element={<ListingDetail />} />

                {/* Protected — any authenticated user */}
                <Route
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                  path="/my-bookings"
                  element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
