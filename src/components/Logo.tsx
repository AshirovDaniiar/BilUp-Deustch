import { useId } from 'react'

/** BilUp mark: a "B" whose counter opens into an upward chevron — knowledge that grows. */
export function LogoMark({ size = 36 }: { size?: number }) {
  const gid = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="BilUp" className="logomark">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2447c9" />
          <stop offset="1" stopColor="#6d4aff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gid})`} />
      <path d="M20 14v36h12c8 0 12-4 12-9.500 0-4-2.500-6.500-6-7.500 2.500-1.200 4.200-3.500 4.200-6.500C42.200 17.500 38.500 14 32 14z" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      <path d="M40 30l8-9 8 9" fill="none" stroke="#ffc233" strokeWidth="4.500" strokeLinecap="round" strokeLinejoin="round" transform="translate(-6 -2)" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo">
      <LogoMark size={compact ? 30 : 36} />
      <div className="logo__text">
        <span className="logo__bil">
          Bil<b>Up</b>
        </span>
        {!compact && <span className="logo__sub">Deutsch</span>}
      </div>
    </div>
  )
}
