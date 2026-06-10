import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute, GuestRoute } from './routes/ProtectedRoute'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

//  Auth
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Common
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'

// Sparepart (User)
import SparepartListPage from './pages/SparepartListPage'
import SparepartDetailPage from './pages/SparepartDetailPage'

// Booking (User)
import BookingListPage from './pages/BookingListPage'
import BookingDetailPage from './pages/BookingDetailPage'

//  Admin
import AdminSparepartPage from './pages/admin/AdminSparepartPage'
import AdminBookingPage from './pages/admin/AdminBookingPage'
import AdminUserPage from './pages/admin/AdminUserPage'
import LaporanPage from './pages/admin/LaporanPage'

// 404
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Guest-only routes */}
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Sparepart - visible to all logged-in users */}
              <Route path="/spareparts" element={<SparepartListPage />} />
              <Route path="/spareparts/:id" element={<SparepartDetailPage />} />

              {/* Booking - for regular users */}
              <Route path="/bookings" element={<BookingListPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/admin/spareparts" element={<AdminSparepartPage />} />
              <Route path="/admin/bookings" element={<AdminBookingPage />} />
              <Route path="/admin/users" element={<AdminUserPage />} />
              <Route path="/admin/laporan" element={<LaporanPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
