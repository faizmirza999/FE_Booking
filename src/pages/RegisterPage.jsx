import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data
      await authRegister(payload)
      toast.success('Registrasi berhasil!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal')
    }
  }

  const label = (text) => (
    <label className="block text-xs font-semibold text-dark-600 uppercase tracking-wider mb-1.5">
      {text}
    </label>
  )

  return (
    <>
      <h2 className="text-xl font-bold text-dark-900 mb-0.5">Buat Akun Baru</h2>
      <p className="text-sm text-dark-400 mb-6">Lengkapi data diri Anda</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          {label('Nama Lengkap')}
          <input type="text" placeholder="Nama lengkap"
            className={`input-field ${errors.nama ? 'input-error' : ''}`}
            {...register('nama', { required: 'Nama wajib diisi' })} />
          {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama.message}</p>}
        </div>

        <div>
          {label('Email')}
          <input type="email" placeholder="contoh@email.com"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
            })} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            {label('No. Telepon')}
            <input type="tel" placeholder="08xxxxxxxxxx"
              className="input-field" {...register('noTelp')} />
          </div>
          <div>
            {label('Password')}
            <input type="password" placeholder="Min. 6 karakter"
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: { value: 6, message: 'Min. 6 karakter' },
              })} />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <div>
          {label('Konfirmasi Password')}
          <input type="password" placeholder="Ulangi password"
            className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
            {...register('confirmPassword', {
              required: 'Konfirmasi password wajib diisi',
              validate: (val) => val === watch('password') || 'Password tidak cocok',
            })} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          {label('Alamat')}
          <textarea rows={2} placeholder="Alamat lengkap (opsional)"
            className="input-field resize-none" {...register('alamat')} />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
          {isSubmitting ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mendaftar...
            </span>
          ) : 'Daftar'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-400 mt-5">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-dark-900 font-semibold hover:underline">Masuk</Link>
      </p>
    </>
  )
}
