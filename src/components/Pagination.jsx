export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null

  const { page, totalPages, total, limit } = pagination
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const delta = 2
  const pages = []
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <p className="text-xs text-dark-400">
        Menampilkan <span className="font-semibold text-dark-600">{from}–{to}</span> dari{' '}
        <span className="font-semibold text-dark-600">{total}</span> data
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dark-200 text-dark-600 hover:bg-dark-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹ Prev
        </button>

        {pages[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dark-200 text-dark-600 hover:bg-dark-100 transition-colors">1</button>
            {pages[0] > 2 && <span className="px-1 text-dark-400 text-xs">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              p === page
                ? 'bg-dark-900 border-dark-900 text-white'
                : 'border-dark-200 text-dark-600 hover:bg-dark-100'
            }`}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-dark-400 text-xs">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dark-200 text-dark-600 hover:bg-dark-100 transition-colors">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-dark-200 text-dark-600 hover:bg-dark-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next ›
        </button>
      </div>
    </div>
  )
}
