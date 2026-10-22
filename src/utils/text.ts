import type { L10n, Lang } from '../data/types'

export const tr = (t: L10n | undefined, lang: Lang): string => (t ? (t[lang] ?? t.ru) : '')

/** Lowercase, strip punctuation + diacritics-insensitive comparison helper. */
export const normalize = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:„“"'()]/g, '').replace(/\s+/g, ' ').trim()

export const words = (s: string) => normalize(s).split(' ').filter(Boolean)

export const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))
export const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100))
