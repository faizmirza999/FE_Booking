import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export const authService = {
  login: async (data) => {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, data)
    return res.data
  },

  register: async (data) => {
    const res = await api.post(ENDPOINTS.AUTH.REGISTER, data)
    return res.data
  },

  getMe: async () => {
    const res = await api.get(ENDPOINTS.AUTH.ME)
    return res.data
  },

  updateProfile: async (data) => {
    const res = await api.put(ENDPOINTS.AUTH.PROFILE, data)
    return res.data
  },
}
