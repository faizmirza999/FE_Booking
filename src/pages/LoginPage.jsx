import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const user = await login(data)
      toast.success(`Selamat datang, ${user.nama}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email atau password salah')
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-dark-900 mb-0.5">Masuk ke Akun</h2>
      <p className="text-sm text-dark-400 mb-6">Masukkan kredensial Anda untuk melanjutkan</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-dark-600 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="contoh@email.com"
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-600 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="•••••••"
            className={`input-field ${errors.password ? 'input-error' : ''}`}
            {...register('password', { required: 'Password wajib diisi' })}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 mt-2">
          {isSubmitting ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Masuk...
            </span>
          ) : 'Masuk'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-400 mt-6">
        Belum punya akun?{' '}
        <Link to="/register" className="text-dark-900 font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </>
  )
}
