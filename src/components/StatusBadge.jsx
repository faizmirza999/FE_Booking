import { STATUS_LABELS } from '../utils/format'

const BADGE_CLASS = {
  menunggu:     'bg-amber-100 text-amber-700',
  dikonfirmasi: 'bg-sky-100 text-sky-700',
  siap_diambil: 'bg-violet-100 text-violet-700',
  selesai:      'bg-emerald-100 text-emerald-700',
  dibatalkan:   'bg-red-100 text-red-600',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${BADGE_CLASS[status] || 'bg-dark-100 text-dark-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
