import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBookings, useCancelBooking } from '../hooks/useBookings'
import { formatCurrency, formatDate, STATUS_LABELS } from '../utils/format'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmDialog from '../components/ConfirmDialog'

export default function BookingListPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [cancelId, setCancelId] = useState(null)

  const { data, isLoading, isError, error } = useBookings({
    page,
    limit: 10,
    status: status || undefined,
  })

  const cancelBooking = useCancelBooking()
  const bookings = data?.data || []

  const statusList = ['', 'menunggu', 'dikonfirmasi', 'siap_diambil', 'selesai', 'dibatalkan']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Booking Saya</h1>
          <p className="text-sm text-gray-500 mt-0.5">Riwayat dan status booking Anda</p>
        </div>
        <Link to="/spareparts" className="btn-primary">
          + Booking Baru
        </Link>
      </div>

      {/* Filter Status */}
      <div className="flex gap-2 flex-wrap">
        {statusList.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              status === s
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s ? STATUS_LABELS[s] : 'Semua'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message={error?.response?.data?.message} />
      ) : bookings.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 mb-3">Belum ada booking</p>
          <Link to="/spareparts" className="btn-primary inline-flex">Pesan Sparepart</Link>
        </div>
      ) : (
        <div className="card p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">No. Booking</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Tgl Booking</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Tgl Ambil</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Item</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/bookings/${b.id}`} className="font-mono text-xs text-blue-600 hover:underline">
                        {b.nomorBooking}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{formatDate(b.tanggalBooking)}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{formatDate(b.tanggalAmbil)}</td>
                    <td className="py-3 px-4 text-gray-600">{b.items?.length || 0} item</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{formatCurrency(b.totalHarga)}</td>
                    <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/bookings/${b.id}`} className="text-xs text-blue-600 hover:underline">Detail</Link>
                        {b.status === 'menunggu' && (
                          <button
                            onClick={() => setCancelId(b.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4">
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={async () => {
          await cancelBooking.mutateAsync(cancelId)
          setCancelId(null)
        }}
        loading={cancelBooking.isPending}
        title="Batalkan Booking"
        message="Apakah Anda yakin ingin membatalkan booking ini? Stok akan dikembalikan."
        confirmText="Ya, Batalkan"
        confirmClass="btn-danger"
      />
    </div>
  )
}
