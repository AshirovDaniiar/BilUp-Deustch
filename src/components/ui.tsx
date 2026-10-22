import { useEffect, useId, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { A, goBack } from '../app/router'

type Tone = 'blue' | 'violet' | 'green' | 'yellow' | 'red' | 'neutral'

export function Card({ children, className = '', tone, style, as: Tag = 'div' }: { children: ReactNode; className?: string; tone?: Tone; style?: CSSProperties; as?: 'div' | 'section' | 'article' }) {
  return (
    <Tag className={`card ${tone ? `card--${tone}` : ''} ${className}`} style={style}>
      {children}
    </Tag>
  )
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'ghost' | 'violet'
  size?: 'md' | 'lg' | 'sm'
  to?: string
  block?: boolean
}
export function Button({ variant = 'primary', size = 'md', to, block, className = '', children, ...rest }: BtnProps) {
  const cls = `btn btn--${variant} btn--${size} ${block ? 'btn--block' : ''} ${className}`
  if (to) {
    return (
      <A to={to} className={cls}>
        {children}
      </A>
    )
  }
  return (
    <button className={cls} type="button" {...rest}>
      {children}
    </button>
  )
}

export function Chip({ children, tone = 'neutral', active, onClick, className = '' }: { children: ReactNode; tone?: Tone; active?: boolean; onClick?: () => void; className?: string }) {
  const cls = `chip chip--${tone} ${active ? 'is-active' : ''} ${className}`
  return onClick ? (
    <button type="button" className={cls} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  ) : (
    <span className={cls}>{children}</span>
  )
}

export function ProgressBar({ value, tone = 'blue', label, height = 8 }: { value: number; tone?: Tone; label?: string; height?: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="pbar" style={{ height }} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={`pbar__fill pbar__fill--${tone}`} style={{ width: `${v}%` }} />
    </div>
  )
}

export function Ring({ value, size = 84, stroke = 8, tone = 'blue', children }: { value: number; size?: number; stroke?: number; tone?: Tone; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring__track" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} className={`ring__fill ring__fill--${tone}`} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="ring__label">{children}</div>
    </div>
  )
}

export function PageHeader({ title, sub, back, right, eyebrow }: { title: ReactNode; sub?: ReactNode; back?: string; right?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <header className="pagehead">
      {back && (
        <button type="button" className="pagehead__back" onClick={() => goBack(back)} aria-label="Back">
          ←
        </button>
      )}
      <div className="pagehead__text">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="h1">{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {right && <div className="pagehead__right">{right}</div>}
    </header>
  )
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="sectiontitle">
      <h2 className="h2">{children}</h2>
      {right}
    </div>
  )
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: ReactNode }[]; onChange: (v: T) => void; label?: string }) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map(o => (
        <button key={o.id} type="button" role="tab" aria-selected={o.id === value} className={o.id === value ? 'is-active' : ''} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  const id = useId()
  useEffect(() => {
    if (!open) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby={id} onClick={e => e.stopPropagation()}>
        <div className="sheet__grab" />
        <div className="sheet__head">
          <h3 id={id} className="h3">
            {title}
          </h3>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}

export function ScoreBar({ label, value, tone }: { label: string; value: number | null; tone?: Tone }) {
  const t: Tone = tone ?? (value == null ? 'neutral' : value >= 85 ? 'green' : value >= 65 ? 'blue' : 'yellow')
  return (
    <div className="scorebar">
      <div className="scorebar__top">
        <span>{label}</span>
        <strong>{value == null ? '—' : `${value}%`}</strong>
      </div>
      <ProgressBar value={value ?? 0} tone={t} label={label} />
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>
}
