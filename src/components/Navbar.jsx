import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { user, logout, isAdmin } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="bg-white border-b border-dark-100 h-16 flex items-center px-4 sm:px-6 sticky top-0 z-10">


      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-dark-500 hover:bg-dark-100 mr-3 transition-colors"
        aria-label="Buka menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`hidden sm:inline-flex px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide ${
          isAdmin
            ? 'bg-dark-900 text-white'
            : 'bg-dark-100 text-dark-600'
        }`}>
          {isAdmin ? 'ADMIN' : 'USER'}
        </span>

        {/* Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-dark-900 text-white font-bold text-xs flex items-center justify-center uppercase">
              {user?.nama?.[0]}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-dark-800 leading-tight">{user?.nama}</p>
            </div>
            <svg className="w-3.5 h-3.5 text-dark-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-dark-100 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-dark-100">
                <p className="text-sm font-semibold text-dark-800 truncate">{user?.nama}</p>
                <p className="text-xs text-dark-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <svg className="w-4 h-4 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil Saya
              </Link>
              <div className="border-t border-dark-100 mt-1 pt-1">
                <button
                  onClick={() => { logout(); setDropdownOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
