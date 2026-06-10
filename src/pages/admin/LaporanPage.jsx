import { useState, useMemo } from 'react'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useLaporanPenjualan, useLaporanSemua, useLaporanStok } from '../../hooks/useLaporan'
import {
  generateLaporanPenjualan,
  generateLaporanPerSparepart,
  generateLaporanRekapStatus,
} from '../../utils/pdfGenerator'
import { formatCurrency, formatDate, STATUS_LABELS } from '../../utils/format'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'

// warna tema untuk chart dan elemen lainnya
const C = {
  black:  '#111315',
  gray2:  '#6c757d',
  gray4:  '#dee2e6',
}

// helper components
function StatBox({ label, value, sub, accent }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'bg-dark-950 border-dark-950' : 'bg-white border-dark-100'}`}>
      <p className={`text-2xl font-extrabold leading-tight ${accent ? 'text-white' : 'text-dark-900'}`}>{value}</p>
      <p className={`text-xs font-semibold mt-1 ${accent ? 'text-white/50' : 'text-dark-400'}`}>{label}</p>
      {sub && <p className={`text-[10px] mt-0.5 ${accent ? 'text-white/30' : 'text-dark-300'}`}>{sub}</p>}
    </div>
  )
}

// main page
export default function LaporanPage() {
  const [dari, setDari] = useState('')
  const [sampai, setSampai] = useState('')
  const [appliedFilter, setAppliedFilter] = useState({ dari: '', sampai: '' })
  const [downloading, setDownloading] = useState('')

  const { data: penjualanData, isLoading: loadingPenjualan, isError: errPenjualan } = useLaporanPenjualan()
  const { data: semuaData,     isLoading: loadingSemua }     = useLaporanSemua()
  const { data: stokData,      isLoading: loadingStok }      = useLaporanStok()

  const allSelesai   = penjualanData?.data || []
  const allBookings  = semuaData?.data     || []
  const allSpareparts = stokData?.data     || []

  //filter berdasarkan periode
  const filteredSelesai = useMemo(() => {
    if (!appliedFilter.dari && !appliedFilter.sampai) return allSelesai
    return allSelesai.filter((b) => {
      const tgl = b.tanggalBooking
      if (appliedFilter.dari   && tgl < appliedFilter.dari)   return false
      if (appliedFilter.sampai && tgl > appliedFilter.sampai) return false
      return true
    })
  }, [allSelesai, appliedFilter])

  // chart
  const totalPendapatan  = filteredSelesai.reduce((s, b) => s + parseFloat(b.totalHarga || 0), 0)
  const totalQtyTerjual  = filteredSelesai.reduce((s, b) => s + (b.items?.reduce((q, i) => q + i.jumlah, 0) || 0), 0)

  const statusCount = useMemo(() => {
    const c = {}
    allBookings.forEach((b) => { c[b.status] = (c[b.status] || 0) + 1 })
    return c
  }, [allBookings])

  // CHART  pendapatan harian
  const pendapatanHarian = useMemo(() => {
    const map = {}
    filteredSelesai.forEach((b) => {
      const tgl = b.tanggalBooking
      if (!map[tgl]) map[tgl] = { tgl, pendapatan: 0, transaksi: 0 }
      map[tgl].pendapatan  += parseFloat(b.totalHarga || 0)
      map[tgl].transaksi   += 1
    })
    return Object.values(map)
      .sort((a, b) => a.tgl.localeCompare(b.tgl))
      .map((d) => ({ ...d, tglLabel: d.tgl.slice(5) }))
  }, [filteredSelesai])

  //untuk PDF & tabel 
  const topSparepart = useMemo(() => {
    const map = {}
    filteredSelesai.forEach((b) => {
      b.items?.forEach((item) => {
        const k = item.sparepartId
        const nama = item.sparepart?.nama || `ID ${k}`
        if (!map[k]) map[k] = { nama, kode: item.sparepart?.kode || '-', qty: 0, pendapatan: 0 }
        map[k].qty        += item.jumlah
        map[k].pendapatan += parseFloat(item.subtotal || 0)
      })
    })
    return Object.values(map).sort((a, b) => b.pendapatan - a.pendapatan).slice(0, 5)
  }, [filteredSelesai])

  // ── download 
  const handleDownload = async (type) => {
    setDownloading(type)
    await new Promise((r) => setTimeout(r, 150))
    try {
      const periode = appliedFilter.dari
        ? { dari: appliedFilter.dari, sampai: appliedFilter.sampai || new Date().toISOString().slice(0, 10) }
        : null
      if (type === 'penjualan') generateLaporanPenjualan(filteredSelesai, periode)
      if (type === 'sparepart') generateLaporanPerSparepart(filteredSelesai)
      if (type === 'rekap')     generateLaporanRekapStatus(allBookings)
    } finally {
      setDownloading('')
    }
  }

  const isLoading = loadingPenjualan || loadingSemua || loadingStok
  const noData    = filteredSelesai.length === 0

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-bold text-dark-900">Laporan Penjualan</h1>
        <p className="text-sm text-dark-400 mt-0.5">Ringkasan transaksi dan pendapatan Bekspart</p>
      </div>

      {/* ── Filter Periode ── */}
      <div className="bg-white border border-dark-100 rounded-xl p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-dark-400 mb-3">Filter Periode</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold text-dark-500 mb-1.5">Dari</label>
            <input type="date" className="input-field w-40" value={dari} onChange={(e) => setDari(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-500 mb-1.5">Sampai</label>
            <input type="date" className="input-field w-40" value={sampai} min={dari} onChange={(e) => setSampai(e.target.value)} />
          </div>
          <button onClick={() => setAppliedFilter({ dari, sampai })} className="btn-primary px-5">Terapkan</button>
          {(appliedFilter.dari || appliedFilter.sampai) && (
            <button onClick={() => { setDari(''); setSampai(''); setAppliedFilter({ dari: '', sampai: '' }) }}
              className="btn-secondary px-4 text-xs">Reset</button>
          )}
          {(appliedFilter.dari || appliedFilter.sampai) && (
            <span className="text-xs text-dark-500 bg-dark-100 px-3 py-1.5 rounded-lg font-medium">
              {appliedFilter.dari ? formatDate(appliedFilter.dari) : 'Awal'} → {appliedFilter.sampai ? formatDate(appliedFilter.sampai) : 'Sekarang'}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Memuat data laporan..." />
      ) : errPenjualan ? (
        <ErrorMessage />
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatBox label="Total Pendapatan"     value={formatCurrency(totalPendapatan)} accent />
            <StatBox label="Transaksi Selesai"    value={filteredSelesai.length}          sub="booking" />
            <StatBox label="Total Unit Terjual"   value={totalQtyTerjual}                 sub="pcs / set / dll" />
            <StatBox label="Total Booking"        value={allBookings.length}              sub="semua status" />
          </div>

          {/* ── Status Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {['menunggu','dikonfirmasi','siap_diambil','selesai','dibatalkan'].map((s) => (
              <div key={s} className="bg-white border border-dark-100 rounded-xl p-4 text-center">
                <p className="text-xl font-extrabold text-dark-900">{statusCount[s] || 0}</p>
                <div className="flex justify-center mt-1.5"><StatusBadge status={s} /></div>
              </div>
            ))}
          </div>

          {/* ── CHART — Pendapatan Harian ── */}
          <div className="bg-white border border-dark-100 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-dark-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-dark-800 uppercase tracking-wider">Tren Pendapatan</p>
                <p className="text-[10px] text-dark-400 mt-0.5">Pendapatan harian dari booking selesai</p>
              </div>
              {pendapatanHarian.length > 0 && (
                <div className="text-right">
                  <p className="text-sm font-extrabold text-dark-900">{formatCurrency(totalPendapatan)}</p>
                  <p className="text-[10px] text-dark-400">{filteredSelesai.length} transaksi</p>
                </div>
              )}
            </div>
            <div className="p-5">
              {noData || pendapatanHarian.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={pendapatanHarian} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradPendapatan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#111315" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#111315" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#dee2e6" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="tglLabel"
                      tick={{ fontSize: 10, fill: '#6c757d' }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1_000_000
                          ? `${(v / 1_000_000).toFixed(0)}jt`
                          : `${(v / 1_000).toFixed(0)}rb`
                      }
                      tick={{ fontSize: 10, fill: '#6c757d' }}
                      axisLine={false} tickLine={false} width={44}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="bg-dark-950 text-white rounded-xl px-3.5 py-2.5 shadow-xl text-xs">
                            <p className="font-semibold text-white/60 mb-1">{label}</p>
                            <p className="font-bold text-base">{formatCurrency(payload[0].value)}</p>
                            {payload[1] && (
                              <p className="text-white/50 mt-0.5">{payload[1].value} transaksi</p>
                            )}
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone" dataKey="pendapatan" name="Pendapatan"
                      stroke="#111315" strokeWidth={2}
                      fill="url(#gradPendapatan)"
                      dot={false}
                      activeDot={{ r: 4, fill: '#111315', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Tabel Transaksi Selesai ── */}
          <div className="bg-white border border-dark-100 rounded-xl overflow-hidden">
            <CardHeader
              title={`Transaksi Selesai`}
              subtitle={`${filteredSelesai.length} transaksi · ${formatCurrency(totalPendapatan)}`}
            />
            <div className="overflow-auto max-h-72">
              {filteredSelesai.length === 0 ? (
                <p className="text-center text-dark-400 text-xs py-10">Tidak ada transaksi selesai</p>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-dark-50 sticky top-0">
                    <tr>
                      <th className="text-left py-2.5 px-4 text-[10px] font-bold text-dark-400 uppercase tracking-wider">No. Booking</th>
                      <th className="text-left py-2.5 px-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">Pelanggan</th>
                      <th className="text-left py-2.5 px-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">Tgl Booking</th>
                      <th className="text-left py-2.5 px-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">Tgl Ambil</th>
                      <th className="text-center py-2.5 px-3 text-[10px] font-bold text-dark-400 uppercase tracking-wider">Item</th>
                      <th className="text-right py-2.5 px-4 text-[10px] font-bold text-dark-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSelesai.map((b) => (
                      <tr key={b.id} className="border-t border-dark-50 hover:bg-dark-50 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-dark-600">{b.nomorBooking}</td>
                        <td className="py-2.5 px-3 font-medium text-dark-700">{b.user?.nama || '-'}</td>
                        <td className="py-2.5 px-3 text-dark-500">{formatDate(b.tanggalBooking)}</td>
                        <td className="py-2.5 px-3 text-dark-500">{formatDate(b.tanggalAmbil)}</td>
                        <td className="py-2.5 px-3 text-center text-dark-600">{b.items?.length || 0}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-dark-900">{formatCurrency(b.totalHarga)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── Download PDF ── */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-600 mb-3">Unduh Laporan PDF</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDownload('penjualan')}
                disabled={!!downloading || filteredSelesai.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {downloading === 'penjualan'
                  ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                }
                Laporan Penjualan
              </button>

              <button
                onClick={() => handleDownload('sparepart')}
                disabled={!!downloading || filteredSelesai.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {downloading === 'sparepart'
                  ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                }
                Per Sparepart
              </button>

              <button
                onClick={() => handleDownload('rekap')}
                disabled={!!downloading || allBookings.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {downloading === 'rekap'
                  ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                }
                Rekap Status
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CardHeader({ title, subtitle }) {
  return (
    <div className="px-5 py-4 border-b border-dark-100">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-bold text-dark-900">{title}</h2>
        <p className="text-xs text-dark-500">{subtitle}</p>
      </div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center gap-2">
      <svg className="w-8 h-8 text-dark-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p className="text-xs text-dark-300">Belum ada data</p>
    </div>
  )
}
