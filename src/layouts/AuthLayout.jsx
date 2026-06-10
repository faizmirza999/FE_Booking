import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-5/12 bg-dark-950 flex-col justify-between p-12">
        <Logo size="md" />

        <div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Booking Sparepart<br />Scooter, Mudah &<br />Cepat.
          </h1>
          <p className="text-dark-400 text-sm leading-relaxed">
            Pesan sparepart original untuk scooter kesayangan Anda langsung dari bengkel resmi kami.
            Stok terjamin, pengiriman tepat waktu.
          </p>
        </div>

        {/* Decorative scooter lines */}
        <div className="opacity-10">
          <svg viewBox="0 0 400 200" fill="none" stroke="white" strokeWidth="2" className="w-full">
            <path d="M40 140 Q120 80 200 100 Q280 120 360 60" />
            <path d="M40 160 Q120 100 200 120 Q280 140 360 80" />
            <circle cx="80" cy="160" r="30" />
            <circle cx="320" cy="140" r="30" />
          </svg>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" dark />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-dark-100 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
