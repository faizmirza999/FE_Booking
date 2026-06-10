export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },
  // Sparepart
  SPAREPARTS: {
    LIST: '/spareparts',
    DETAIL: (id) => `/spareparts/${id}`,
    STOK: (id) => `/spareparts/${id}/stok`,
  },
  // Booking
  BOOKINGS: {
    LIST: '/bookings',
    DETAIL: (id) => `/bookings/${id}`,
    STATUS: (id) => `/bookings/${id}/status`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
  },
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
  },
}
