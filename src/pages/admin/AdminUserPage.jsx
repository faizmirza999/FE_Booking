import { useState } from 'react'
import { useUsers, useUpdateUser, useDeleteUser } from '../../hooks/useUsers'
import { formatDateTime } from '../../utils/format'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'
import ErrorMessage from '../../components/ErrorMessage'
import Modal from '../../components/Modal'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useForm } from 'react-hook-form'

function EditUserForm({ user, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nama: user.nama,
      noTelp: user.noTelp || '',
      alamat: user.alamat || '',
      role: user.role,
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama *</label>
        <input className={`input-field ${errors.nama ? 'input-error' : ''}`}
          {...register('nama', { required: 'Nama wajib diisi' })} />
        {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
        <input className="input-field" {...register('noTelp')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat</label>
        <textarea rows={2} className="input-field resize-none" {...register('alamat')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
        <select className="input-field" {...register('role')}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

export default function AdminUserPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading, isError, error } = useUsers({ page, limit: 10, search })
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const users = data?.data || []

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleUpdate = async (formData) => {
    await updateUser.mutateAsync({ id: editUser.id, data: formData })
    setEditUser(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Kelola User</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manajemen semua akun user</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <input type="text" placeholder="Cari nama atau email..."
          className="input-field" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} />
        <button type="submit" className="btn-secondary px-4">Cari</button>
      </form>

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
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Nama</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">No. Telepon</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Terdaftar</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">Tidak ada user</td>
                  </tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm uppercase flex-shrink-0">
                          {u.nama?.[0]}
                        </div>
                        <span className="font-medium text-gray-800">{u.nama}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-gray-600">{u.noTelp || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{formatDateTime(u.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditUser(u)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => setDeleteId(u.id)} className="text-xs text-red-600 hover:underline">Hapus</button>
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

      {/* Edit Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="sm">
        {editUser && (
          <EditUserForm user={editUser} onSubmit={handleUpdate} isLoading={updateUser.isPending} />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { await deleteUser.mutateAsync(deleteId); setDeleteId(null) }}
        loading={deleteUser.isPending}
        title="Hapus User"
        message="Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        confirmClass="btn-danger"
      />
    </div>
  )
}
