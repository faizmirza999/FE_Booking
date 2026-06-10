import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const sparepartService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.SPAREPARTS.LIST, { params })
    return res.data
  },

  getById: async (id) => {
    const res = await api.get(ENDPOINTS.SPAREPARTS.DETAIL(id))
    return res.data
  },

  create: async (formData) => {
    const res = await api.post(ENDPOINTS.SPAREPARTS.LIST, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  update: async (id, data) => {
    const res = await api.put(ENDPOINTS.SPAREPARTS.DETAIL(id), data)
    return res.data
  },

  delete: async (id) => {
    const res = await api.delete(ENDPOINTS.SPAREPARTS.DETAIL(id))
    return res.data
  },

  updateStok: async (id, stok) => {
    const res = await api.patch(ENDPOINTS.SPAREPARTS.STOK(id), { stok })
    return res.data
  },
}
