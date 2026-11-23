import { describe, expect, it } from 'vitest'
import type { L10n } from '../src/data/types'
import { dictionaries, makeT, type TKey } from '../src/i18n'
import { tr } from '../src/utils/text'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Localization PROVENANCE skeleton (02 §7). The real provenance system (source-tagged strings, per-locale release gates) is P2/P3.
 * What can honestly be tested today: structural completeness of the three UI dictionaries, and how much of the Kyrgyz
 * dictionary is inherited from / identical to Russian. The Kyrgyz file is built as `{ ...ru, overrides }`, so an inherited
 * string is indistinguishable from a translated one at runtime — identity with Russian is the best available signal.
 * Per 02 §7.0 this test never inspects characters (Kyrgyz uses ы э ё щ ъ too).
 */
const ru = dictionaries.ru as Record<string, string>
const keys = Object.keys(ru) as TKey[]
const identicalToRu = (lang: 'ky' | 'de') => keys.filter(k => (dictionaries[lang] as Record<string, string>)[k] === ru[k])

/** Ratchet baselines measured at P0. Lower is better; raise only with a recorded reason. totalKeys 280 → 283: Stage 7A.2 added levelLoading, levelLoadFailed, levelLoadFailedAgain (lazy A2 loading UX, ru + ky + de). 283 → 284: Stage 9B added audioUnavailable (listening fallback when no German speech voice exists, ru + ky + de). 284 → 288: Stage 9C added qMeaning, qGerman, qWordIs, qListenWhy (localized A2 vocabulary / listening question texts, ru + ky + de). 288 → 289: Stage Beta added betaNotice (the A2 Beta notice, ru + ky + de). 289 → 317: B1 Unit 21 added the 28 fb_* keys (checklist and self-assessment shown instead of automated numeric scores for B1 speaking and writing, ru + ky + de; the Kyrgyz is an UNREVIEWED AI draft). kyIdenticalToRu 173 → 119: Stage 9C wrote Kyrgyz (UNREVIEWED AI draft) for the assessment, daily, review and result strings that were inherited from Russian. 317 → 318: B1 Stage 3C added betaNoticeLevel (level-aware Beta notice with a {level} placeholder; for A2 it renders word for word as betaNotice). kyIdenticalToRu 119 → 71: Stage 3C wrote Kyrgyz (UNREVIEWED AI draft) for 48 UI strings still inherited from Russian on the B1 screens; loanwords that are legitimately identical in Kyrgyz (Грамматика, Практика, Профиль, Диалог, Текст …) 318 → 317: the unused learnSub (the Learning page subtitle, removed with the Чокулар restructure) was deleted from ru + ky + de. stay. 317 → 318: A1 curriculum v2 added sec_empty (empty-section placeholder, ru + ky + de). 318 → 319: grammarPartial (label for a partially covering reused grammar lesson, ru + ky + de). */
const BASELINE = { kyIdenticalToRu: 71, deIdenticalToRu: 10, totalKeys: 319 }

describe('UI dictionaries: structure', () => {
  it('ky and de define exactly the keys of ru (no missing, no extra)', () => {
    for (const lang of ['ky', 'de'] as const) {
      expect(Object.keys(dictionaries[lang]).sort()).toEqual([...keys].sort())
    }
  })

  it('no empty strings in any dictionary', () => {
    for (const lang of ['ru', 'ky', 'de'] as const) {
      const empty = keys.filter(k => !(dictionaries[lang] as Record<string, string>)[k])
      expect(empty, `${lang} has empty values`).toEqual([])
    }
  })

  it('records the key count baseline', () => {
    expect(keys).toHaveLength(BASELINE.totalKeys)
  })
})

describe('Kyrgyz provenance ratchet (measured, not a quality verdict)', () => {
  it('KNOWN-GAP: a large part of the Kyrgyz UI is identical to Russian today (inherited or untranslated)', () => {
    const n = identicalToRu('ky').length
    expect(n).toBeGreaterThan(0)
    expect(n).toBeLessThanOrEqual(BASELINE.kyIdenticalToRu) // may only go down
  })

  it('German UI strings differ from Russian except documented identical ones', () => {
    expect(identicalToRu('de').length).toBeLessThanOrEqual(BASELINE.deIdenticalToRu)
  })

  it('the Kyrgyz dictionary is built by spreading Russian (source check — the mechanism behind silent fallback)', () => {
    const src = readFileSync(join(__dirname, '../src/i18n/ky.ts'), 'utf8')
    expect(src).toMatch(/\.\.\.ru\b/)
  })
})

describe('fallback behaviour (pins current, non-compliant behaviour)', () => {
  it('makeT returns the locale string when present', () => {
    expect(makeT('de')('back')).toBe(dictionaries.de.back)
    expect(makeT('ky')('back')).toBe(dictionaries.ky.back)
  })

  it('KNOWN-GAP vs 02 §5: makeT falls back to Russian when a key is missing', () => {
    const t = makeT('ky')
    const original = (dictionaries.ky as Record<string, string | undefined>).back
    delete (dictionaries.ky as Record<string, string | undefined>).back
    try {
      expect(t('back')).toBe(ru.back) // silent Russian fallback
    } finally {
      ;(dictionaries.ky as Record<string, string | undefined>).back = original
    }
  })

  it('KNOWN-GAP vs 02 §5: content strings (L10n) fall back to Russian without any marker', () => {
    const item: L10n = { ru: 'только по-русски' }
    expect(tr(item, 'ky')).toBe('только по-русски')
    expect(tr(item, 'de')).toBe('только по-русски')
  })
})

describe('localization fixtures', () => {
  const load = (n: string) =>
    JSON.parse(readFileSync(join(__dirname, 'fixtures/localization', n), 'utf8')) as { items: { id: string; text: L10n }[] }

  it('complete fixture resolves natively in every locale (no fallback needed)', () => {
    const { items } = load('l10n-complete.json')
    for (const { text } of items) for (const lang of ['ru', 'ky', 'de'] as const) expect(text[lang]).toBeTruthy()
  })

  it('incomplete fixture: exactly the items without text in a locale would fall back', () => {
    const { items } = load('l10n-missing-ky.json')
    const wouldFallback = items.filter(i => !i.text.ky).map(i => i.id)
    expect(wouldFallback).toEqual(['item-2', 'item-3'])
    for (const i of items) expect(tr(i.text, 'ky')).toBeTruthy() // today nothing is reported — the gap is invisible to the learner
  })

  it('Kyrgyz text containing ы э ё щ ъ is valid Kyrgyz and is not treated as Russian (02 §7.0)', () => {
    const { items } = load('l10n-complete.json')
    const ky = items.find(i => i.id === 'item-letters')!.text.ky!
    expect(/[ыэёщъ]/i.test(ky)).toBe(true)
    // A character-based "is this Russian?" check would misclassify it; the architecture forbids such checks.
    expect(ky).not.toBe(items.find(i => i.id === 'item-letters')!.text.ru)
  })
})
