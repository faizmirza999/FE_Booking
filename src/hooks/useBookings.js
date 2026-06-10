import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const BOOKING_KEYS = {
  all: ['bookings'],
  // sertakan userId agar cache tidak bocor antar user
  list: (userId, params) => ['bookings', 'list', userId, params],
  detail: (id) => ['bookings', 'detail', id],
}

export function useBookings(params = {}) {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: BOOKING_KEYS.list(userId, params),
    queryFn: () => bookingService.getAll(params),
    // jangan fetch jika belum ada user
    enabled: !!userId,
  })
}

export function useBooking(id) {
  return useQuery({
    queryKey: BOOKING_KEYS.detail(id),
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_KEYS.all })
      toast.success('Booking berhasil dibuat!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal membuat booking'),
  })
}

export function useUpdateStatusBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => bookingService.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_KEYS.all })
      toast.success('Status booking berhasil diubah')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal mengubah status'),
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bookingService.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_KEYS.all })
      toast.success('Booking berhasil dibatalkan')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal membatalkan booking'),
  })
}
