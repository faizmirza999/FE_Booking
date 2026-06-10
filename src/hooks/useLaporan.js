import { useQuery } from '@tanstack/react-query'
import { laporanService } from '../services/laporanService'

export function useLaporanPenjualan(params = {}) {
  return useQuery({
    queryKey: ['laporan', 'penjualan', params],
    queryFn: () => laporanService.getBookingSelesai(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useLaporanSemua(params = {}) {
  return useQuery({
    queryKey: ['laporan', 'semua', params],
    queryFn: () => laporanService.getAllBookings(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useLaporanStok() {
  return useQuery({
    queryKey: ['laporan', 'stok'],
    queryFn: () => laporanService.getSpareparts(),
    staleTime: 1000 * 60 * 2,
  })
}
