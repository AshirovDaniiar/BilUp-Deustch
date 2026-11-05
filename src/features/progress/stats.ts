import { GRAMMAR } from '../../data/grammar'
import { listeningForUnit } from '../../data/listening'
import { readingForUnit } from '../../data/reading'
import { SECTIONS, UNITS, UNIT_SPEAKING, type SectionId } from '../../data/units'
import { writingById } from '../../data/writing'
import type { MasteryStage, SkillName, UserProgress } from '../../data/types'
import { VOCABULARY, vocabForUnit } from '../../data/vocabulary'
import { isDue, stageOf, STAGES } from '../../services/srs'
import { currentWeek, streakOf } from '../../utils/date'
import { pct } from '../../utils/text'
import type { TKey } from '../../i18n'

export const SKILLS: SkillName[] = ['vocabulary', 'grammar', 'listening', 'reading', 'writing', 'speaking']
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

/** Average of the 8 most recent results per skill; null when never practised. */
export const skillPct = (s: UserProgress, k: SkillName) => avg(s.scores[k].slice(-8))

export function stageCounts(s: UserProgress): Record<MasteryStage, number> {
  const out = Object.fromEntries(STAGES.map(x => [x, 0])) as Record<MasteryStage, number>
  for (const v of VOCABULARY) out[stageOf(s.mastery[v.id])]++
  return out
}

export const dueWordIds = (s: UserProgress) => VOCABULARY.filter(v => isDue(s.mastery[v.id])).map(v => v.id)
export const masteredCount = (s: UserProgress) => VOCABULARY.filter(v => ['strong', 'mastered'].includes(stageOf(s.mastery[v.id]))).length

/** Concepts with repeated recent mistakes, worst first. */
export function weakConcepts(s: UserProgress, min = 2) {
  const counts: Record<string, number> = {}
  for (const m of s.mistakes.slice(-80)) if (m.concept) counts[m.concept] = (counts[m.concept] ?? 0) + 1
  return Object.entries(counts).filter(([, n]) => n >= min).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n }))
}

export function articleConfusion(s: UserProgress) {
  const recent = s.mistakes.slice(-40).filter(m => m.kind === 'article')
  return { count: recent.length, ids: recent.map(m => m.ref.replace('art-', '')), active: recent.length >= 3 }
}

/**
 * Which sections a unit REQUIRES (V-06, 08 P1 scope (6)). Temporary stand-in for the course manifest (P2): a section is required only if
 * the unit actually has content for it, so the denominator is truthful — unit 10 has no reading text and can still reach 100 %.
 * Adding content (e.g. a unit-10 reading text) makes the section required automatically; nothing here hard-codes a count.
 */
const HAS_CONTENT: Record<SectionId, (unit: number) => boolean> = {
  vocabulary: u => vocabForUnit(u).length > 0,
  grammar: u => (UNITS.find(x => x.id === u)?.grammarIds.length ?? 0) > 0,
  listening: u => listeningForUnit(u).length > 0,
  reading: u => readingForUnit(u).length > 0,
  speaking: u => UNIT_SPEAKING[u - 1] !== undefined,
  writing: u => writingById.has(`wr${String(u).padStart(2, '0')}`),
  review: u => vocabForUnit(u).length > 0,
  test: () => true,
}
export const requiredSections = (unit: number): SectionId[] => SECTIONS.filter(sec => HAS_CONTENT[sec](unit))

export const unitProgress = (s: UserProgress, unit: number) => {
  const sections = requiredSections(unit)
  const done = sections.filter(sec => s.completed.includes(`${unit}:${sec}`)).length
  return { done, total: sections.length, pct: pct(done, sections.length) }
}

export const levelProgress = (s: UserProgress) => {
  const parts = UNITS.map(u => unitProgress(s, u.id))
  return pct(parts.reduce((a, p) => a + p.done, 0), parts.reduce((a, p) => a + p.total, 0))
}

export const currentUnit = (s: UserProgress) => UNITS.find(u => unitProgress(s, u.id).pct < 100) ?? UNITS[UNITS.length - 1]

export const completedTopics = (s: UserProgress) => s.completed.filter(c => c.startsWith('topic:')).length

export const streak = (s: UserProgress) => streakOf(s.activeDates)
export const weekDone = (s: UserProgress) => currentWeek().filter(d => s.activeDates.includes(d)).length
export const xpLevel = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 60)) + 1
  const base = 60 * (level - 1) ** 2
  const next = 60 * level ** 2
  return { level, pct: pct(xp - base, next - base), toNext: next - xp }
}

export interface Badge { id: string; key: TKey; icon: string; earned: boolean }
export function badges(s: UserProgress): Badge[] {
  const st = streak(s)
  return [
    { id: 'first', key: 'badge_first', icon: '🌱', earned: s.xp > 0 },
    { id: 'streak3', key: 'badge_streak3', icon: '🔥', earned: st >= 3 || s.activeDates.length >= 3 },
    { id: 'streak7', key: 'badge_streak7', icon: '🏅', earned: st >= 7 },
    { id: 'words25', key: 'badge_words25', icon: '🔤', earned: masteredCount(s) >= 25 },
    { id: 'grammar5', key: 'badge_grammar5', icon: '🧪', earned: completedTopics(s) >= 5 },
    { id: 'speaker', key: 'badge_speaker', icon: '🎙️', earned: s.scores.speaking.length > 0 },
    { id: 'writer', key: 'badge_writer', icon: '✍️', earned: s.scores.writing.length > 0 },
    { id: 'unit', key: 'badge_unit', icon: '🎓', earned: UNITS.some(u => unitProgress(s, u.id).pct === 100) },
  ]
}

export interface Recommendation { id: string; icon: string; key: TKey; arg?: string; to: string }
export function recommendations(s: UserProgress): Recommendation[] {
  const out: Recommendation[] = []
  if (articleConfusion(s).active) out.push({ id: 'articles', icon: '🔠', key: 'rec_articles', to: '/practice/articles' })
  for (const w of weakConcepts(s).slice(0, 2)) {
    const c = GRAMMAR.find(g => g.id === w.id)
    if (c) out.push({ id: `weak-${w.id}`, icon: '🧪', key: 'rec_practice', arg: c.title.de ?? c.title.ru, to: `/learn/topic/${c.id}` })
  }
  const due = dueWordIds(s).length
  if (due > 0) out.push({ id: 'due', icon: '🔁', key: 'rec_due', arg: String(due), to: '/practice/review' })
  const listening = skillPct(s, 'listening')
  if (listening != null && listening >= 85) out.push({ id: 'lis', icon: '🎧', key: 'rec_listening', to: '/practice/listening' })
  return out
}
