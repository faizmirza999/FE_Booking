import { useState } from 'react'
import { useSpareparts, useCreateSparepart, useUpdateSparepart, useDeleteSparepart, useUpdateStok } from '../../hooks/useSpareparts'
import { formatCurrency, KATEGORI_OPTIONS, SATUAN_OPTIONS } from '../../utils/format'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'
import ErrorMessage from '../../components/ErrorMessage'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL

function SparepartForm({ onSubmit, defaultValues, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode *</label>
          <input className={`input-field ${errors.kode ? 'input-error' : ''}`}
            {...register('kode', { required: 'Kode wajib diisi' })} />
          {errors.kode && <p className="mt-1 text-xs text-red-500">{errors.kode.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama *</label>
          <input className={`input-field ${errors.nama ? 'input-error' : ''}`}
            {...register('nama', { required: 'Nama wajib diisi' })} />
          {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
        <textarea rows={2} className="input-field resize-none" {...register('deskripsi')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
          <select className={`input-field ${errors.kategori ? 'input-error' : ''}`}
            {...register('kategori', { required: 'Kategori wajib dipilih' })}>
            {KATEGORI_OPTIONS.map((k) => (
              <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
            ))}
          </select>
          {errors.kategori && <p className="mt-1 text-xs text-red-500">{errors.kategori.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Merk Motor</label>
          <input className="input-field" placeholder="e.g. Honda Beat" {...register('merkMotor')} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga *</label>
          <input type="number" min="0" className={`input-field ${errors.harga ? 'input-error' : ''}`}
            {...register('harga', { required: 'Harga wajib diisi', min: { value: 0, message: 'Harga tidak boleh negatif' } })} />
          {errors.harga && <p className="mt-1 text-xs text-red-500">{errors.harga.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok</label>
          <input type="number" min="0" className="input-field" {...register('stok')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Satuan</label>
          <select className="input-field" {...register('satuan')}>
            {SATUAN_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Gambar - hanya saat tambah */}
      {!defaultValues?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar</label>
          <input type="file" accept="image/*" className="input-field" {...register('gambar')} />
        </div>
      )}

      {defaultValues?.id && (
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isActive" {...register('isActive')} className="rounded" />
          <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </span>
          ) : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

export default function AdminSparepartPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [kategori, setKategori] = useState('')
  const [isActive, setIsActive] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [stokModal, setStokModal] = useState(null)
  const [newStok, setNewStok] = useState('')

  const { data, isLoading, isError, error } = useSpareparts({
    page, limit: 10, search,
    kategori: kategori || undefined,
    isActive: isActive !== '' ? isActive : undefined,
  })

  const createSparepart = useCreateSparepart()
  const updateSparepart = useUpdateSparepart()
  const deleteSparepart = useDeleteSparepart()
  const updateStok = useUpdateStok()

  const spareparts = data?.data || []

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleCreate = async (formData) => {
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => {
      if (k === 'gambar' && v instanceof FileList && v.length > 0) {
        fd.append('gambar', v[0])
      } else if (v !== undefined && v !== null && v !== '') {
        fd.append(k, v)
      }
    })
    await createSparepart.mutateAsync(fd)
    setShowModal(false)
  }

  const handleUpdate = async (formData) => {
    const payload = { ...formData }
    delete payload.gambar
    await updateSparepart.mutateAsync({ id: editData.id, data: payload })
    setEditData(null)
  }

  const handleStokUpdate = async () => {
    if (newStok === '') return toast.error('Masukkan nilai stok')
    await updateStok.mutateAsync({ id: stokModal.id, stok: parseInt(newStok) })
    setStokModal(null)
    setNewStok('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Kelola Sparepart</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manajemen data sparepart motor</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Tambah Sparepart</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" placeholder="Cari nama/kode..." className="input-field w-52"
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button type="submit" className="btn-secondary px-4">Cari</button>
        </form>
        <select className="input-field w-40" value={kategori} onChange={(e) => { setKategori(e.target.value); setPage(1) }}>
          <option value="">Semua Kategori</option>
          {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <select className="input-field w-36" value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1) }}>
          <option value="">Semua Status</option>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage message={error?.response?.data?.message} />
      ) : (
        <div className="card p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Gambar</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Kode</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nama</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Kategori</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Harga</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Stok</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {spareparts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">Tidak ada data</td>
                  </tr>
                ) : spareparts.map((sp) => (
                  <tr key={sp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                        {sp.gambar ? (
                          <img src={`${BASE_URL}/uploads/${sp.gambar}`} alt={sp.nama} className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-gray-600">{sp.kode}</td>
                    <td className="py-2.5 px-4">
                      <p className="font-medium text-gray-800">{sp.nama}</p>
                      <p className="text-xs text-gray-400">{sp.merkMotor || '-'}</p>
                    </td>
                    <td className="py-2.5 px-4 capitalize text-gray-600">{sp.kategori}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-800">{formatCurrency(sp.harga)}</td>
                    <td className="py-2.5 px-4">
                      <button onClick={() => { setStokModal(sp); setNewStok(sp.stok) }}
                        className="text-sm font-medium hover:underline text-blue-600">
                        {sp.stok} {sp.satuan}
                      </button>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${sp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {sp.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditData(sp)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(sp.id)} className="text-xs text-red-600 hover:underline">Nonaktifkan</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4">
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Sparepart" size="lg">
        <SparepartForm onSubmit={handleCreate} defaultValues={{ kategori: 'honda', satuan: 'pcs', stok: 0 }}
          isLoading={createSparepart.isPending} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editData} onClose={() => setEditData(null)} title="Edit Sparepart" size="lg">
        {editData && (
          <SparepartForm onSubmit={handleUpdate} defaultValues={{ ...editData }}
            isLoading={updateSparepart.isPending} />
        )}
      </Modal>

      {/* Stok Modal */}
      <Modal isOpen={!!stokModal} onClose={() => { setStokModal(null); setNewStok('') }} title="Update Stok" size="sm">
        {stokModal && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Sparepart: <span className="font-medium">{stokModal.nama}</span></p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok Baru</label>
              <input type="number" min="0" className="input-field" value={newStok}
                onChange={(e) => setNewStok(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setStokModal(null); setNewStok('') }} className="btn-secondary">Batal</button>
              <button onClick={handleStokUpdate} disabled={updateStok.isPending} className="btn-primary">
                {updateStok.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await deleteSparepart.mutateAsync(deleteId); setDeleteId(null) }}
        loading={deleteSparepart.isPending}
        title="Nonaktifkan Sparepart"
        message="Sparepart akan dinonaktifkan dan tidak muncul di katalog user."
        confirmText="Ya, Nonaktifkan"
        confirmClass="btn-danger"
      />
    </div>
  )
}
