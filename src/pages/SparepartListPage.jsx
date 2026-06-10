import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSpareparts } from '../hooks/useSpareparts'
import { formatCurrency } from '../utils/format'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import ErrorMessage from '../components/ErrorMessage'

const KATEGORI_OPTIONS = ['', 'honda', 'vespa matic']
const BASE_URL = import.meta.env.VITE_API_URL

export default function SparepartListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [kategori, setKategori] = useState('')

  const { data, isLoading, isError, error } = useSpareparts({
    page, limit: 12, search,
    kategori: kategori || undefined,
  })

  const spareparts = data?.data || []

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-dark-900">Katalog Sparepart</h1>
        <p className="text-sm text-dark-400 mt-0.5">Pilih sparepart untuk scooter Anda</p>
      </div>

      {/* Search Katalog */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari nama atau kode..."
            className="input-field"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn-primary px-4">Cari</button>
        </form>
        <div className="flex gap-2 flex-wrap">
          {KATEGORI_OPTIONS.map((k) => (
            <button
              key={k || 'all'}
              onClick={() => { setKategori(k); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                kategori === k
                  ? 'bg-dark-900 border-dark-900 text-white'
                  : 'bg-white border-dark-200 text-dark-600 hover:bg-dark-50'
              }`}
            >
              {k ? k.charAt(0).toUpperCase() + k.slice(1) : 'Semua'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message={error?.response?.data?.message} />
      ) : spareparts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-dark-400 text-sm">Tidak ada sparepart ditemukan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {spareparts.map((sp) => (
              <div
                key={sp.id}
                className="bg-white rounded-xl border border-dark-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-dark-300 transition-all group"
                onClick={() => navigate(`/spareparts/${sp.id}`)}
              >
                {/* Image */}
                <div className="w-full h-44 bg-dark-100 overflow-hidden">
                  {sp.gambar ? (
                    <img
                      src={`${BASE_URL}/uploads/${sp.gambar}`}
                      alt={sp.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.parentElement.classList.add('flex','items-center','justify-center'); e.target.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-mono text-dark-400 mb-0.5">{sp.kode}</p>
                  <h3 className="text-sm font-semibold text-dark-800 line-clamp-2 mb-1">{sp.nama}</h3>
                  <p className="text-xs text-dark-400 capitalize mb-3">{sp.kategori}{sp.merkMotor ? ` · ${sp.merkMotor}` : ''}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-dark-900 font-bold text-sm">{formatCurrency(sp.harga)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      sp.stok > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {sp.stok > 0 ? `${sp.stok} ${sp.satuan}` : 'Habis'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination pagination={data?.pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
