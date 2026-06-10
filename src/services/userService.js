import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const userService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.USERS.LIST, { params })
    return res.data
  },

  getById: async (id) => {
    const res = await api.get(ENDPOINTS.USERS.DETAIL(id))
    return res.data
  },

  update: async (id, data) => {
    const res = await api.put(ENDPOINTS.USERS.DETAIL(id), data)
    return res.data
  },

  delete: async (id) => {
    const res = await api.delete(ENDPOINTS.USERS.DETAIL(id))
    return res.data
  },
}
