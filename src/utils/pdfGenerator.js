import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDate, formatDateTime, STATUS_LABELS } from './format'

const BRAND = 'Bekspart'
const SUBTITLE = 'Sistem Booking Sparepart Scooter'

function addHeader(doc, title, subtitle) {
  const pageW = doc.internal.pageSize.getWidth()

  // Brand name
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(BRAND.toUpperCase(), 14, 14)

  // Sub text
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(120, 120, 120)
  doc.text(SUBTITLE, 14, 19)

  // Title section
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(title, 14, 30)

  if (subtitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(subtitle, 14, 36)
  }

  // Divider
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  doc.line(14, 40, pageW - 14, 40)

  return 44
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages()
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.3)
    doc.line(14, pageH - 14, pageW - 14, pageH - 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text(`Dicetak: ${formatDateTime(new Date().toISOString())}`, 14, pageH - 8)
    doc.text(`Halaman ${i} / ${pageCount}`, pageW - 14, pageH - 8, { align: 'right' })
    doc.text(BRAND, pageW / 2, pageH - 8, { align: 'center' })
  }
}

// ─── 1. LAPORAN PENJUALAN (booking selesai) ──────────────────────────────────
export function generateLaporanPenjualan(bookings, periode) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const periodeStr = periode
    ? `Periode: ${formatDate(periode.dari)} – ${formatDate(periode.sampai)}`
    : `Dicetak: ${formatDateTime(new Date().toISOString())}`

  let y = addHeader(doc, 'LAPORAN PENJUALAN', periodeStr)

  // Ringkasan
  const totalTransaksi = bookings.length
  const totalPendapatan = bookings.reduce((s, b) => s + parseFloat(b.totalHarga || 0), 0)
  const totalItem = bookings.reduce((s, b) => s + (b.items?.length || 0), 0)

  const ringkasan = [
    ['Total Transaksi Selesai', totalTransaksi.toString()],
    ['Total Item Terjual', totalItem.toString()],
    ['Total Pendapatan', formatCurrency(totalPendapatan)],
  ]

  autoTable(doc, {
    startY: y,
    body: ringkasan,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [80, 80, 80], cellWidth: 55 },
      1: { fontStyle: 'bold', textColor: [0, 0, 0], fontSize: 10 },
    },
    margin: { left: 14, right: 14 },
  })

  y = doc.lastAutoTable.finalY + 8

  // Divider
  doc.setDrawColor(230, 230, 230)
  doc.line(14, y, doc.internal.pageSize.getWidth() - 14, y)
  y += 6

  // Label
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(80, 80, 80)
  doc.text('DETAIL TRANSAKSI', 14, y)
  y += 4

  // Tabel detail
  const rows = []
  bookings.forEach((b) => {
    b.items?.forEach((item, idx) => {
      rows.push([
        idx === 0 ? b.nomorBooking : '',
        idx === 0 ? (b.user?.nama || '-') : '',
        idx === 0 ? formatDate(b.tanggalBooking) : '',
        idx === 0 ? formatDate(b.tanggalAmbil) : '',
        item.sparepart?.nama || '-',
        item.jumlah,
        formatCurrency(item.hargaSatuan),
        formatCurrency(item.subtotal),
        idx === 0 ? formatCurrency(b.totalHarga) : '',
      ])
    })
    if (!b.items || b.items.length === 0) {
      rows.push([b.nomorBooking, b.user?.nama || '-', formatDate(b.tanggalBooking), formatDate(b.tanggalAmbil), '-', '-', '-', '-', formatCurrency(b.totalHarga)])
    }
  })

  autoTable(doc, {
    startY: y,
    head: [['No. Booking', 'Pelanggan', 'Tgl Booking', 'Tgl Ambil', 'Sparepart', 'Qty', 'Harga Satuan', 'Subtotal', 'Total Booking']],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 100], textColor: 255, fontSize: 7, fontStyle: 'bold', cellPadding: 3 },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 30 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 45 },
      5: { cellWidth: 10, halign: 'center' },
      6: { cellWidth: 28, halign: 'right' },
      7: { cellWidth: 28, halign: 'right' },
      8: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.column.index === 8 && data.cell.raw && data.cell.raw !== '') {
        data.cell.styles.textColor = [0, 0, 0]
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  addFooter(doc)
  const nama = `Laporan_Penjualan_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(nama)
}

// ─── 2. LAPORAN RINGKASAN PER SPAREPART ──────────────────────────────────────
export function generateLaporanPerSparepart(bookings) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = addHeader(doc, 'LAPORAN PENJUALAN PER SPAREPART', `Dicetak: ${formatDateTime(new Date().toISOString())}`)

  // Agregasi per sparepart
  const map = {}
  bookings.forEach((b) => {
    b.items?.forEach((item) => {
      const key = item.sparepartId
      const nama = item.sparepart?.nama || `ID ${key}`
      const kode = item.sparepart?.kode || '-'
      if (!map[key]) map[key] = { kode, nama, totalQty: 0, totalPendapatan: 0 }
      map[key].totalQty += item.jumlah
      map[key].totalPendapatan += parseFloat(item.subtotal || 0)
    })
  })

  const rows = Object.values(map)
    .sort((a, b) => b.totalPendapatan - a.totalPendapatan)
    .map((r, i) => [
      i + 1,
      r.kode,
      r.nama,
      r.totalQty,
      formatCurrency(r.totalPendapatan),
    ])

  const totalPendapatan = Object.values(map).reduce((s, r) => s + r.totalPendapatan, 0)

  autoTable(doc, {
    startY: y,
    head: [['#', 'Kode', 'Nama Sparepart', 'Total Qty Terjual', 'Total Pendapatan']],
    body: rows,
    foot: [['', '', 'TOTAL', Object.values(map).reduce((s, r) => s + r.totalQty, 0), formatCurrency(totalPendapatan)]],
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 100], textColor: 255, fontSize: 8, fontStyle: 'bold', cellPadding: 3 },
    bodyStyles: { fontSize: 8, cellPadding: 2.5 },
    footStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 80 },
      3: { cellWidth: 35, halign: 'center' },
      4: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  })

  addFooter(doc)
  doc.save(`Laporan_Sparepart_${new Date().toISOString().slice(0, 10)}.pdf`)
}

// ─── 3. LAPORAN REKAP STATUS BOOKING ─────────────────────────────────────────
export function generateLaporanRekapStatus(semuaBookings) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = addHeader(doc, 'REKAP STATUS BOOKING', `Dicetak: ${formatDateTime(new Date().toISOString())}`)

  const statusCount = {}
  const statusRevenue = {}
  semuaBookings.forEach((b) => {
    statusCount[b.status] = (statusCount[b.status] || 0) + 1
    statusRevenue[b.status] = (statusRevenue[b.status] || 0) + parseFloat(b.totalHarga || 0)
  })

  const statusOrder = ['menunggu', 'dikonfirmasi', 'siap_diambil', 'selesai', 'dibatalkan']
  const rows = statusOrder.map((s) => [
    STATUS_LABELS[s] || s,
    statusCount[s] || 0,
    formatCurrency(statusRevenue[s] || 0),
  ])
  rows.push(['TOTAL', semuaBookings.length, formatCurrency(semuaBookings.reduce((s, b) => s + parseFloat(b.totalHarga || 0), 0))])

  autoTable(doc, {
    startY: y,
    head: [['Status', 'Jumlah Booking', 'Nilai Booking']],
    body: rows.slice(0, -1),
    foot: [rows[rows.length - 1]],
    theme: 'striped',
    headStyles: { fillColor: [100, 100, 100], textColor: 255, fontSize: 9, fontStyle: 'bold', cellPadding: 4 },
    bodyStyles: { fontSize: 9, cellPadding: 3.5 },
    footStyles: { fillColor: [180, 180, 180], textColor: [0, 0, 0], fontSize: 9, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 60, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  })

  addFooter(doc)
  doc.save(`Rekap_Status_Booking_${new Date().toISOString().slice(0, 10)}.pdf`)
}
