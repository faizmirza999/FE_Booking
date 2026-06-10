export default function LoadingSpinner({ text = 'Memuat data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-[3px] border-dark-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-medium text-dark-400">{text}</p>
    </div>
  )
}
