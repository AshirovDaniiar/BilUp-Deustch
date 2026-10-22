import { EXERCISES, articleExercises } from '../../data/exercises'
import { LISTENING } from '../../data/listening'
import { REAL_LIFE } from '../../data/reallife'
import type { Exercise, L10n, ListeningExercise, Mistake, TestDef, VocabularyItem } from '../../data/types'
import { VOCABULARY, displayWord, vocabForUnit } from '../../data/vocabulary'
import { pick, seeded, shuffle } from '../../utils/random'
import { dayKey } from '../../utils/date'

/** UI-level question that every quiz surface (practice, tests, daily) renders the same way. */
export interface Question {
  id: string
  type: 'choice' | 'fill' | 'order' | 'article'
  prompt: string
  promptRu?: string
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
  skill: 'grammar',
  kind: e.type === 'article' ? 'article' : 'grammar',
  unit: e.unit,
  vocabId: e.type === 'article' ? e.id.replace('art-', '') : undefined,
})

/** Meaning question; direction alternates so recall works both ways. */
export function vocabQuestion(v: VocabularyItem, index: number, rnd: () => number = Math.random): Question {
  const pool = VOCABULARY.filter(x => x.id !== v.id && x.pos === v.pos && x.unit !== undefined)
  const distractors = pick(pool, 3, rnd)
  if (index % 2 === 0) {
    return {
      id: `vq-${v.id}-de`, type: 'choice', skill: 'vocabulary', kind: 'vocabulary', vocabId: v.id, unit: v.unit,
      prompt: `Что значит «${displayWord(v)}»?`,
      options: shuffle([v.ru, ...distractors.map(d => d.ru)], rnd), answer: v.ru,
      why: { ru: `${displayWord(v)} = ${v.ru}. Пример: ${v.example}` }, audio: displayWord(v),
    }
  }
  return {
    id: `vq-${v.id}-ru`, type: 'choice', skill: 'vocabulary', kind: 'vocabulary', vocabId: v.id, unit: v.unit,
    prompt: `Как по-немецки: «${v.ru}»?`,
    options: shuffle([displayWord(v), ...distractors.map(displayWord)], rnd), answer: displayWord(v),
    why: { ru: `${v.ru} = ${displayWord(v)}. Пример: ${v.example}` },
  }
}

export function listeningQuestions(ex: ListeningExercise): Question[] {
  return ex.questions.map((q, i) => ({
    id: `lq-${ex.id}-${i}`, type: 'choice', skill: 'listening', kind: 'listening', unit: ex.unit,
    prompt: q.q, options: q.options, answer: q.options[q.answer], audio: ex.lines.map(l => l.text).join(' '),
    why: { ru: `Ключевая информация звучит в диалоге «${ex.title}». Прочитайте текст и сравните.` },
  }))
}

const handwritten = EXERCISES.filter(e => e.type !== 'article')

export function unitReviewQuestions(unit: number, size = 10): Question[] {
  const rnd = Math.random
  const words = pick(vocabForUnit(unit), Math.ceil(size / 2), rnd).map((v, i) => vocabQuestion(v, i, rnd))
  const arts = pick(articleExercises.filter(e => e.unit === unit), 2, rnd).map(fromExercise)
  const grammar = pick(handwritten.filter(e => e.unit === unit), size - words.length - arts.length, rnd).map(fromExercise)
  return shuffle([...words, ...arts, ...grammar], rnd)
}

export function conceptQuestions(concept: string, size = 5): Question[] {
  const direct = handwritten.filter(e => e.concept === concept)
  const extra = direct.length < size ? handwritten.filter(e => e.concept !== concept) : []
  return pick([...direct], size, Math.random).concat(pick(extra, Math.max(0, size - direct.length), Math.random)).map(fromExercise)
}

export function articleDrill(size = 10, ids?: string[]): Question[] {
  const pool = ids ? articleExercises.filter(e => ids.includes(e.id.replace('art-', ''))) : articleExercises
  return pick(pool, size, Math.random).map(fromExercise)
}

export function buildTest(def: TestDef): Question[] {
  const rnd = Math.random
  const vq = (n: number, units?: number[]) =>
    pick(units ? VOCABULARY.filter(v => units.includes(v.unit)) : VOCABULARY, n, rnd).map((v, i) => vocabQuestion(v, i, rnd))
  switch (def.kind) {
    case 'topic':
      return def.unit ? unitReviewQuestions(def.unit, def.size) : []
    case 'grammar':
      return pick(handwritten, def.size, rnd).map(fromExercise)
    case 'vocabulary':
      return shuffle([...vq(def.size - 4), ...articleDrill(4)], rnd)
    case 'listening':
      return pick(LISTENING, def.size, rnd).flatMap(listeningQuestions).slice(0, def.size)
    case 'placement': {
      const easy = pick(handwritten.filter(e => e.unit <= 4), 4, rnd).map(fromExercise)
      const mid = pick(handwritten.filter(e => e.unit > 4 && e.unit <= 7), 4, rnd).map(fromExercise)
      const hard = pick(handwritten.filter(e => e.unit > 7), 4, rnd).map(fromExercise)
      return [...easy, ...mid, ...hard]
    }
    default:
      return shuffle([...pick(handwritten, Math.ceil(def.size * 0.5), rnd).map(fromExercise), ...vq(Math.floor(def.size * 0.35)), ...articleDrill(Math.max(1, def.size - Math.ceil(def.size * 0.5) - Math.floor(def.size * 0.35)))], rnd).slice(0, def.size)
  }
}

// ---------- daily challenge ----------
export interface Daily {
  vocab: Question[]
  grammar: Question[]
  listening: Question[]
  speaking: { prompt: L10n; sample: string; keywords: string[]; conceptId: string }
  phrase: { de: string; ru: string }
}

export function buildDaily(date = dayKey()): Daily {
  const rnd = seeded(`daily-${date}`)
  const vocab = pick(VOCABULARY, 3, rnd).map((v, i) => vocabQuestion(v, i, rnd))
  const grammar = pick(handwritten, 1, rnd).map(fromExercise)
  const lex = pick(LISTENING, 1, rnd)[0]
  const listening = listeningQuestions(lex).slice(0, 1)
  const concepts = ['verb-position', 'modal', 'akkusativ', 'dativ-prep', 'time-order', 'questions', 'conjunctions']
  const conceptId = concepts[Math.floor(rnd() * concepts.length)]
  const speakSamples: Record<string, { prompt: L10n; sample: string; keywords: string[] }> = {
    'verb-position': { prompt: { ru: 'Скажите, что вы делаете сегодня. Начните со слова «Heute».' }, sample: 'Heute lerne ich Deutsch.', keywords: ['heute', 'lerne'] },
    modal: { prompt: { ru: 'Вежливо закажите напиток: «Ich möchte …»' }, sample: 'Ich möchte einen Tee bestellen.', keywords: ['möchte'] },
    akkusativ: { prompt: { ru: 'Скажите, что вы покупаете или берёте.' }, sample: 'Ich nehme den Salat und einen Tee.', keywords: ['nehme', 'den'] },
    'dativ-prep': { prompt: { ru: 'Скажите, как вы добираетесь на работу.' }, sample: 'Ich fahre mit dem Bus zur Arbeit.', keywords: ['mit dem', 'zur'] },
    'time-order': { prompt: { ru: 'Назовите день и время встречи.' }, sample: 'Ich habe am Montag um neun Uhr einen Termin.', keywords: ['am', 'um'] },
    questions: { prompt: { ru: 'Задайте два вопроса новому знакомому.' }, sample: 'Woher kommst du? Wo wohnst du?', keywords: ['woher', 'wo'] },
    conjunctions: { prompt: { ru: 'Объясните, почему вы учите немецкий (weil …).' }, sample: 'Ich lerne Deutsch, weil ich hier arbeite.', keywords: ['weil'] },
  }
  const topic = REAL_LIFE[Math.floor(rnd() * REAL_LIFE.length)]
  const phrase = topic.phrases[Math.floor(rnd() * topic.phrases.length)]
  return { vocab, grammar, listening, speaking: { ...speakSamples[conceptId], conceptId }, phrase }
}
