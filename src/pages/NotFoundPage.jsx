import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-blue-600">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mt-3">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-500 mt-2 mb-6">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
        <Link to="/dashboard" className="btn-primary">Kembali ke Dashboard</Link>
      </div>
    </div>
  )
}
