import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        nama: user.nama,
        noTelp: user.noTelp || '',
        alamat: user.alamat || '',
        password: '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        nama: data.nama,
        noTelp: data.noTelp,
        alamat: data.alamat,
      }
      if (data.password) payload.password = data.password
      await authService.updateProfile(payload)
      await refreshUser()
      toast.success('Profil berhasil diperbarui')
      reset({ ...payload, password: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil')
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Profil Saya</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola informasi akun Anda</p>
      </div>

      {/* Info */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold uppercase">
          {user?.nama?.[0]}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800">{user?.nama}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* edit Profil */}

      <div className="card">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Edit Profil</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              className={`input-field ${errors.nama ? 'input-error' : ''}`}
              {...register('nama', { required: 'Nama wajib diisi' })}
            />
            {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
              value={user?.email}
              readOnly
            />
            <p className="mt-1 text-xs text-gray-400">Email tidak dapat diubah</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
            <input
              type="tel"
              className="input-field"
              {...register('noTelp')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat</label>
            <textarea
              rows={3}
              className="input-field resize-none"
              {...register('alamat')}
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Ubah Password (opsional)</h3>
            <input
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah password"
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              {...register('password', {
                minLength: { value: 6, message: 'Password minimal 6 karakter' },
              })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="btn-primary"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
