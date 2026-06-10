import api from '../api/axios'

export const laporanService = {
  /**
   * Ambil semua booking selesai untuk laporan
   * Tidak ada limit — ambil semua sekaligus dengan pagination besar
   */
  getBookingSelesai: async (params = {}) => {
    const res = await api.get('/bookings', {
      params: { status: 'selesai', limit: 1000, page: 1, ...params },
    })
    return res.data
  },

  /**
   * Ringkasan: semua status untuk statistik
   */
  getAllBookings: async (params = {}) => {
    const res = await api.get('/bookings', {
      params: { limit: 1000, page: 1, ...params },
    })
    return res.data
  },

  /**
   * Semua sparepart untuk laporan stok
   */
  getSpareparts: async () => {
    const res = await api.get('/spareparts', { params: { limit: 1000, page: 1 } })
    return res.data
  },
}
