import type { CSSProperties } from 'react'

/** The one official Unit icon: the BilUp snow-leopard paw. Single source of truth for every Unit card, header and chip. */
export const UNIT_ICON_SRC = `${import.meta.env.BASE_URL}brand/bilup-paw.png`

/** `size` is a CSS length; defaults to filling its container (e.g. .unitcard__icon). */
export function UnitIcon({ size, className = '' }: { size?: number | string; className?: string }) {
  return (
    <img
      className={`unit-icon ${className}`.trim()}
      src={UNIT_ICON_SRC}
      alt=""
      aria-hidden
      draggable={false}
      style={{ '--unit-icon-url': `url(${UNIT_ICON_SRC})`, ...(size != null ? { width: size, height: size } : null) } as CSSProperties}
    />
  )
}
