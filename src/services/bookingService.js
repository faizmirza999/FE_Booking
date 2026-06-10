import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const bookingService = {
  create: async (data) => {
    const res = await api.post(ENDPOINTS.BOOKINGS.LIST, data)
    return res.data
  },

  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.BOOKINGS.LIST, { params })
    return res.data
  },

  getById: async (id) => {
    const res = await api.get(ENDPOINTS.BOOKINGS.DETAIL(id))
    return res.data
  },

  updateStatus: async (id, data) => {
    const res = await api.patch(ENDPOINTS.BOOKINGS.STATUS(id), data)
    return res.data
  },

  cancel: async (id) => {
    const res = await api.patch(ENDPOINTS.BOOKINGS.CANCEL(id))
    return res.data
  },
}
