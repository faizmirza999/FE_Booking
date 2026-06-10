import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBookings, useUpdateStatusBooking } from '../../hooks/useBookings'
import { formatCurrency, formatDate, STATUS_LABELS, STATUS_TRANSITIONS } from '../../utils/format'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'
import ErrorMessage from '../../components/ErrorMessage'
import Modal from '../../components/Modal'

export default function AdminBookingPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [statusModal, setStatusModal] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [catatanAdmin, setCatatanAdmin] = useState('')

  const { data, isLoading, isError, error } = useBookings({
    page,
    limit: 10,
    status: status || undefined,
  })

  const updateStatus = useUpdateStatusBooking()
  const bookings = data?.data || []
  const statusList = ['', 'menunggu', 'dikonfirmasi', 'siap_diambil', 'selesai', 'dibatalkan']

  const openStatusModal = (booking) => {
    setStatusModal(booking)
    setNewStatus('')
    setCatatanAdmin(booking.catatanAdmin || '')
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) return
    await updateStatus.mutateAsync({ id: statusModal.id, data: { status: newStatus, catatanAdmin } })
    setStatusModal(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Kelola Booking</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manajemen semua booking sparepart</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {statusList.map((s) => (
          <button key={s || 'all'}
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              status === s
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {s ? STATUS_LABELS[s] : 'Semua'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message={error?.response?.data?.message} />
      ) : (
        <div className="card p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">No. Booking</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Tgl Booking</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Tgl Ambil</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">Tidak ada booking</td>
                  </tr>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/bookings/${b.id}`} className="font-mono text-xs text-blue-600 hover:underline">
                        {b.nomorBooking}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">{b.user?.nama}</p>
                      <p className="text-xs text-gray-400">{b.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{formatDate(b.tanggalBooking)}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{formatDate(b.tanggalAmbil)}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{formatCurrency(b.totalHarga)}</td>
                    <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/bookings/${b.id}`} className="text-xs text-blue-600 hover:underline">Detail</Link>
                        {STATUS_TRANSITIONS[b.status]?.length > 0 && (
                          <button onClick={() => openStatusModal(b)} className="text-xs text-green-600 hover:underline">
                            Ubah Status
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

      {/* Status Update Modal */}
      <Modal isOpen={!!statusModal} onClose={() => setStatusModal(null)} title="Ubah Status Booking" size="sm">
        {statusModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-500">Booking: <span className="font-mono font-medium text-gray-700">{statusModal.nomorBooking}</span></p>
              <p className="text-gray-500 mt-1">Status saat ini: <StatusBadge status={statusModal.status} /></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status Baru *</label>
              <div className="space-y-2">
                {STATUS_TRANSITIONS[statusModal.status]?.map((s) => (
                  <label key={s} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    newStatus === s ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input type="radio" value={s} checked={newStatus === s}
                      onChange={() => setNewStatus(s)} className="accent-blue-600" />
                    <StatusBadge status={s} />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Admin (opsional)</label>
              <textarea rows={3} className="input-field resize-none" value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                placeholder="Tambahkan catatan untuk user..." />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setStatusModal(null)} className="btn-secondary">Batal</button>
              <button onClick={handleUpdateStatus} disabled={!newStatus || updateStatus.isPending} className="btn-primary">
                {updateStatus.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
