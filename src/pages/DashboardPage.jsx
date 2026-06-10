import { useAuth } from '../context/AuthContext'
import { useBookings } from '../hooks/useBookings'
import { useSpareparts } from '../hooks/useSpareparts'
import { useUsers } from '../hooks/useUsers'
import { formatCurrency } from '../utils/format'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

function StatCard({ label, value, icon, accent = false }) {
  return (
    <div className={`rounded-xl border p-5 flex items-center gap-4 ${
      accent
        ? 'bg-dark-950 border-dark-950 text-white'
        : 'bg-white border-dark-100'
    }`}>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
        accent ? 'bg-white/10' : 'bg-dark-100'
      }`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-extrabold leading-tight ${accent ? 'text-white' : 'text-dark-900'}`}>
          {value}
        </p>
        <p className={`text-xs font-medium mt-0.5 ${accent ? 'text-white/50' : 'text-dark-400'}`}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const { data: bookingsData, isLoading: loadingBookings } = useBookings({ limit: 5 })
  const { data: sparepartsData } = useSpareparts({ limit: 1 })
  const { data: usersData } = useUsers({ limit: 1 })

  const bookings = bookingsData?.data || []
  const totalBookings = bookingsData?.pagination?.total || 0
  const totalSpareparts = sparepartsData?.pagination?.total || 0
  const totalUsers = usersData?.pagination?.total || 0
  const menungguCount = bookings.filter((b) => b.status === 'menunggu').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-dark-900">Dashboard</h1>
          <p className="text-sm text-dark-400 mt-0.5">
            Selamat datang, <span className="font-semibold text-dark-700">{user?.nama}</span>
          </p>
        </div>
        {!isAdmin && (
          <Link to="/spareparts" className="btn-primary text-xs px-3 py-2">
            + Booking Baru
          </Link>
        )}
      </div>

      {/* total booking */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Total Booking"
          value={totalBookings}
          accent
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Menunggu Konfirmasi"
          value={menungguCount}
          icon={
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Sparepart"
          value={totalSpareparts}
          icon={
            <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
            </svg>
          }
        />
        {isAdmin ? (
          <StatCard
            label="Total User"
            value={totalUsers}
            icon={
              <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        ) : (
          <StatCard
            label="Selesai"
            value={bookings.filter(b => b.status === 'selesai').length}
            icon={
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        )}
      </div>

      {/* Recent Bookings */}
      <div className="card p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
          <h2 className="text-sm font-bold text-dark-800 uppercase tracking-wider">
            {isAdmin ? 'Booking Terbaru' : 'Booking Saya'}
          </h2>
          <Link
            to={isAdmin ? '/admin/bookings' : '/bookings'}
            className="text-xs font-semibold text-dark-500 hover:text-dark-900 transition-colors"
          >
            Lihat semua →
          </Link>
        </div>

        {loadingBookings ? (
          <div className="px-6 py-8"><LoadingSpinner text="Memuat booking..." /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-400 text-sm">Belum ada booking</p>
            {!isAdmin && (
              <Link to="/spareparts" className="btn-primary mt-3 inline-flex text-xs">
                Pesan Sekarang
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="text-left py-2.5 px-6 text-xs font-semibold text-dark-400 uppercase tracking-wider">No. Booking</th>
                  {isAdmin && <th className="text-left py-2.5 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">User</th>}
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Tgl Ambil</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Total</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-dark-50 hover:bg-dark-50 transition-colors">
                    <td className="py-3 px-6 font-mono text-xs text-dark-600">{b.nomorBooking}</td>
                    {isAdmin && <td className="py-3 px-4 font-medium text-dark-700">{b.user?.nama}</td>}
                    <td className="py-3 px-4 text-dark-500 text-xs">{b.tanggalAmbil}</td>
                    <td className="py-3 px-4 font-semibold text-dark-800">{formatCurrency(b.totalHarga)}</td>
                    <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
