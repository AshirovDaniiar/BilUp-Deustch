import { Mascot } from './Mascot'

/** BilUp mark: a "B" whose counter opens into an upward chevron — knowledge that grows. */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="BilUp Til" className="logomark">
      <rect x="1" y="1" width="62" height="62" rx="17" fill="#262a35" stroke="#424b5f" strokeWidth="2" />
      <path d="M20 14v36h12c8 0 12-4 12-9.500 0-4-2.500-6.500-6-7.500 2.500-1.200 4.200-3.500 4.200-6.500C42.200 17.500 38.500 14 32 14z" fill="none" stroke="#f5f6fa" strokeWidth="5" strokeLinejoin="round" />
      <path d="M40 30l8-9 8 9" fill="none" stroke="#60a5fa" strokeWidth="4.500" strokeLinecap="round" strokeLinejoin="round" transform="translate(-6 -2)" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo">
      <Mascot variant="avatar" size={compact ? 34 : 40} decorative eager className="logo__mascot" />
      <span className="logo__bil">
        Bil<b>Up</b> <span className="logo__til">Til</span>
      </span>
    </div>
  )
}
