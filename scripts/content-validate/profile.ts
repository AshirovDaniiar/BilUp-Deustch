// Level profiles of the content validator: the level-specific CALIBRATION of the heuristic CEFR checks (text sizes, the table of
// constructions that signal "above this level"). A2's profile is exactly the set of constants the validator has always used (Stage 6A) —
// moved here unchanged so that A2 validation output is byte-identical; B1 has its own profile (Stage 2C).
//
// The profile only calibrates HEURISTICS (review flags). It never decides a CEFR level: nothing here is an authority and no word list is
// involved. The B1 *targets* (vocabulary counts, text-length bands, speaking turns, writing length) are enforced by rules/b1.ts.
import type { LanguageLevel } from '../../src/data/types'

/** German constructions curricula treat as B1 or above. Heuristic regexes on lower-cased text: they over- and under-match by design. */
export interface Pattern {
  id: string
  label: string
  re: RegExp
  /** match against the text as written (German capitalises nouns) instead of the lower-cased text */
  caseSensitive?: true
}
export const B1_PLUS_PATTERNS: Pattern[] = [
  { id: 'passiv', label: 'Passiv (B1)', re: /\b(wird|werden|wurde|wurden|worden)\b[^.!?;]{0,40}\b(ge\w{3,}(?:t|en)|\w{3,}iert)\b/ },
  {
    id: 'konj-b1',
    label: 'Konjunktion obwohl/damit/falls/nachdem/sobald/solange/indem/sodass/sofern (B1)',
    re: /\b(obwohl|damit|falls|nachdem|sobald|solange|indem|sodass|sofern)\b/,
  },
  { id: 'trotzdem', label: 'trotzdem (B1)', re: /\btrotzdem\b/ },
  {
    id: 'relativsatz',
    label: 'possible Relativsatz "Nomen, der/die/das …" (B1)',
    // a capitalised noun directly before the comma separates "Der Mann, der hier wohnt" from "Ja, die Wohnung ist frei"
    // (measured on real A1 German: the looser form flagged 7 of 10 units; the remaining false positives were the interjections excluded here)
    re: /\b(?!(?:Ja|Nein|Doch|Danke|Bitte|Hallo|Gut|Okay|Also|Na|Oh|Ach)\b)[A-ZÄÖÜ][a-zäöüß]+,\s+(der|die|das|den|dem|dessen|deren)\s+[a-zäöüß]+/,
    caseSensitive: true,
  },
  {
    id: 'plusquam',
    label: 'Plusquamperfekt hatte/war + Partizip II (B1)',
    re: /\b(hatte|hatten|hattest|hattet|war|waren|warst|wart)\b[^.!?;]{0,40}\bge\w{3,}(?:t|en)\b/,
  },
  {
    id: 'konj2-past',
    label: 'Konjunktiv II der Vergangenheit hätte/wäre + Partizip II (B1)',
    re: /\b(hätte|hätten|wäre|wären)\b[^.!?;]{0,40}\bge\w{3,}(?:t|en)\b/,
  },
  { id: 'genitiv', label: 'Genitiv des/eines + Nomen auf -s (B1)', re: /\b(des|eines)\s+\w+s\b/ },
  { id: 'futur2', label: 'Futur II (B2)', re: /\bwird\b[^.!?;]{0,40}\bge\w{3,}(?:t|en)\s+(haben|sein)\b/ },
]

/** Sentence/text length bounds that typical A2 reading material stays within. Outside them: a review flag, not an error. */
export const READING_WORDS = { min: 30, max: 180 }
export const SENTENCE_WORDS_MAX = 22
export const LISTENING_WORDS_MAX = 140

/**
 * Constructions curricula place at B2 or above — the "ceiling" table of the B1 profile. Heuristic regexes on lower-cased text; a hit means
 * "a CEFR reviewer must look" (e.g. a receptive-only Konjunktiv II der Vergangenheit in a reading text is legitimate in Unit 31), never
 * "wrong". Passiv, Relativsatz, `obwohl`, `damit`, Plusquamperfekt, Konjunktiv II forms and Genitiv are B1 content and are NOT flagged.
 */
export const B2_PLUS_PATTERNS: Pattern[] = [
  {
    id: 'passiv-perfekt',
    label: 'Passiv Perfekt/Plusquamperfekt with "worden" (receptive only at B1)',
    re: /\bworden\b/,
  },
  {
    id: 'konj2-vergangenheit',
    label: 'Konjunktiv II der Vergangenheit hätte/wäre + Partizip II (receptive only at B1)',
    re: /\b(hätte|hätten|hättest|hättet|wäre|wären|wärst|wärt)\b[^.!?;]{0,40}\bge\w{3,}(?:t|en)\b/,
  },
  { id: 'futur2', label: 'Futur II (B2)', re: /\bwird\b[^.!?;]{0,40}\bge\w{3,}(?:t|en)\s+(haben|sein)\b/ },
  {
    id: 'konjunktiv1',
    label: 'Konjunktiv I / indirect speech (B2)',
    re: /\b(er|sie|es|man)\s+(sei(?!\s+denn)|habe|werde|könne|müsse|solle|wolle|dürfe)\b/,
  },
  { id: 'es-sei-denn', label: '"es sei denn" (B2)', re: /\bes sei denn\b/ },
  { id: 'ohne-statt-dass', label: '"ohne dass" / "(an)statt dass" (B2)', re: /\b(ohne|statt|anstatt) dass\b/ },
  { id: 'als-ob', label: '"als ob" (B2)', re: /\bals ob\b/ },
]

/**
 * The B1 text bands (docs/b1/B1_CURRICULUM.md §5). A unit belongs to exactly one band. Every number is a TARGET of the proposed curriculum v2,
 * calibrated to the measured A2 baseline (reading 50–92 words, listening 82–125, 4 speaking turns, writing 50–60): provisional until the
 * owner approves the curriculum, and changed only by an approved curriculum change.
 */
export interface B1Band {
  key: string
  units: readonly [number, number]
  /** reading words per text */
  reading: readonly [number, number]
  /** Unit 32 only: one long text in `readingLong` and one short text in `readingShort` instead of two texts in `reading` */
  readingLong?: readonly [number, number]
  readingShort?: readonly [number, number]
  /** listening words per text */
  listening: readonly [number, number]
  /** sentence length in words over the unit's reading and listening texts: 95th percentile and maximum */
  sentenceP95: number
  sentenceMax: number
  /** turns of the scripted speaking scenario */
  speakingTurns: readonly [number, number]
  /** writing `minWords`; a formal letter may go down to `formalMin` (accuracy matters more than length) */
  writing: readonly [number, number]
  formalMin: number
}

export const B1_BANDS: readonly B1Band[] = [
  {
    key: '21-22',
    units: [21, 22],
    reading: [100, 150],
    listening: [110, 140],
    sentenceP95: 16,
    sentenceMax: 22,
    speakingTurns: [5, 6],
    writing: [70, 80],
    formalMin: 60,
  },
  {
    key: '23-26',
    units: [23, 26],
    reading: [120, 180],
    listening: [120, 160],
    sentenceP95: 18,
    sentenceMax: 24,
    speakingTurns: [6, 6],
    writing: [70, 80],
    formalMin: 60,
  },
  {
    key: '27-29',
    units: [27, 29],
    reading: [130, 210],
    listening: [130, 180],
    sentenceP95: 20,
    sentenceMax: 25,
    speakingTurns: [6, 7],
    writing: [80, 85],
    formalMin: 60,
  },
  {
    key: '30-31',
    units: [30, 31],
    reading: [150, 220],
    listening: [140, 190],
    sentenceP95: 20,
    sentenceMax: 26,
    speakingTurns: [7, 7],
    writing: [70, 90],
    formalMin: 60,
  },
  {
    key: '32',
    units: [32, 32],
    reading: [80, 250],
    readingLong: [200, 250],
    readingShort: [80, 150],
    listening: [120, 220],
    sentenceP95: 22,
    sentenceMax: 28,
    speakingTurns: [8, 8],
    writing: [70, 90],
    formalMin: 60,
  },
]
export const b1BandOf = (unit: number): B1Band | undefined => B1_BANDS.find(b => unit >= b.units[0] && unit <= b.units[1])

export interface LevelProfile {
  level: LanguageLevel
  /** the table of "above this level" constructions the heuristic CEFR rule applies */
  patterns: Pattern[]
  /** how a pattern hit is worded (the A2 wording is the one the validator has always produced) */
  patternMessage: (p: Pattern) => string
  /**
   * `generic`   — the heuristic sentence/text-length flags of rules/cefr.ts apply with the A2 constants (A2's profile, unchanged);
   * `level-rules` — the level's own rule module checks text sizes against targets (B1: rules/b1.ts, band by band), so the generic flags are skipped.
   */
  textChecks: 'generic' | 'level-rules'
  /** the level named in A2-calibrated messages */
  label: string
}

const A2_PROFILE: LevelProfile = {
  level: 'A2',
  patterns: B1_PLUS_PATTERNS,
  patternMessage: p => `possible B1+ construction: ${p.label}. Heuristic — a CEFR reviewer must decide`,
  textChecks: 'generic',
  label: 'A2',
}

const B1_PROFILE: LevelProfile = {
  level: 'B1',
  patterns: B2_PLUS_PATTERNS,
  patternMessage: p =>
    `possible B2+ construction: ${p.label}. Heuristic — a CEFR reviewer must decide (legitimate if declared receptive-only in the unit metadata)`,
  textChecks: 'level-rules',
  label: 'B1',
}

/** The profile of a level. Every strict level that has no profile of its own keeps the original (A2) calibration — exactly the behaviour before profiles existed. */
export const profileOf = (level: LanguageLevel | undefined): LevelProfile => (level === 'B1' ? B1_PROFILE : A2_PROFILE)
