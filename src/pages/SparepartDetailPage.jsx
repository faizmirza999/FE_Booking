import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSparepart } from '../hooks/useSpareparts'
import { useCreateBooking } from '../hooks/useBookings'
import { formatCurrency } from '../utils/format'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const today = new Date().toISOString().split('T')[0]

export default function SparepartDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bookingModal, setBookingModal] = useState(false)
  const { data, isLoading, isError, error } = useSparepart(id)
  const createBooking = useCreateBooking()
  const BASE_URL = import.meta.env.VITE_API_URL

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { jumlah: 1, tanggalAmbil: today, catatan: '' } })

  const sp = data?.data
  const jumlah = watch('jumlah') || 1
  const total = sp ? parseFloat(sp.harga) * jumlah : 0

  const onBooking = async (formData) => {
    try {
      await createBooking.mutateAsync({
        tanggalAmbil: formData.tanggalAmbil,
        catatan: formData.catatan,
        items: [{ sparepartId: sp.id, jumlah: parseInt(formData.jumlah) }],
      })
      setBookingModal(false)
      reset()
      navigate('/bookings')
    } catch (err) {
      // error handled by hook toast
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage message={error?.response?.data?.message} />
  if (!sp) return null

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image */}
          <div className="w-full sm:w-52 h-52 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {sp.gambar ? (
              <img
                src={`${BASE_URL}/uploads/${sp.gambar}`}
                alt={sp.nama}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="text-xs font-mono text-gray-400 mb-1">{sp.kode}</p>
            <h1 className="text-xl font-bold text-gray-800 mb-1">{sp.nama}</h1>
            <p className="text-sm text-gray-500 capitalize mb-3">{sp.kategori} • {sp.merkMotor || 'Universal'}</p>
            {sp.deskripsi && <p className="text-sm text-gray-600 mb-4">{sp.deskripsi}</p>}

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Harga</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(sp.harga)}<span className="text-sm font-normal text-gray-500">/{sp.satuan}</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Stok</p>
                <p className={`text-lg font-semibold ${sp.stok > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {sp.stok} {sp.satuan}
                </p>
              </div>
            </div>

            {sp.stok > 0 ? (
              <button onClick={() => setBookingModal(true)} className="btn-primary">
                Pesan Sekarang
              </button>
            ) : (
              <button disabled className="btn-secondary opacity-50 cursor-not-allowed">Stok Habis</button>
            )}
          </div>
        </div>
      </div>

      {/* booking-modal */}
      <Modal isOpen={bookingModal} onClose={() => setBookingModal(false)} title={`Pesan: ${sp.nama}`}>
        <form onSubmit={handleSubmit(onBooking)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah</label>
            <input
              type="number"
              min="1"
              max={sp.stok}
              className={`input-field ${errors.jumlah ? 'input-error' : ''}`}
              {...register('jumlah', {
                required: 'Jumlah wajib diisi',
                min: { value: 1, message: 'Minimal 1' },
                max: { value: sp.stok, message: `Maksimal ${sp.stok}` },
              })}
            />
            {errors.jumlah && <p className="mt-1 text-xs text-red-500">{errors.jumlah.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Ambil</label>
            <input
              type="date"
              min={today}
              className={`input-field ${errors.tanggalAmbil ? 'input-error' : ''}`}
              {...register('tanggalAmbil', { required: 'Tanggal ambil wajib diisi' })}
            />
            {errors.tanggalAmbil && <p className="mt-1 text-xs text-red-500">{errors.tanggalAmbil.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan (opsional)</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="Tambahkan catatan untuk admin..."
              {...register('catatan')}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Harga satuan</span>
              <span>{formatCurrency(sp.harga)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Jumlah</span>
              <span>x {jumlah}</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-700 border-t border-blue-200 mt-2 pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setBookingModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting || createBooking.isPending} className="btn-primary">
              {createBooking.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : 'Konfirmasi Booking'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
