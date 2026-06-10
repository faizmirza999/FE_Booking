import { useParams, useNavigate } from 'react-router-dom'
import { useBooking, useCancelBooking } from '../hooks/useBookings'
import { formatCurrency, formatDate, formatDateTime } from '../utils/format'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmDialog from '../components/ConfirmDialog'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { data, isLoading, isError, error } = useBooking(id)
  const cancelBooking = useCancelBooking()
  const [cancelConfirm, setCancelConfirm] = useState(false)

  const booking = data?.data

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage message={error?.response?.data?.message} />
  if (!booking) return null

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Detail Booking</h1>
          <p className="text-sm font-mono text-gray-500">{booking.nomorBooking}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={booking.status} /></div>
      </div>

      {/* Booking Info */}
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Informasi Booking</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400">Tanggal Booking</p>
            <p className="font-medium text-gray-700">{formatDate(booking.tanggalBooking)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Tanggal Ambil</p>
            <p className="font-medium text-gray-700">{formatDate(booking.tanggalAmbil)}</p>
          </div>
          {booking.catatan && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400">Catatan</p>
              <p className="text-gray-700">{booking.catatan}</p>
            </div>
          )}
          {booking.catatanAdmin && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400">Catatan Admin</p>
              <p className="text-gray-700 bg-blue-50 rounded-lg p-2">{booking.catatanAdmin}</p>
            </div>
          )}
        </div>
      </div>

      {/* info user - hanya admin */}
      {isAdmin && booking.user && (
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Data Pemesan</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400">Nama</p>
              <p className="font-medium text-gray-700">{booking.user.nama}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="font-medium text-gray-700">{booking.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">No. Telepon</p>
              <p className="font-medium text-gray-700">{booking.user.noTelp || '-'}</p>
            </div>
            {booking.user.alamat && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Alamat</p>
                <p className="font-medium text-gray-700">{booking.user.alamat}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Item*/}
      <div className="card p-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Item Sparepart</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">Sparepart</th>
              <th className="text-center py-2.5 px-4 text-xs font-medium text-gray-500">Jumlah</th>
              <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-500">Harga</th>
              <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-500">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {booking.items?.map((item) => (
              <tr key={item.id} className="border-t border-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{item.sparepart?.nama || '-'}</p>
                  <p className="text-xs text-gray-400 font-mono">{item.sparepart?.kode}</p>
                </td>
                <td className="py-3 px-4 text-center text-gray-600">{item.jumlah} {item.sparepart?.satuan}</td>
                <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(item.hargaSatuan)}</td>
                <td className="py-3 px-4 text-right font-medium text-gray-800">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={3} className="py-3 px-4 text-right font-semibold text-gray-700">Total</td>
              <td className="py-3 px-4 text-right font-bold text-blue-600 text-base">{formatCurrency(booking.totalHarga)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* action */}
      {booking.status === 'menunggu' && !isAdmin && (
        <div className="flex justify-end">
          <button onClick={() => setCancelConfirm(true)} className="btn-danger">
            Batalkan Booking
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelConfirm}
        onClose={() => setCancelConfirm(false)}
        onConfirm={async () => {
          await cancelBooking.mutateAsync(booking.id)
          setCancelConfirm(false)
          navigate('/bookings')
        }}
        loading={cancelBooking.isPending}
        title="Batalkan Booking"
        message="Apakah Anda yakin ingin membatalkan booking ini?"
        confirmText="Ya, Batalkan"
        confirmClass="btn-danger"
      />
    </div>
  )
}
