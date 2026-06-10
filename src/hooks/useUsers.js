import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

export const USER_KEYS = {
  all: ['users'],
  list: (params) => ['users', 'list', params],
  detail: (id) => ['users', 'detail', id],
}

export function useUsers(params = {}) {
  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => userService.getAll(params),
  })
}

export function useUser(id) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all })
      toast.success('User berhasil diperbarui')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal memperbarui user'),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all })
      toast.success('User berhasil dihapus')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus user'),
  })
}
