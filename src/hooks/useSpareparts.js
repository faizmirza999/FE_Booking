import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sparepartService } from '../services/sparepartService'
import toast from 'react-hot-toast'

export const SPAREPART_KEYS = {
  all: ['spareparts'],
  list: (params) => ['spareparts', 'list', params],
  detail: (id) => ['spareparts', 'detail', id],
}

export function useSpareparts(params = {}) {
  return useQuery({
    queryKey: SPAREPART_KEYS.list(params),
    queryFn: () => sparepartService.getAll(params),
  })
}

export function useSparepart(id) {
  return useQuery({
    queryKey: SPAREPART_KEYS.detail(id),
    queryFn: () => sparepartService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSparepart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sparepartService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SPAREPART_KEYS.all })
      toast.success('Sparepart berhasil ditambahkan')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menambahkan sparepart'),
  })
}

export function useUpdateSparepart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => sparepartService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SPAREPART_KEYS.all })
      toast.success('Sparepart berhasil diperbarui')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal memperbarui sparepart'),
  })
}

export function useDeleteSparepart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sparepartService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SPAREPART_KEYS.all })
      toast.success('Sparepart berhasil dinonaktifkan')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal menghapus sparepart'),
  })
}

export function useUpdateStok() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stok }) => sparepartService.updateStok(id, stok),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SPAREPART_KEYS.all })
      toast.success('Stok berhasil diperbarui')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Gagal memperbarui stok'),
  })
}
