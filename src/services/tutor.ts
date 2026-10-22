import { findErrors } from '../data/errorPatterns'
import { EXERCISES } from '../data/exercises'
import { GRAMMAR, WHY_NOTES } from '../data/grammar'
import type { GrammarConcept, Lang, LanguageLevel } from '../data/types'
import { normalize, tr } from '../utils/text'
import { pick } from '../utils/random'

/**
 * The tutor is behind an interface so a real LLM backend can replace the rule-based mock
 * without touching the UI:  const tutor: TutorService = new ApiTutor(...)
 */
export interface TutorContext { lang: Lang; level: LanguageLevel; lastConceptId?: string }
export interface TutorReply { text: string; conceptId?: string; suggestions?: string[] }
export interface TutorService { reply(question: string, ctx: TutorContext): Promise<TutorReply> }

const KEYWORDS: [RegExp, string][] = [
  [/akkusativ|akk\b|винительн|accus/i, 'akkusativ'],
  [/dativ|дательн/i, 'dativ'],
  [/genitiv|родительн/i, 'genitiv'],
  [/nominativ|именительн/i, 'nominativ'],
  [/artikel|артикл|\bder\b.*\bdie\b|der die das/i, 'articles'],
  [/plural|множественн|көптүк/i, 'plural'],
  [/perfekt|прошедш|vergangenheit/i, 'perfekt'],
  [/weil|потому что|союз/i, 'conjunctions'],
  [/modal|möchte|können|müssen|модальн/i, 'modal'],
  [/trennbar|отделяем|separable|aufstehen/i, 'separable'],
  [/\bkein\b|\bnicht\b|отрицан|negation/i, 'negation'],
  [/wechsel|\bin die\b|\bin der\b|wo\?|wohin/i, 'wechsel'],
  [/\bmit\b|\bzu\b|\bnach\b|предлог.*дат/i, 'dativ-prep'],
  [/\bfür\b|\bohne\b|предлог.*вин/i, 'akk-prep'],
  [/wortstellung|порядок слов|verb.*position|zweiter stelle|второ[мй] мест/i, 'verb-position'],
  [/frage|вопрос/i, 'questions'],
  [/mein\b|dein\b|possessiv|притяжат/i, 'possessive'],
  [/\bsein\b|\bhaben\b/i, 'sein-haben'],
]

const ADVANCED: [RegExp, string][] = [
  [/konjunktiv|konjunktiv ii|würde/i, 'Konjunktiv II (B1): „Ich hätte gern …“ и „Ich würde gern …“ — вежливые формы. Для A1 достаточно выучить готовую формулу «Ich hätte gern …» / «Ich möchte …».'],
  [/passiv|страдательн/i, 'Passiv (B1): „Das Haus wird gebaut.“ — важен результат, а не тот, кто действует. Сейчас сосредоточьтесь на активных предложениях.'],
  [/relativsatz|относительн/i, 'Relativsätze (B1): „Das ist der Mann, der hier wohnt.“ — придаточное, которое описывает существительное. Сначала освойте weil-предложения.'],
]

let pending: { answer: string; why: string } | null = null

const NOTES: Record<string, string> = {
  'wissen-kennen': '**wissen vs. kennen**\n• **wissen** — знать факт: „Ich weiß, dass er Arzt ist.“ (всегда с dass/вопросительным словом)\n• **kennen** — быть знакомым с человеком, местом, вещью: „Ich kenne Anna.“ / „Ich kenne Berlin.“\n\nПодсказка: если можно спросить «что именно?» — wissen; если «кого/что?» — kennen.',
}

const fmtConcept = (c: GrammarConcept, lang: Lang, level: LanguageLevel) => {
  const lines = [`**${tr(c.title, lang)}**`, tr(c.summary, lang), '', tr(c.why, lang)]
  const n = level === 'A1' ? 2 : 3
  lines.push('', 'Примеры:', ...c.examples.slice(0, n).map(e => `• ${e.de} — ${e.ru}`))
  if (c.mistakes[0]) lines.push('', `Частая ошибка: ❌ ${c.mistakes[0].wrong} → ✅ ${c.mistakes[0].right}`)
  return lines.join('\n')
}

const SUGGEST = ['Почему здесь Dativ?', 'Дай пять примеров', 'Проверь меня', 'В чём разница между wissen и kennen?']

export class MockTutor implements TutorService {
  async reply(question: string, ctx: TutorContext): Promise<TutorReply> {
    await new Promise(r => setTimeout(r, 450))
    const q = question.trim()
    const n = normalize(q)

    // answer to a pending quiz question
    if (pending) {
      const p = pending
      pending = null
      if (n === normalize(p.answer) || n.includes(normalize(p.answer))) return { text: `✅ Верно! ${p.why}\n\nХотите ещё вопрос?`, suggestions: ['Проверь меня', 'Дай пять примеров'] }
      return { text: `Почти. Правильный ответ: **${p.answer}**.\n${p.why}`, suggestions: ['Проверь меня'] }
    }

    if (/wissen.*kennen|kennen.*wissen/.test(n)) return { text: NOTES['wissen-kennen'], suggestions: SUGGEST }

    if (/проверь меня|тест|test me|teste mich|quiz/.test(n)) {
      const ex = pick(EXERCISES.filter(e => e.type === 'fill' && e.options), 1)[0]
      pending = { answer: ex.answer, why: ex.why.ru }
      return { text: `Давайте проверим:\n\n**${ex.prompt}**\nВарианты: ${ex.options!.join(' / ')}`, conceptId: ex.concept }
    }

    if (/исправ|korrigier|correct my|проверь предложение|ошибк/.test(n)) {
      const quoted = q.match(/[„"«“](.+?)[“"»”]/)?.[1] ?? q.split(/:\s*/).slice(1).join(': ')
      if (!quoted) return { text: 'Напишите предложение после двоеточия, например:\n«Исправь: Ich habe 25 Jahre.»' }
      const errs = findErrors(quoted)
      if (!errs.length) return { text: `Я не вижу типичных ошибок в «${quoted}». Если есть сомнение — спросите, какое слово смущает.` }
      const e = errs[0]
      return { text: `❌ ${e.wrong}\n✅ ${e.right}\n\n**Почему?** ${tr(e.why, ctx.lang)}`, conceptId: e.concept, suggestions: ['Дай пять примеров'] }
    }

    for (const [re, answer] of ADVANCED) {
      if (re.test(q) && (ctx.level === 'A1' || ctx.level === 'A2')) return { text: `Это тема уровня B1+. ${answer}`, suggestions: SUGGEST }
    }

    if (/warum|почему|why|эмне үчүн/.test(n)) {
      const hit = WHY_NOTES.find(w => n.includes(normalize(w.sentence)) || n.includes(normalize(w.word)) && n.includes(normalize(w.sentence.split(' ')[1] ?? '')))
      if (hit) return { text: `**Почему «${hit.word}»?**\n${tr(hit.reason, ctx.lang)}\n\nЕщё примеры:\n${hit.more.map(m => `• ${m.de} — ${m.ru}`).join('\n')}`, conceptId: hit.conceptId }
    }

    if (/пять примеров|5 примеров|five examples|beispiele|примеры/.test(n)) {
      const c = GRAMMAR.find(g => g.id === ctx.lastConceptId) ?? GRAMMAR[0]
      const all = [...c.examples, ...c.reallife]
      return { text: `Примеры по теме «${tr(c.title, ctx.lang)}»:\n${all.slice(0, 5).map((e, i) => `${i + 1}. ${e.de} — ${e.ru}`).join('\n')}`, conceptId: c.id }
    }

    for (const [re, id] of KEYWORDS) {
      if (re.test(q)) {
        const c = GRAMMAR.find(g => g.id === id)
        if (c) return { text: fmtConcept(c, ctx.lang, ctx.level), conceptId: c.id, suggestions: ['Дай пять примеров', 'Проверь меня'] }
      }
    }

    return {
      text: `Я BilUp AI — ваш репетитор. Я знаю ваш уровень (${ctx.level}), поэтому объясняю без лишней сложности.\n\nСпросите, например:\n• «Почему здесь Dativ?»\n• «В чём разница между wissen и kennen?»\n• «Исправь: Ich habe 25 Jahre»\n• «Объясни Akkusativ» · «Дай пять примеров» · «Проверь меня»`,
      suggestions: SUGGEST,
    }
  }
}

export const tutor: TutorService = new MockTutor()
