import type { Lang, LanguageLevel } from './types'

/**
 * Course registry — a deliberately tiny, in-code stand-in for the course manifest planned in docs/architecture/04.
 * Same vocabulary (`levels[].status`, unit ranges, `releasedLocales`) so the later pack conversion is mechanical; no JSON packs,
 * no lazy loading, no versioning (A2 plan, Option B).
 *
 * Nothing in the application reads this yet (Stage 1). It becomes the single source for "which levels exist, which are visible,
 * and for which explanation languages" in Stage 5.
 */
export type LevelStatus = 'planned' | 'beta' | 'released'
/** Explanation locales a level can be released for (`de` is a UI-only locale). */
export type ExplanationLocale = Exclude<Lang, 'de'>

export interface CourseLevel {
  id: LanguageLevel
  status: LevelStatus
  /** Inclusive range of unit ids owned by this level. Ids are global and never reused (progress keys are `${unit}:${section}`). */
  unitIdRange: readonly [number, number]
  /** Further inclusive id ranges owned by the level (A1 curriculum v2: new units are numbered 100 + their position, outside the legacy 1–10). */
  extraUnitIdRanges?: readonly (readonly [number, number])[]
  /**
   * Locales for which the level may be offered. A locale is listed only after its coverage gate passes (04 §7.3);
   * a level that is not released for the selected locale must never fall back to Russian instruction text.
   */
  releasedLocales: readonly ExplanationLocale[]
}

export interface Course {
  /** Same value as `COURSE_ID` in storage/defaults (asserted in tests); duplicated here because `data` must not import `storage`. */
  id: 'de-general'
  levels: readonly CourseLevel[]
}

export const COURSE: Course = {
  id: 'de-general',
  levels: [
    // Kyrgyz is selectable for A1 today (disclosed legacy behaviour); recorded as-is, not as a quality claim.
    { id: 'A1', status: 'released', unitIdRange: [1, 10], extraUnitIdRanges: [[102, 138]], releasedLocales: ['ru', 'ky'] },
    // A2: units 11–20. CONTROLLED BETA for Russian and Kyrgyz (explicit owner approval): visible with a Beta notice; human CEFR / native-language reviews
    // and the level test are still pending (reported by the content validator as Beta flags, blocking a full release). Not offered to the German interface.
    { id: 'A2', status: 'beta', unitIdRange: [11, 20], extraUnitIdRanges: [[201, 243]], releasedLocales: ['ru', 'ky'] },
    // B1: units 21–32. BETA for the Russian and Kyrgyz explanation languages (owner approval for all learners, B1 Beta launch). A Beta is not a stable release: the formal release gate
    // (`content:validate:release`) stays closed until the human CEFR / native-speaker reviews are recorded. The German interface is not offered B1 (only released levels are).
    { id: 'B1', status: 'beta', unitIdRange: [21, 32], extraUnitIdRanges: [[301, 336]], releasedLocales: ['ru', 'ky'] },
  ],
}

export const courseLevel = (level: LanguageLevel): CourseLevel | undefined => COURSE.levels.find(l => l.id === level)

/** A level is shown to learners only when it is not merely planned. */
export const isLevelVisible = (level: LanguageLevel): boolean => {
  const l = courseLevel(level)
  return !!l && l.status !== 'planned'
}

/**
 * Levels a learner with this interface language may see and enter: visible (not planned) AND released for the language they are
 * taught in. 'de' is a UI-only locale (explanations fall back to the explanation languages): the German interface is offered a level only when it is
 * fully RELEASED (status `released`, for at least one explanation language) — a Beta level is offered to its released explanation languages only.
 * Navigation, dashboards, labs and direct URLs all derive from this one list.
 */
export const availableLevels = (lang: Lang): LanguageLevel[] =>
  COURSE.levels
    .filter(
      l =>
        isLevelVisible(l.id) &&
        (lang === 'de' ? l.status === 'released' && l.releasedLocales.length > 0 : l.releasedLocales.includes(lang)),
    )
    .map(l => l.id)

export const isLevelReleasedFor = (level: LanguageLevel, locale: ExplanationLocale): boolean =>
  isLevelVisible(level) && !!courseLevel(level)?.releasedLocales.includes(locale)

/** Level that owns a unit id, from the unit id ranges (works before any unit of the level exists). */
export const levelOfUnitId = (unit: number): LanguageLevel | undefined =>
  Number.isInteger(unit)
    ? COURSE.levels.find(l => [l.unitIdRange, ...(l.extraUnitIdRanges ?? [])].some(([lo, hi]) => unit >= lo && unit <= hi))?.id
    : undefined

/**
 * The level a learner is in when nothing else is known: the first RELEASED level (A1). Used as the explicit default of the
 * level-scoped progress/question functions so the pre-A2 call style keeps meaning "A1" — never "whatever content exists".
 */
export const DEFAULT_LEVEL: LanguageLevel = COURSE.levels.find(l => l.status === 'released')?.id ?? COURSE.levels[0].id

/**
 * Level a learner can actually be working in, given their stored preference (`UserProgress.level`).
 * A planned (invisible) or unknown level cannot be "active": the stored preference is kept untouched, but the active level resolves
 * to DEFAULT_LEVEL. This is the ONE place where that policy lives — content selectors never fall back to another level's content.
 */
export const resolveActiveLevel = (preference: LanguageLevel, lang?: Lang): LanguageLevel => {
  const pool = lang ? availableLevels(lang) : COURSE.levels.filter(l => isLevelVisible(l.id)).map(l => l.id)
  return pool.includes(preference) ? preference : DEFAULT_LEVEL
}
