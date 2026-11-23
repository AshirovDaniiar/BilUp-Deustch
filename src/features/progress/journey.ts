import { availableLevels } from '../../data/course'
import { isLevelContentLoaded } from '../../data/catalog'
import type { L10n, LanguageLevel, UserProgress } from '../../data/types'
import { activeLevel, levelProgress } from './stats'

/**
 * The learning journey shown on the home screen: six CEFR milestones, A1 → C2.
 * Everything here is DERIVED from the course registry (which levels exist for this learner) and from the saved completion keys
 * (via `levelProgress`) — nothing is stored, nothing is invented, so there is no second progress model and no storage migration.
 */
export type JourneyLevel = LanguageLevel | 'C2'
export const JOURNEY_LEVELS: readonly JourneyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

/** completed: every required section done · current: where the learner is · open: enterable · locked: no content for this learner. */
export type MilestoneStatus = 'completed' | 'current' | 'open' | 'locked'

export interface Milestone {
  level: JourneyLevel
  status: MilestoneStatus
  /** the level has real content for this learner and can be entered */
  enterable: boolean
  /** share of the level's required sections completed (0 for a level without content) */
  pct: number
}

export interface Journey {
  milestones: Milestone[]
  /**
   * Distance travelled along the road, in segments (0 … 6). Segment k leads TO milestone k, so a position of k means "standing at
   * milestone k" and k + p/100 means "p % of the way from milestone k-1 to milestone k". Defined by the furthest level with saved
   * progress: its index plus its real completion share.
   */
  position: number
  /** every enterable level's content is loaded, so `position` reflects all saved progress (an unloaded level would read as 0 %) */
  ready: boolean
  /** index of the milestone the learner is working towards */
  currentIndex: number
}

export function buildJourney(state: UserProgress): Journey {
  const enterable = (l: JourneyLevel) => l !== 'C2' && availableLevels(state.lang).includes(l)
  const pcts = JOURNEY_LEVELS.map(l => (enterable(l) ? levelProgress(state, l as LanguageLevel) : 0))
  const ready = JOURNEY_LEVELS.every(l => !enterable(l) || isLevelContentLoaded(l as LanguageLevel))

  let position = 0
  for (let i = JOURNEY_LEVELS.length - 1; i >= 0; i--) {
    if (pcts[i] > 0) {
      position = i + pcts[i] / 100
      break
    }
  }
  const lastEnterable = JOURNEY_LEVELS.reduce((acc, l, i) => (enterable(l) ? i : acc), 0)
  const derived = Math.min(Math.floor(position), lastEnterable)
  // The level the learner has chosen to work in (the one "Continue" resumes) is the current milestone while it is unfinished; otherwise
  // the current milestone follows the progress, so finishing a level points at the next one.
  const chosen = JOURNEY_LEVELS.indexOf(activeLevel(state))
  const currentIndex = chosen >= 0 && enterable(JOURNEY_LEVELS[chosen]) && pcts[chosen] < 100 ? chosen : derived

  const milestones = JOURNEY_LEVELS.map((level, i): Milestone => {
    const can = enterable(level)
    const status: MilestoneStatus = !can ? 'locked' : pcts[i] === 100 ? 'completed' : i === currentIndex ? 'current' : 'open'
    return { level, status, enterable: can, pct: pcts[i] }
  })
  return { milestones, position, ready, currentIndex }
}

// ───────────── road geometry (SVG user units; the stage scales it to the available width) ─────────────
export const MAP_W = 360
export const ROW_GAP = 150
export const FIRST_ROW_Y = 210
export const MAP_H = FIRST_ROW_Y + ROW_GAP * (JOURNEY_LEVELS.length - 1) + 60
const X_RIGHT = 290
const X_LEFT = 70
type Pt = readonly [number, number]
/** Where the road begins (above the first milestone). */
const START: Pt = [MAP_W / 2, 100]
/** Milestone i sits at the base of its mountain; the road alternates right, left, right … so it winds down the map. */
export const milestonePoint = (i: number): Pt => [i % 2 === 0 ? X_RIGHT : X_LEFT, FIRST_ROW_Y + ROW_GAP * i]
/** true when milestone i is on the right-hand side of the road (its label goes to the left). */
export const isRight = (i: number) => i % 2 === 0

/** Cubic segment k: from the previous milestone (or the start) to milestone k, with vertical handles so the road makes smooth S-bends. */
function segment(k: number): [Pt, Pt, Pt, Pt] {
  const a = k === 0 ? START : milestonePoint(k - 1)
  const b = milestonePoint(k)
  const h = k === 0 ? 60 : ROW_GAP / 2
  return [a, [a[0], a[1] + h], [b[0], b[1] - h], b]
}
export const SEGMENT_COUNT = JOURNEY_LEVELS.length
export const segmentPath = (k: number) => {
  const [a, c1, c2, b] = segment(k)
  return `M${a[0]} ${a[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`
}

const bezier = ([a, c1, c2, b]: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const u = 1 - t
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [a[0] * w[0] + c1[0] * w[1] + c2[0] * w[2] + b[0] * w[3], a[1] * w[0] + c1[1] * w[1] + c2[1] * w[2] + b[1] * w[3]]
}

/** Point at a fraction (0…1) of the segment's ARC LENGTH — the same measure the SVG dash uses, so the mascot and the lit road agree. */
function pointOnSegment(k: number, fraction: number): Pt {
  const seg = segment(k)
  const N = 64
  const pts = Array.from({ length: N + 1 }, (_, i) => bezier(seg, i / N))
  const cum = [0]
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const target = Math.max(0, Math.min(1, fraction)) * cum[N]
  let i = 1
  while (i < N && cum[i] < target) i++
  const span = cum[i] - cum[i - 1] || 1
  const r = (target - cum[i - 1]) / span
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * r, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * r]
}

/** Share (0…1) of segment k that has been travelled at the given journey position. */
export const travelled = (position: number, k: number) => Math.max(0, Math.min(1, position - k))

/** Map coordinates of the mascot's feet for a journey position (0 … SEGMENT_COUNT). */
export function mascotPoint(position: number): Pt {
  const p = Math.max(0, Math.min(SEGMENT_COUNT, position))
  const k = Math.min(SEGMENT_COUNT - 1, Math.floor(p))
  return pointOnSegment(k, p - k)
}

// ───────────── texts (local L10n, like the mascot alt text: no dictionary-key churn) ─────────────
export const JOURNEY_TEXT = {
  resumeTitle: { ru: 'Продолжить обучение', ky: 'Окууну улантуу', de: 'Weiterlernen' } satisfies L10n,
  resumeBtn: { ru: 'Продолжить →', ky: 'Улантуу →', de: 'Weiter →' } satisfies L10n,
  startBtn: { ru: 'Начать →', ky: 'Баштоо →', de: 'Starten →' } satisfies L10n,
  resumeHint: { ru: 'Продолжайте с того места, где остановились.', ky: 'Токтогон жериңизден улантыңыз.', de: 'Mach genau da weiter, wo du aufgehört hast.' } satisfies L10n,
  startHint: { ru: 'Начните с первого урока.', ky: 'Биринчи сабактан баштаңыз.', de: 'Starte mit der ersten Lektion.' } satisfies L10n,
  journeyTitle: { ru: 'Мой путь в немецком', ky: 'Менин немис тилиндеги жолум', de: 'Mein Weg im Deutschen' } satisfies L10n,
  completed: { ru: 'Пройден', ky: 'Өтүлдү', de: 'Geschafft' } satisfies L10n,
}

export const LEVEL_NAMES: Record<JourneyLevel, L10n> = {
  A1: { ru: 'Мугалим чокусу', ky: 'Мугалим чокусу', de: 'Мугалим чокусу' },
  A2: { ru: 'Жигит чокусу', ky: 'Жигит чокусу', de: 'Жигит чокусу' },
  B1: { ru: 'Корумду чокусу', ky: 'Корумду чокусу', de: 'Корумду чокусу' },
  B2: { ru: 'Хан-Теңири', ky: 'Хан-Теңири', de: 'Хан-Теңири' },
  C1: { ru: 'Ленин чокусу', ky: 'Ленин чокусу', de: 'Ленин чокусу' },
  C2: { ru: 'Жеңиш чокусу', ky: 'Жеңиш чокусу', de: 'Жеңиш чокусу' },
}
