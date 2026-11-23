import type { ContentSource, Exercise, GrammarCategory, GrammarConcept, GrammarVisual } from '../../types'

/**
 * B1 curriculum v2 — authoring helper for the 36 grammar lessons (one per new unit 301–336). It only turns compact, hand-written lesson data into the existing
 * `GrammarConcept` and `Exercise` shapes; the lessons render through the existing topic / quiz screens. Nothing here is generated content: every sentence,
 * rule and answer is written by hand in the lesson files next to it.
 */
export type Pair = readonly [ru: string, ky: string]
/** fill: German sentence with ___, then Russian and Kyrgyz meaning, answer, two wrong options, explanation */
export type FillTask = readonly ['f', prompt: string, ru: string, ky: string, answer: string, wrong: readonly [string, string], why: Pair]
/** choice: question, Russian and Kyrgyz question, answer, two wrong options, explanation */
export type ChoiceTask = readonly ['c', prompt: string, ru: string, ky: string, answer: string, wrong: readonly [string, string], why: Pair]
/** order: the correct German sentence, Russian and Kyrgyz meaning, explanation (the words are the sentence, reversed) */
export type OrderTask = readonly ['o', sentence: string, ru: string, ky: string, why: Pair]
export type Task = FillTask | ChoiceTask | OrderTask

export interface LessonSpec {
  /** position of the unit in the B1 list, 1–36 (unit id = 300 + n) */
  n: number
  slug: string
  cat: GrammarCategory
  visual: GrammarVisual
  /** the approved German grammar topic */
  topic: string
  title: Pair
  summary: Pair
  discover: Pair
  why: Pair
  when: readonly Pair[]
  ex: readonly (readonly [de: string, ru: string, ky: string, focus: string])[]
  err: readonly (readonly [wrong: string, right: string, ru: string, ky: string])[]
  real: readonly (readonly [de: string, ru: string, ky: string])[]
  dlg: readonly (readonly [speaker: string, de: string, ru: string, ky: string])[]
  say: { p: Pair; s: string; k: readonly string[] }
  tasks: readonly Task[]
}

export const B1_V2_SOURCE: ContentSource = {
  kind: 'authored',
  author:
    'BilUp Til B1 curriculum v2 (grammar): original text drafted with AI assistance (Claude); Russian and Kyrgyz written independently; pending independent CEFR, Russian and Kyrgyz (native-speaker) review',
}

const l = (p: Pair, topic?: string) => ({ ru: p[0], ky: p[1], ...(topic ? { de: topic } : {}) })

export function lesson(s: LessonSpec): { concept: GrammarConcept; exercises: Exercise[] } {
  const unit = 300 + s.n
  const id = `b1-${s.slug}`
  const concept: GrammarConcept = {
    id,
    category: s.cat,
    level: 'B1',
    unit,
    title: { ...l(s.title), de: s.topic },
    summary: l(s.summary),
    discover: l(s.discover),
    why: l(s.why),
    when: s.when.map(p => l(p)),
    examples: s.ex.map(([de, ru, ky, focus]) => ({ de, ru, ky, focus })),
    mistakes: s.err.map(([wrong, right, ru, ky]) => ({ wrong, right, note: { ru, ky } })),
    reallife: s.real.map(([de, ru, ky]) => ({ de, ru, ky })),
    visual: s.visual,
    dialogue: s.dlg.map(([speaker, text, ru, ky]) => ({ speaker, text, ru, ky })),
    speakPrompt: { prompt: l(s.say.p), sample: s.say.s, keywords: [...s.say.k] },
    source: B1_V2_SOURCE,
  }
  const exercises: Exercise[] = s.tasks.map((t, i) => {
    const eid = `b1-ex-${unit}-${String(i + 1).padStart(2, '0')}`
    if (t[0] === 'o') {
      const [, sentence, ru, ky, why] = t
      return { id: eid, type: 'order', unit, concept: id, prompt: 'Bilde den Satz.', promptRu: ru, promptKy: ky, words: sentence.split(' ').reverse(), answer: sentence, why: l(why) }
    }
    const [kind, prompt, ru, ky, answer, wrong, why] = t
    // the quiz shows the options in the authored order, so the correct one is rotated through the three positions
    const opts = [answer, wrong[0], wrong[1]]
    const shift = i % 3
    const options = [...opts.slice(shift), ...opts.slice(0, shift)]
    return { id: eid, type: kind === 'f' ? 'fill' : 'choice', unit, concept: id, prompt, promptRu: ru, promptKy: ky, options, answer, why: l(why) }
  })
  return { concept, exercises }
}

/**
 * ENRICHED lesson: the educational text of an existing legacy B1 lesson (explanation, rules, examples, mistakes, dialogue, exercises — Russian AND Kyrgyz, as
 * authored) is the BASIS of the new unit's lesson, and is enriched with the extra examples and exercises written next to it, so that the new lesson reaches 8 examples
 * and 8 practice questions. The legacy lesson itself is never modified: this builds a separate record (new id, new unit, new exercise ids). References to the legacy
 * unit numbers inside the old texts ("в юните 22", "(22-бөлүм)") are removed because they do not apply to the new unit.
 */
export interface DeriveSpec {
  n: number
  slug: string
  topic: string
  title: Pair
  /** extra examples appended to the legacy ones */
  ex: readonly (readonly [de: string, ru: string, ky: string, focus: string])[]
  /** extra rules appended to the legacy ones */
  when?: readonly Pair[]
  /** extra mistakes appended */
  err?: readonly (readonly [wrong: string, right: string, ru: string, ky: string])[]
  /** extra practice questions appended after the legacy ones */
  tasks: readonly Task[]
}

const CLEAN_RU: [RegExp, string][] = [
  [/ ?\((?:юнит|юниты) \d+(?: и \d+)?\)/g, ''],
  [/В юните \d+ вы [^.]*\.\s*/g, ''],
  [/ ?— это тема юнитов \d+ и \d+/g, ' — это отдельная тема'],
  [/В этом юните вы учите/g, 'Здесь вы учите'],
  [/вы увидите в юните \d+/g, 'вы увидите позже'],
  [/Только для понимания и для будущих юнитов:/g, 'Только для понимания:'],
  [/Сравните с юнитом \d+: /g, 'Сравните: '],
  [/ ?Прилагательные без артикля — юнит \d+, здесь их нет\./g, ' Прилагательные без артикля здесь не рассматриваются.'],
  [/ ?\(Unit \d+[^)]*\)/g, ''],
  [/появятся в юните \d+/g, 'рассматриваются в следующих уроках'],
  [/ Эти правила вы уже использовали с \d+-го юнита; здесь они собраны как система\./g, ' Здесь эти правила собраны как система.'],
  [/В этом юните /g, 'Здесь '],
]
const CLEAN_KY: [RegExp, string][] = [
  [/ ?\(\d+(?:-| жана )?\d*-?бөлүм(?:дөр)?\)/g, ''],
  [/\d+-бөлүмдө сиз [^.]*\.\s*/g, ''],
  [/ ?— бул \d+ жана \d+-бөлүмдөрдүн темасы/g, ' — бул өзүнчө тема'],
  [/Бул бөлүмдө жабык тизмени үйрөнөсүз/g, 'Бул жерде жабык тизмени үйрөнөсүз'],
  [/\d+-бөлүмдө келет/g, 'кийин келет'],
  [/ Бул эрежелерди сиз \d+-бөлүмдөн бери колдонуп келатасыз; бул жерде алар система катары чогултулду\./g, ' Бул жерде бул эрежелер система катары чогултулду.'],
  [/Түшүнүү үчүн жана кийинки бөлүмдөр үчүн:/g, 'Түшүнүү үчүн гана:'],
  [/\d+-бөлүм менен салыштырыңыз: /g, 'Салыштырыңыз: '],
  [/ ?Артиклсиз сын атоочтор — \d+-бөлүм, бул жерде алар жок\./g, ' Артиклсиз сын атоочтор бул жерде каралбайт.'],
  [/ ?\(Unit \d+[^)]*\)/g, ''],
  [/Бул бөлүмдө /g, 'Бул жерде '],
]
const scrub = (s: string | undefined, rules: [RegExp, string][]) => (s === undefined ? s : rules.reduce((t, [re, to]) => t.replace(re, to), s))
const scrubL = (x: { ru: string; ky?: string; de?: string }) => ({ ...x, ru: scrub(x.ru, CLEAN_RU) as string, ky: scrub(x.ky, CLEAN_KY) })

export function enrich(
  legacy: { concept: GrammarConcept; exercises: readonly Exercise[] },
  s: DeriveSpec,
): { concept: GrammarConcept; exercises: Exercise[] } {
  const unit = 300 + s.n
  const id = `b1-${s.slug}`
  const c = legacy.concept
  const concept: GrammarConcept = {
    ...c,
    id,
    unit,
    title: { ...l(s.title), de: s.topic },
    summary: scrubL(c.summary),
    discover: scrubL(c.discover),
    why: scrubL(c.why),
    when: [...c.when.map(scrubL), ...(s.when ?? []).map(p => l(p))],
    examples: [...c.examples, ...s.ex.map(([de, ru, ky, focus]) => ({ de, ru, ky, focus }))],
    mistakes: [
      ...c.mistakes.map(m => ({ ...m, note: scrubL(m.note) })),
      ...(s.err ?? []).map(([wrong, right, ru, ky]) => ({ wrong, right, note: { ru, ky } })),
    ],
    source: {
      kind: 'authored',
      author: `${B1_V2_SOURCE.author}; based on the legacy B1 lesson "${c.id}" (kept unchanged) and enriched with additional examples and exercises`,
    },
  }
  const own: Exercise[] = legacy.exercises
    .filter(e => e.concept === c.id)
    .map((e, i) => ({ ...e, id: `b1-ex-${unit}-${String(i + 1).padStart(2, '0')}`, unit, concept: id, why: scrubL(e.why) }))
  const extra = lesson({
    n: s.n, slug: s.slug, cat: c.category, visual: c.visual, topic: s.topic, title: s.title,
    summary: ['', ''], discover: ['', ''], why: ['', ''], when: [], ex: [], err: [], real: [], dlg: [], say: { p: ['', ''], s: '', k: [] }, tasks: s.tasks,
  }).exercises.map((e, i) => ({ ...e, id: `b1-ex-${unit}-${String(own.length + i + 1).padStart(2, '0')}` }))
  return { concept, exercises: [...own, ...extra] }
}
