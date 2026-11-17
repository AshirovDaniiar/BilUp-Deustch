import type { L10n, Lang } from '../data/types'

export const tr = (t: L10n | undefined, lang: Lang): string => (t ? (t[lang] ?? t.ru) : '')

/**
 * Text of a STRICT localised value (Russian and Kyrgyz both authored) in the requested explanation language — and nothing else.
 * Unlike `tr` there is NO fallback: a missing language, an empty text, or a language that has no authored text (German UI) yields
 * `undefined`, so a caller must handle it explicitly instead of silently showing another language.
 */
export const trStrict = (t: { ru?: string; ky?: string } | undefined, lang: Lang): string | undefined => {
  if (!t || (lang !== 'ru' && lang !== 'ky')) return undefined
  const v = t[lang]
  return typeof v === 'string' && v.trim() !== '' ? v : undefined
}

/**
 * Text of an authored A2 (strict) pair in the learner's own language, never the other one: Russian for `ru`, Kyrgyz for `ky`, nothing for the German
 * interface. A missing Kyrgyz text yields `undefined` (it is NOT replaced by the Russian one). Legacy A1 spots keep their own display.
 */
export const locStrict = (ru: string | undefined, ky: string | undefined, lang: Lang): string | undefined => (lang === 'ky' ? ky : lang === 'ru' ? ru : undefined)

/** Lowercase, strip punctuation + diacritics-insensitive comparison helper. */
export const normalize = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:„“"'()]/g, '').replace(/\s+/g, ' ').trim()

export const words = (s: string) => normalize(s).split(' ').filter(Boolean)

export const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))
export const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100))
