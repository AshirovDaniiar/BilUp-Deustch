import { REAL_LIFE } from '../../data/reallife'
import type {
  Exercise,
  L10n,
  LanguageLevel,
  ListeningExercise,
  Mistake,
  ReadingText,
  TestDef,
  TestQuestion,
  VocabularyItem,
} from '../../data/types'
import { displayWord } from '../../data/vocabulary'
import {
  exercisesForUnit,
  exercisesOf,
  finalTestOfUnit,
  grammarIndex,
  grammarOf,
  levelOfUnit,
  listeningOf,
  vocabularyForUnit,
  vocabularyOf,
} from '../../data/catalog'
import { DEFAULT_LEVEL, courseLevel } from '../../data/course'
import { dictionaries } from '../../i18n'
import type { Lang } from '../../data/types'
import { tr, trStrict } from '../../utils/text'
import { newSeed, pick, seeded, shuffle } from '../../utils/random'
import { attemptOptions } from './answerOrder'
import { dayKey } from '../../utils/date'

/** UI-level question that every quiz surface (practice, tests, daily) renders the same way. */
export interface Question {
  id: string
  type: 'choice' | 'fill' | 'order' | 'article'
  prompt: string
  promptRu?: string
  /** Kyrgyz rendering of the prompt (authored A2 items); shown to the Kyrgyz interface only */
  promptKy?: string
  /** authored A2 question: its Russian / Kyrgyz texts are shown strictly in the learner's own language (never a fallback to the other one) */
  strict?: boolean
  options?: string[]
  answer: string
  words?: string[]
  why?: L10n
  concept?: string
  vocabId?: string
  skill: 'grammar' | 'vocabulary' | 'listening' | 'reading'
  kind: Mistake['kind']
  audio?: string
  unit?: number
}

export const fromExercise = (e: Exercise): Question => ({
  id: e.id,
  type: e.type,
  prompt: e.prompt,
  promptRu: e.promptRu,
  options: e.options,
  answer: e.answer,
  words: e.words,
  why: e.why,
  concept: e.concept,
  ...(e.promptKy !== undefined && levelOfUnit(e.unit) !== 'A1' ? { promptKy: e.promptKy, strict: true } : {}),
  skill: 'grammar',
  kind: e.type === 'article' ? 'article' : 'grammar',
  unit: e.unit,
  vocabId: e.type === 'article' ? e.id.replace('art-', '') : undefined,
})

const KIND_OF_SKILL: Record<NonNullable<TestQuestion['skill']>, Question['kind']> = {
  grammar: 'grammar',
  vocabulary: 'vocabulary',
  reading: 'grammar',
  listening: 'listening',
}

/**
 * The authored final-test questions of a unit (A2: 15 per unit, `promptRu` + `promptKy` + strict `why`) as quiz questions, in their authored order.
 * The ORDER OF THE OPTIONS is randomised per attempt (same rule as listening / reading); texts and answers are exactly the authored ones.
 */
export function finalTestQuestions(unit: number, questions: readonly TestQuestion[], attemptSeed: string = newSeed()): Question[] {
  return questions.map(q => ({
    id: q.id,
    type: q.prompt.includes('___') ? ('fill' as const) : ('choice' as const),
    prompt: q.prompt,
    promptRu: q.promptRu,
    promptKy: q.promptKy,
    strict: true,
    options: attemptOptions(q.options, attemptSeed, q.id),
    answer: q.answer,
    why: q.why,
    concept: q.concept,
    ...(q.audio ? { audio: q.audio } : {}),
    skill: q.skill ?? 'grammar',
    kind: KIND_OF_SKILL[q.skill ?? 'grammar'],
    unit,
  }))
}

/** Fill `{name}` placeholders of an interface string. */
const fmt = (template: string, vars: Record<string, string>): string =>
  Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), template)

/**
 * The hint (translation of the question) and the explanation of a question, in the learner's language.
 * A `strict` (authored A2) question shows ONLY the learner's own language — a missing text is not replaced by the other language and the German interface
 * receives neither; a legacy (A1) question keeps its Russian hint and the `tr()` explanation, exactly as before.
 */
export const questionHint = (q: Pick<Question, 'strict' | 'promptRu' | 'promptKy'>, lang: Lang): string | undefined =>
  q.strict ? trStrict({ ru: q.promptRu, ky: q.promptKy }, lang) : q.promptRu
export const questionWhy = (q: Pick<Question, 'strict' | 'why'>, lang: Lang): string | undefined =>
  q.strict ? trStrict(q.why, lang) : q.why ? tr(q.why, lang) : undefined

/**
 * Meaning question; direction alternates so recall works both ways.
 * `lang` (ru | ky) makes a question of a NON-A1 word fully localized: prompt, options and explanation are in that language and the question is `strict`
 * (no fallback to the other language). Without `lang`, and for every A1 word, the output is exactly the legacy Russian question.
 */
export function vocabQuestion(v: VocabularyItem, index: number, rnd: () => number = Math.random, lang?: Lang): Question {
  const level = levelOfUnit(v.unit)
  const pool = level ? vocabularyOf(level).filter(x => x.id !== v.id && x.pos === v.pos && x.unit !== undefined) : []
  const distractors = pick(pool, 3, rnd)
  if ((lang === 'ru' || lang === 'ky') && level !== undefined && level !== 'A1') {
    const g = (x: VocabularyItem) => (lang === 'ky' ? x.ky : x.ru)
    const why = Object.fromEntries(
      (['ru', 'ky'] as const).map(l => [l, fmt(dictionaries[l].qWordIs, { w: displayWord(v), g: l === 'ky' ? v.ky : v.ru, e: v.example })]),
    ) as { ru: string; ky: string }
    if (index % 2 === 0) {
      return {
        id: `vq-${v.id}-de`,
        type: 'choice',
        skill: 'vocabulary',
        kind: 'vocabulary',
        vocabId: v.id,
        unit: v.unit,
        strict: true,
        prompt: fmt(dictionaries[lang].qMeaning, { w: displayWord(v) }),
        options: shuffle([g(v), ...distractors.map(g)], rnd),
        answer: g(v),
        why,
        audio: displayWord(v),
      }
    }
    return {
      id: `vq-${v.id}-${lang}`,
      type: 'choice',
      skill: 'vocabulary',
      kind: 'vocabulary',
      vocabId: v.id,
      unit: v.unit,
      strict: true,
      prompt: fmt(dictionaries[lang].qGerman, { w: g(v) }),
      options: shuffle([displayWord(v), ...distractors.map(displayWord)], rnd),
      answer: displayWord(v),
      why,
    }
  }
  if (index % 2 === 0) {
    return {
      id: `vq-${v.id}-de`,
      type: 'choice',
      skill: 'vocabulary',
      kind: 'vocabulary',
      vocabId: v.id,
      unit: v.unit,
      prompt: `Что значит «${displayWord(v)}»?`,
      options: shuffle([v.ru, ...distractors.map(d => d.ru)], rnd),
      answer: v.ru,
      why: { ru: `${displayWord(v)} = ${v.ru}. Пример: ${v.example}` },
      audio: displayWord(v),
    }
  }
  return {
    id: `vq-${v.id}-ru`,
    type: 'choice',
    skill: 'vocabulary',
    kind: 'vocabulary',
    vocabId: v.id,
    unit: v.unit,
    prompt: `Как по-немецки: «${v.ru}»?`,
    options: shuffle([displayWord(v), ...distractors.map(displayWord)], rnd),
    answer: displayWord(v),
    why: { ru: `${v.ru} = ${displayWord(v)}. Пример: ${v.example}` },
  }
}

/**
 * Questions of a listening exercise. The ORDER of each question's options is randomised per attempt (D-4, see answerOrder.ts):
 * pass the attempt's seed to get a stable order for that attempt; omitting it starts a fresh attempt. Texts, answers and explanations
 * are exactly those of the authored exercise, and the source arrays are never modified.
 */
export function listeningQuestions(ex: ListeningExercise, attemptSeed: string = newSeed()): Question[] {
  const a2 = levelOfUnit(ex.unit) !== 'A1' // authored A2 dialogue: explanation in BOTH languages, shown strictly in the learner's own
  return ex.questions.map((q, i) => {
    const id = `lq-${ex.id}-${i}`
    return {
      id,
      type: 'choice',
      skill: 'listening',
      kind: 'listening',
      unit: ex.unit,
      prompt: q.q,
      options: attemptOptions(q.options, attemptSeed, id),
      answer: q.options[q.answer],
      audio: ex.lines.map(l => l.text).join(' '),
      ...(a2
        ? {
            strict: true,
            why: { ru: fmt(dictionaries.ru.qListenWhy, { t: ex.title }), ky: fmt(dictionaries.ky.qListenWhy, { t: ex.title }) },
          }
        : { why: { ru: `Ключевая информация звучит в диалоге «${ex.title}». Прочитайте текст и сравните.` } }),
    }
  })
}

/** Questions of a reading text (previously built inline by the reading view), with the same per-attempt option order as listening. */
export function readingQuestions(text: ReadingText, attemptSeed: string = newSeed()): Question[] {
  return text.questions.map((q, i) => {
    const id = `rq-${text.id}-${i}`
    return {
      id,
      type: 'choice',
      skill: 'reading',
      kind: 'grammar',
      prompt: q.q,
      options: attemptOptions(q.options, attemptSeed, id),
      answer: q.options[q.answer],
      // the explanation of a reading question is the German passage itself: identical in both languages, so an A2 question can be strict
      ...(levelOfUnit(text.unit) !== 'A1'
        ? { strict: true, why: { ru: text.body.join(' '), ky: text.body.join(' ') } }
        : { why: { ru: text.body.join(' ') } }),
    }
  })
}

// ---------- level-scoped pools ----------
// Every pool below belongs to ONE level. An empty pool yields an explicit empty result (or null) — never another level's content.
const handwrittenOf = (level: LanguageLevel) => exercisesOf(level).filter(e => e.type !== 'article')
const articlesOf = (level: LanguageLevel) => exercisesOf(level).filter(e => e.type === 'article')
const levelOfConcept = (concept: string): LanguageLevel | undefined => {
  const c = grammarIndex.get(concept)
  return c ? levelOfUnit(c.unit) : undefined
}

export function unitReviewQuestions(unit: number, size = 10, lang?: Lang): Question[] {
  const rnd = Math.random
  const words = pick(vocabularyForUnit(unit), Math.ceil(size / 2), rnd).map((v, i) => vocabQuestion(v, i, rnd, lang))
  const pool = exercisesForUnit(unit)
  const arts = pick(
    pool.filter(e => e.type === 'article'),
    2,
    rnd,
  ).map(fromExercise)
  const grammar = pick(
    pool.filter(e => e.type !== 'article'),
    size - words.length - arts.length,
    rnd,
  ).map(fromExercise)
  return shuffle([...words, ...arts, ...grammar], rnd)
}

/** Practice questions for a grammar concept, drawn from the level that owns the concept ([] for an unknown concept). */
export function conceptQuestions(concept: string, size = 5): Question[] {
  const level = levelOfConcept(concept)
  if (!level) return []
  const pool = handwrittenOf(level)
  const direct = pool.filter(e => e.concept === concept)
  const extra = direct.length < size ? pool.filter(e => e.concept !== concept) : []
  return pick([...direct], size, Math.random)
    .concat(pick(extra, Math.max(0, size - direct.length), Math.random))
    .map(fromExercise)
}

/** Article drill over the level's nouns; the level is explicit (default = A1, the pre-A2 meaning). */
export function articleDrill(size = 10, ids?: string[], level: LanguageLevel = DEFAULT_LEVEL): Question[] {
  const all = articlesOf(level)
  const pool = ids ? all.filter(e => ids.includes(e.id.replace('art-', ''))) : all
  return pick(pool, size, Math.random).map(fromExercise)
}

/** Can this test be built from its own level's content? (false = nothing to ask; the runner must not offer it.) */
export function isTestAvailable(def: TestDef): boolean {
  const level = def.level
  switch (def.kind) {
    case 'topic':
      return (
        def.unit !== undefined &&
        levelOfUnit(def.unit) === level &&
        vocabularyForUnit(def.unit).length + exercisesForUnit(def.unit).length > 0
      )
    case 'vocabulary':
      return vocabularyOf(level).length > 0
    case 'listening':
      return listeningOf(level).length > 0
    default: // grammar, placement, level (and the unused 'speaking')
      return handwrittenOf(level).length > 0
  }
}

export function buildTest(def: TestDef, lang?: Lang): Question[] {
  if (!isTestAvailable(def)) return []
  const rnd = Math.random
  const level = def.level
  const hand = handwrittenOf(level)
  const vq = (n: number) => pick(vocabularyOf(level), n, rnd).map((v, i) => vocabQuestion(v, i, rnd, lang))
  switch (def.kind) {
    case 'topic': {
      // a unit with an authored final test (A2) is tested with THOSE questions; a unit without one (A1) keeps the random review quiz
      const authored = finalTestOfUnit(def.unit as number)
      return authored
        ? finalTestQuestions(def.unit as number, authored.questions, newSeed(rnd))
        : unitReviewQuestions(def.unit as number, def.size, lang)
    }
    case 'grammar':
      return pick(hand, def.size, rnd).map(fromExercise)
    case 'vocabulary':
      return shuffle([...vq(def.size - 4), ...articleDrill(4, undefined, level)], rnd)
    case 'listening': {
      // one seed per built test = one attempt; drawn AFTER the exercises were picked, so the picks are exactly as before
      const picked = pick(listeningOf(level), def.size, rnd)
      const attemptSeed = newSeed(rnd)
      return picked.flatMap(ex => listeningQuestions(ex, attemptSeed)).slice(0, def.size)
    }
    case 'placement': {
      // bands are relative to the level's first unit, so the same shape works for any level (A1: units 1–4 / 5–7 / 8–10)
      const first = courseLevel(level)?.unitIdRange[0] ?? 1
      const rel = (e: Exercise) => e.unit - first + 1
      const easy = pick(
        hand.filter(e => rel(e) <= 4),
        4,
        rnd,
      ).map(fromExercise)
      const mid = pick(
        hand.filter(e => rel(e) > 4 && rel(e) <= 7),
        4,
        rnd,
      ).map(fromExercise)
      const hard = pick(
        hand.filter(e => rel(e) > 7),
        4,
        rnd,
      ).map(fromExercise)
      return [...easy, ...mid, ...hard]
    }
    default:
      return shuffle(
        [
          ...pick(hand, Math.ceil(def.size * 0.5), rnd).map(fromExercise),
          ...vq(Math.floor(def.size * 0.35)),
          ...articleDrill(Math.max(1, def.size - Math.ceil(def.size * 0.5) - Math.floor(def.size * 0.35)), undefined, level),
        ],
        rnd,
      ).slice(0, def.size)
  }
}

/** Placement recommendation from the raw score. Unchanged A1 behaviour; extracted so level-awareness has one place to live. */
export type PlacementBand = 'A1-start' | 'A1-A2' | 'A2'
export const placementBand = (pct: number): PlacementBand => (pct < 35 ? 'A1-start' : pct < 75 ? 'A1-A2' : 'A2')

// ---------- daily challenge ----------
export interface Daily {
  vocab: Question[]
  grammar: Question[]
  listening: Question[]
  speaking: { prompt: L10n; sample: string; keywords: string[]; conceptId: string }
  /** `strict` (non-A1): `ru` and `ky` are both authored and only the learner's own is shown; A1: the legacy Russian line */
  phrase: { de: string; ru: string; ky?: string; strict?: boolean }
}

type SpeakSample = { prompt: L10n; sample: string; keywords: string[] }

/**
 * Speaking prompts of the A1 daily challenge. Kept verbatim (and with the same random-draw order) so A1 output is identical to before.
 * Levels without an entry here take their speaking prompt from the level's own grammar concepts (`speakPrompt`).
 */
const LEGACY_DAILY_SPEAKING: Partial<Record<LanguageLevel, { concepts: string[]; samples: Record<string, SpeakSample> }>> = {
  A1: {
    concepts: ['verb-position', 'modal', 'akkusativ', 'dativ-prep', 'time-order', 'questions', 'conjunctions'],
    samples: {
      'verb-position': {
        prompt: { ru: 'Скажите, что вы делаете сегодня. Начните со слова «Heute».' },
        sample: 'Heute lerne ich Deutsch.',
        keywords: ['heute', 'lerne'],
      },
      modal: {
        prompt: { ru: 'Вежливо закажите напиток: «Ich möchte …»' },
        sample: 'Ich möchte einen Tee bestellen.',
        keywords: ['möchte'],
      },
      akkusativ: {
        prompt: { ru: 'Скажите, что вы покупаете или берёте.' },
        sample: 'Ich nehme den Salat und einen Tee.',
        keywords: ['nehme', 'den'],
      },
      'dativ-prep': {
        prompt: { ru: 'Скажите, как вы добираетесь на работу.' },
        sample: 'Ich fahre mit dem Bus zur Arbeit.',
        keywords: ['mit dem', 'zur'],
      },
      'time-order': {
        prompt: { ru: 'Назовите день и время встречи.' },
        sample: 'Ich habe am Montag um neun Uhr einen Termin.',
        keywords: ['am', 'um'],
      },
      questions: {
        prompt: { ru: 'Задайте два вопроса новому знакомому.' },
        sample: 'Woher kommst du? Wo wohnst du?',
        keywords: ['woher', 'wo'],
      },
      conjunctions: {
        prompt: { ru: 'Объясните, почему вы учите немецкий (weil …).' },
        sample: 'Ich lerne Deutsch, weil ich hier arbeite.',
        keywords: ['weil'],
      },
    },
  },
}

const dailySpeakingSource = (level: LanguageLevel): { ids: string[]; sample: (id: string) => SpeakSample } | null => {
  const legacy = LEGACY_DAILY_SPEAKING[level]
  if (legacy) return { ids: legacy.concepts, sample: id => legacy.samples[id] }
  const concepts = grammarOf(level).filter(c => c.speakPrompt)
  return concepts.length
    ? { ids: concepts.map(c => c.id), sample: id => (concepts.find(c => c.id === id) as { speakPrompt: SpeakSample }).speakPrompt }
    : null
}

/** Does the level have everything a daily challenge needs? (false = no challenge for that level; nothing else is substituted) */
export const isDailyAvailable = (level: LanguageLevel): boolean =>
  vocabularyOf(level).length >= 3 &&
  handwrittenOf(level).length >= 1 &&
  listeningOf(level).length >= 1 &&
  dailySpeakingSource(level) !== null

/**
 * Daily challenge of ONE level, deterministic per date. Returns null when the level cannot supply it (planned/empty level):
 * it never borrows A1 (or any other level's) content. For A1 the output is identical to the pre-A2 `buildDaily`.
 */
export function buildLevelDaily(date: string, level: LanguageLevel, lang?: Lang): Daily | null {
  const speaking = dailySpeakingSource(level)
  if (!speaking || !isDailyAvailable(level)) return null
  const rnd = seeded(`daily-${date}`)
  const vocab = pick(vocabularyOf(level), 3, rnd).map((v, i) => vocabQuestion(v, i, rnd, lang))
  const grammar = pick(handwrittenOf(level), 1, rnd).map(fromExercise)
  const lex = pick(listeningOf(level), 1, rnd)[0]
  // the daily challenge is the same for everyone on a date: its answer order is a function of the date (stable, no random draw)
  const listening = listeningQuestions(lex, `daily-${date}`).slice(0, 1)
  const conceptId = speaking.ids[Math.floor(rnd() * speaking.ids.length)]
  // the phrase of the day: A1 keeps its legacy real-life phrases (same draws as before); another level takes a sentence of its OWN grammar (German + ru + ky)
  const own =
    level === DEFAULT_LEVEL
      ? []
      : grammarOf(level)
          .flatMap(c => [...c.reallife, ...c.examples])
          .filter(e => e.de && e.ru && e.ky)
  if (own.length > 0) {
    const e = own[Math.floor(rnd() * own.length)]
    return {
      vocab,
      grammar,
      listening,
      speaking: { ...speaking.sample(conceptId), conceptId },
      phrase: { de: e.de, ru: e.ru, ky: e.ky, strict: true },
    }
  }
  const topic = REAL_LIFE[Math.floor(rnd() * REAL_LIFE.length)]
  const phrase = topic.phrases[Math.floor(rnd() * topic.phrases.length)]
  return { vocab, grammar, listening, speaking: { ...speaking.sample(conceptId), conceptId }, phrase }
}

/** The A1 daily challenge (legacy contract, always available). Application code uses `buildLevelDaily(date, activeLevel)`. */
export function buildDaily(date = dayKey()): Daily {
  const daily = buildLevelDaily(date, DEFAULT_LEVEL)
  if (!daily) throw new Error(`the ${DEFAULT_LEVEL} daily challenge must always be available`)
  return daily
}
