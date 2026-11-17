import { SECTIONS, type SectionId } from '../../data/units'
import {
  allUnits,
  allVocabulary,
  grammarIndex,
  levelOfUnit,
  listeningForUnit,
  readingForUnit,
  speakingForUnit,
  unitById,
  unitsOfLevel,
  vocabularyForUnit,
  vocabularyIndex,
  vocabularyOf,
  writingForUnit,
} from '../../data/catalog'
import { DEFAULT_LEVEL, resolveActiveLevel } from '../../data/course'
import type { LanguageLevel, LearningUnit, MasteryStage, Mistake, SkillName, UserProgress } from '../../data/types'
import { isDue, stageOf, STAGES } from '../../services/srs'
import { currentWeek, streakOf } from '../../utils/date'
import { pct } from '../../utils/text'
import type { TKey } from '../../i18n'

export const SKILLS: SkillName[] = ['vocabulary', 'grammar', 'listening', 'reading', 'writing', 'speaking']
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

/** Average of the 8 most recent results per skill; null when never practised. */
export const skillPct = (s: UserProgress, k: SkillName) => avg(s.scores[k].slice(-8))

/**
 * The level the learner is working in. The stored preference is never rewritten; a planned/unknown level simply cannot be active
 * (see resolveActiveLevel). Application code passes this to every level-scoped function below.
 */
export const activeLevel = (s: UserProgress): LanguageLevel => resolveActiveLevel(s.level, s.lang)

// Level-scoped functions take the level as an explicit last parameter. The default (DEFAULT_LEVEL = A1) keeps the pre-A2 call style
// meaning "A1" — it is NOT "whatever content exists". Application code must always pass the level (enforced by a test).

export function stageCounts(s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL): Record<MasteryStage, number> {
  const out = Object.fromEntries(STAGES.map(x => [x, 0])) as Record<MasteryStage, number>
  for (const v of vocabularyOf(level)) out[stageOf(s.mastery[v.id])]++
  return out
}

export const dueWordIds = (s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL) =>
  vocabularyOf(level)
    .filter(v => isDue(s.mastery[v.id]))
    .map(v => v.id)
export const masteredCount = (s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL) =>
  vocabularyOf(level).filter(v => ['strong', 'mastered'].includes(stageOf(s.mastery[v.id]))).length
/** Strong/mastered words over every level — for global achievements (badges), not for level progress. */
const masteredAcrossLevels = (s: UserProgress) =>
  allVocabulary.filter(v => ['strong', 'mastered'].includes(stageOf(s.mastery[v.id]))).length

/**
 * Level a stored mistake belongs to, derived from ids it already carries (no stored level, so no migration).
 * Article drills resolve through the word, everything else through its grammar concept. Evidence that cannot be resolved
 * (legacy refs) belongs to DEFAULT_LEVEL — which is how every mistake has always been treated.
 */
const levelOfMistake = (m: Mistake): LanguageLevel => {
  const concept = m.concept ? grammarIndex.get(m.concept) : undefined
  const word = m.kind === 'article' ? vocabularyIndex.get(m.ref.replace('art-', '')) : undefined
  const unit = word?.unit ?? concept?.unit
  return (unit !== undefined ? levelOfUnit(unit) : undefined) ?? DEFAULT_LEVEL
}
const mistakesOf = (s: UserProgress, level: LanguageLevel) => s.mistakes.filter(m => levelOfMistake(m) === level)

/** Concepts with repeated recent mistakes, worst first. */
export function weakConcepts(s: UserProgress, min = 2, level: LanguageLevel = DEFAULT_LEVEL) {
  const counts: Record<string, number> = {}
  for (const m of mistakesOf(s, level).slice(-80)) if (m.concept) counts[m.concept] = (counts[m.concept] ?? 0) + 1
  return Object.entries(counts)
    .filter(([, n]) => n >= min)
    .sort((a, b) => b[1] - a[1])
    .map(([id, n]) => ({ id, n }))
}

export function articleConfusion(s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL) {
  const recent = mistakesOf(s, level)
    .slice(-40)
    .filter(m => m.kind === 'article')
  return { count: recent.length, ids: recent.map(m => m.ref.replace('art-', '')), active: recent.length >= 3 }
}

/**
 * Which sections a unit REQUIRES (V-06, 08 P1 scope (6)). Temporary stand-in for the course manifest (P2): a section is required only if
 * the unit actually has content for it, so the denominator is truthful — unit 10 has no reading text and can still reach 100 %.
 * Adding content (e.g. a unit-10 reading text) makes the section required automatically; nothing here hard-codes a count.
 */
const HAS_CONTENT: Record<SectionId, (unit: number) => boolean> = {
  vocabulary: u => vocabularyForUnit(u).length > 0,
  grammar: u => (unitById(u)?.grammarIds.length ?? 0) > 0,
  listening: u => listeningForUnit(u).length > 0,
  reading: u => readingForUnit(u).length > 0,
  speaking: u => speakingForUnit(u) !== undefined,
  writing: u => writingForUnit(u).length > 0, // by the task's `unit` metadata, not an id pattern
  review: u => vocabularyForUnit(u).length > 0,
  test: () => true,
}
export const requiredSections = (unit: number): SectionId[] => SECTIONS.filter(sec => HAS_CONTENT[sec](unit))

export const unitProgress = (s: UserProgress, unit: number) => {
  const sections = requiredSections(unit)
  const done = sections.filter(sec => s.completed.includes(`${unit}:${sec}`)).length
  return { done, total: sections.length, pct: pct(done, sections.length) }
}

/** Share of the level's required sections completed (0 for a level without units). Only that level's units count. */
export const levelProgress = (s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL) => {
  const parts = unitsOfLevel(level).map(u => unitProgress(s, u.id))
  return pct(
    parts.reduce((a, p) => a + p.done, 0),
    parts.reduce((a, p) => a + p.total, 0),
  )
}

/**
 * First unfinished unit of the level, or its last unit when all are done. The legacy one-argument form is the A1 contract and
 * always returns a unit; for any other level the result is undefined when the level has no units (planned/empty).
 */
export function currentUnit(s: UserProgress): LearningUnit
export function currentUnit(s: UserProgress, level: LanguageLevel): LearningUnit | undefined
export function currentUnit(s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL): LearningUnit | undefined {
  const units = unitsOfLevel(level)
  return units.find(u => unitProgress(s, u.id).pct < 100) ?? units[units.length - 1]
}

export const completedTopics = (s: UserProgress) => s.completed.filter(c => c.startsWith('topic:')).length

export const streak = (s: UserProgress) => streakOf(s.activeDates)
export const weekDone = (s: UserProgress) => currentWeek().filter(d => s.activeDates.includes(d)).length
export const xpLevel = (xp: number) => {
  const level = Math.floor(Math.sqrt(xp / 60)) + 1
  const base = 60 * (level - 1) ** 2
  const next = 60 * level ** 2
  return { level, pct: pct(xp - base, next - base), toNext: next - xp }
}

export interface Badge {
  id: string
  key: TKey
  icon: string
  earned: boolean
}
export function badges(s: UserProgress): Badge[] {
  const st = streak(s)
  return [
    { id: 'first', key: 'badge_first', icon: '🌱', earned: s.xp > 0 },
    { id: 'streak3', key: 'badge_streak3', icon: '🔥', earned: st >= 3 || s.activeDates.length >= 3 },
    { id: 'streak7', key: 'badge_streak7', icon: '🏅', earned: st >= 7 },
    { id: 'words25', key: 'badge_words25', icon: '🔤', earned: masteredAcrossLevels(s) >= 25 },
    { id: 'grammar5', key: 'badge_grammar5', icon: '🧪', earned: completedTopics(s) >= 5 },
    { id: 'speaker', key: 'badge_speaker', icon: '🎙️', earned: s.scores.speaking.length > 0 },
    { id: 'writer', key: 'badge_writer', icon: '✍️', earned: s.scores.writing.length > 0 },
    { id: 'unit', key: 'badge_unit', icon: '🎓', earned: allUnits.some(u => unitProgress(s, u.id).pct === 100) },
  ]
}

export interface Recommendation {
  id: string
  icon: string
  key: TKey
  arg?: string
  to: string
}
export function recommendations(s: UserProgress, level: LanguageLevel = DEFAULT_LEVEL): Recommendation[] {
  const out: Recommendation[] = []
  if (articleConfusion(s, level).active) out.push({ id: 'articles', icon: '🔠', key: 'rec_articles', to: '/practice/articles' })
  for (const w of weakConcepts(s, 2, level).slice(0, 2)) {
    const c = grammarIndex.get(w.id)
    if (c) out.push({ id: `weak-${w.id}`, icon: '🧪', key: 'rec_practice', arg: c.title.de ?? c.title.ru, to: `/learn/topic/${c.id}` })
  }
  const due = dueWordIds(s, level).length
  if (due > 0) out.push({ id: 'due', icon: '🔁', key: 'rec_due', arg: String(due), to: '/practice/review' })
  const listening = skillPct(s, 'listening')
  if (listening != null && listening >= 85) out.push({ id: 'lis', icon: '🎧', key: 'rec_listening', to: '/practice/listening' })
  return out
}
