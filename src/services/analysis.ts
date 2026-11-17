import { findErrors, type FoundError } from '../data/errorPatterns'
import type { SpeakingTurn, WritingTask } from '../data/types'
import { allVocabulary } from '../data/catalog'
import { clamp, normalize, words } from '../utils/text'

/**
 * Heuristic analysers. They stand in for a real language-model backend:
 * keep the signatures when swapping in an API call (see services/tutor.ts).
 */

export interface SpeakingScore {
  pronunciation: number | null // null = could not be measured (typed answer)
  grammar: number
  vocabulary: number
  fluency: number
  naturalness: number
  corrections: { wrong: string; right: string; why: string }[]
  tip: string
}

const jaccard = (a: string[], b: string[]) => {
  const A = new Set(a)
  const B = new Set(b)
  const inter = [...A].filter(x => B.has(x)).length
  return inter / (A.size + B.size - inter || 1)
}

export function analyseSpeaking(input: string, turn: SpeakingTurn, confidence: number | null): SpeakingScore {
  const toks = words(input)
  const norm = normalize(input)
  const errors = findErrors(input)
  const kwHit = turn.keywords.filter(k => norm.includes(k)).length
  const vocab = clamp(55 + (kwHit / Math.max(1, Math.min(3, turn.keywords.length))) * 40)
  const grammar = clamp(96 - errors.length * 14 - (toks.length < 2 ? 15 : 0))
  const expected = Math.max(...turn.hints.map(h => words(h).length))
  const fluency = clamp(60 + Math.min(1, toks.length / Math.max(3, expected)) * 36)
  const natural = clamp(50 + Math.max(...turn.hints.map(h => jaccard(toks, words(h)))) * 50 + (kwHit ? 6 : 0))
  const pronunciation = confidence == null ? null : clamp(Math.round(confidence * 100))
  const corrections = errors.slice(0, 2).map(e => ({ wrong: e.wrong, right: e.right, why: e.why.ru }))
  if (corrections.length === 0 && natural < 80) {
    corrections.push({ wrong: input, right: turn.hints[0], why: 'Так сказали бы чаще всего. Сравните порядок слов и выбор слов.' })
  }
  const tip = kwHit === 0 ? `Попробуйте использовать ключевые слова: ${turn.keywords.slice(0, 3).join(', ')}.` : 'Хороший ответ — продолжаем разговор!'
  return { pronunciation, grammar: Math.round(grammar), vocabulary: Math.round(vocab), fluency: Math.round(fluency), naturalness: Math.round(natural), corrections, tip }
}

// ---------- writing ----------
export interface WritingFeedback {
  scores: { grammar: number; vocabulary: number; wordorder: number; spelling: number; style: number; formality: number }
  missing: string[]
  met: string[]
  errors: FoundError[]
  spelling: { word: string; fix: string }[]
  wordCount: number
  lengthOk: boolean
  formalityNote: string
  checks: { ok: boolean; text: string }[]
}

const AMBIGUOUS = new Set(['morgen', 'bar', 'essen'])
// Built from the vocabulary of every LOADED level and rebuilt when a lazy level's words arrive (allVocabulary grows in place).
let nounMapSize = -1
let nounMapCache = new Map<string, string>()
const nounMapOf = () => {
  if (nounMapSize !== allVocabulary.length) {
    nounMapSize = allVocabulary.length
    nounMapCache = new Map(allVocabulary.filter(v => v.pos === 'noun' && !AMBIGUOUS.has(v.de.toLowerCase())).map(n => [n.de.toLowerCase(), n.de]))
  }
  return nounMapCache
}

export function analyseWriting(text: string, task: WritingTask): WritingFeedback {
  const lower = text.toLowerCase()
  const toks = text.split(/\s+/).filter(Boolean)
  const wordCount = toks.length
  const errors = findErrors(text)

  const met: string[] = []
  const missing: string[] = []
  for (const m of task.mustInclude) (m.patterns.some(p => lower.includes(p)) ? met : missing).push(m.label)

  const spelling: { word: string; fix: string }[] = []
  for (const raw of toks) {
    const w = raw.replace(/[.,!?;:()"„“]/g, '')
    const fix = nounMapOf().get(w.toLowerCase())
    if (fix && w[0] === w[0].toLowerCase() && !spelling.some(s => s.word === w)) spelling.push({ word: w, fix })
  }
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim())
  if (sentences.some(s => /^[a-zäöüß]/.test(s.trim()))) {
    spelling.push({ word: 'начало предложения', fix: 'Каждое предложение начинается с заглавной буквы' })
  }

  const hasDu = /\b(du|dir|dich|dein|deine)\b/.test(lower)
  let formality = 90
  let formalityNote = task.formal ? 'Тон выбран верно: официальное обращение и «Sie».' : 'Тон выбран верно: дружеский, на «du».'
  if (task.formal && hasDu) {
    formality = 45
    formalityNote = 'Это официальное письмо — пишите на «Sie» (Ihnen, Ihr), а не на «du».'
  } else if (!task.formal && /sehr geehrte/.test(lower)) {
    formality = 60
    formalityNote = 'Это неформальное сообщение — «Sehr geehrte …» звучит слишком официально.'
  }

  const lengthOk = wordCount >= task.minWords
  const total = task.mustInclude.length || 1
  const scores = {
    grammar: clamp(96 - errors.filter(e => e.category === 'grammar').length * 14),
    wordorder: clamp(96 - errors.filter(e => e.category === 'wordorder').length * 18),
    vocabulary: clamp(45 + (met.length / total) * 45 + (lengthOk ? 8 : 0)),
    spelling: clamp(98 - spelling.length * 8),
    style: clamp(60 + (met.length / total) * 25 + (lengthOk ? 12 : 0)),
    formality,
  }
  const checks = [
    { ok: lengthOk, text: lengthOk ? `Объём достаточный (${wordCount} слов).` : `Слишком коротко: ${wordCount} из ${task.minWords} слов.` },
    ...task.mustInclude.map(m => ({ ok: met.includes(m.label), text: m.label })),
  ]
  return { scores, missing, met, errors, spelling, wordCount, lengthOk, formalityNote, checks }
}
