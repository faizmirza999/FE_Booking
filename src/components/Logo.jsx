/**
 * BeksScoot logo — inline SVG replication of the scooter handlebar icon
 * with BEKS / SCOOT wordmark, rendered in any color via `color` prop.
 */
export default function Logo({ size = 'md', dark = false, iconOnly = false }) {
  const sizeMap = {
    sm: { icon: 28, text1: 'text-base', text2: 'text-[9px]' },
    md: { icon: 36, text1: 'text-xl',   text2: 'text-[11px]' },
    lg: { icon: 48, text1: 'text-2xl',  text2: 'text-sm' },
  }
  const s = sizeMap[size] || sizeMap.md
  const stroke = dark ? '#111315' : '#ffffff'
  const textColor = dark ? 'text-dark-950' : 'text-white'

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Scooter handlebar icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 100 100"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Handlebar */}
        <path d="M10 35 Q20 30 35 33 L45 35" />
        <path d="M90 35 Q80 30 65 33 L55 35" />
        {/* Stem top */}
        <rect x="42" y="22" width="16" height="13" rx="3" />
        {/* Stem */}
        <line x1="50" y1="35" x2="50" y2="52" />
        {/* Body curve */}
        <path d="M30 52 Q50 44 70 52" />
        {/* BEKS wordmark */}
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fontFamily="Inter, Arial, sans-serif"
          fontWeight="800"
          fontSize="22"
          fill={stroke}
          stroke="none"
          letterSpacing="-0.5"
        >
          BEKS
        </text>
        {/* SCOOT wordmark */}
        <text
          x="50"
          y="86"
          textAnchor="middle"
          fontFamily="Inter, Arial, sans-serif"
          fontWeight="600"
          fontSize="12"
          fill={stroke}
          stroke="none"
          letterSpacing="3"
        >
          SCOOT
        </text>
      </svg>

      {!iconOnly && (
        <div className="leading-tight">
          <p className={`font-extrabold tracking-tight ${s.text1} ${textColor}`}>
            Bekspart
          </p>
          <p className={`font-medium tracking-widest uppercase ${s.text2} ${dark ? 'text-dark-500' : 'text-white/60'}`}>
            Sparepart
          </p>
        </div>
      )}
    </div>
  )
}
