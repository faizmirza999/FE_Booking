import Modal from './Modal'

export default function ConfirmDialog({
  isOpen, onClose, onConfirm,
  title, message,
  confirmText = 'Ya, Hapus',
  confirmClass = 'btn-danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-dark-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          Batal
        </button>
        <button onClick={onConfirm} className={confirmClass} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Memproses...
            </span>
          ) : confirmText}
        </button>
      </div>
    </Modal>
  )
}
