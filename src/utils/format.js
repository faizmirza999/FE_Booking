export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export const STATUS_LABELS = {
  menunggu: 'Menunggu',
  dikonfirmasi: 'Dikonfirmasi',
  siap_diambil: 'Siap Diambil',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}

export const STATUS_TRANSITIONS = {
  menunggu: ['dikonfirmasi', 'dibatalkan'],
  dikonfirmasi: ['siap_diambil', 'dibatalkan'],
  siap_diambil: ['selesai', 'dibatalkan'],
  selesai: [],
  dibatalkan: [],
}

export const KATEGORI_OPTIONS = ['honda', 'vespa matic']
export const SATUAN_OPTIONS = ['pcs', 'set', 'liter', 'meter', 'pasang', 'buah']
