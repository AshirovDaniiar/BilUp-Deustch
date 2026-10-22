import type { L10n } from './types'

/** Rule-based checks for typical learner errors. Used by the speaking + writing analysers and the tutor. */
export interface ErrorPattern {
  id: string
  re: RegExp
  concept: string
  category: 'grammar' | 'wordorder' | 'vocabulary'
  fix: (m: RegExpMatchArray) => { wrong: string; right: string }
  why: L10n
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

const p = (id: string, re: RegExp, concept: string, category: ErrorPattern['category'], fix: ErrorPattern['fix'], why: string): ErrorPattern =>
  ({ id, re, concept, category, fix, why: { ru: why } })

const PRON_AKK: Record<string, string> = { ich: 'mich', mir: 'mich', du: 'dich', dir: 'dich', er: 'ihn', ihm: 'ihn' }
const PRON_DAT: Record<string, string> = { ich: 'mir', du: 'dir', er: 'ihm' }

export const ERROR_PATTERNS: ErrorPattern[] = [
  p('age-haben', /\bich habe (\d+) jahre\b(?! alt)/i, 'sein-haben', 'grammar', m => ({ wrong: m[0], right: `Ich bin ${m[1]} Jahre alt` }), 'Возраст — состояние: sein, а не haben. Ich bin … Jahre alt.'),
  p('hunger-sein', /\bich bin (hunger|durst)\b/i, 'sein-haben', 'grammar', m => ({ wrong: m[0], right: `Ich habe ${cap(m[1])}` }), 'Голод и жажда — через haben: Ich habe Hunger.'),
  p('mit-dem', /\bmit (der|den) (bus|zug|auto|freund|lehrer|arzt|chef)\b/i, 'dativ-prep', 'grammar', m => ({ wrong: m[0], right: `mit dem ${cap(m[2])}` }), 'mit всегда требует Dativ: dem (для der- и das-слов).'),
  p('ein-kaffee', /\bich (möchte|brauche|nehme|habe|esse|trinke) (ein|der|das) (kaffee|tee|salat|apfel|käse|reis|schlüssel|tisch|stuhl)\b/i, 'akkusativ', 'grammar', m => ({ wrong: m[0], right: `Ich ${m[1]} ${m[2].toLowerCase() === 'ein' ? 'einen' : 'den'} ${cap(m[3])}` }), 'Прямое дополнение мужского рода — Akkusativ: einen / den.'),
  p('weil-verb', /\bweil (ich|du|er|sie|wir|es) (bin|bist|ist|sind|habe|hast|hat|arbeite|wohne|möchte|kann|muss)(?=\s+[a-zäöüß])/i, 'conjunctions', 'wordorder', m => ({ wrong: m[0], right: `weil ${m[1]} … ${m[2]}` }), 'После weil спрягаемый глагол уходит в самый конец придаточного.'),
  p('verb-v2', /\b(heute|morgen|jetzt|gestern|dann|danach) (ich|du|er|wir) (?=[a-zäöüß]+)(?!bin\b)(?!habe\b)/i, 'verb-position', 'wordorder', m => ({ wrong: `${cap(m[1])} ${m[2]} …`, right: `${cap(m[1])} [глагол] ${m[2]} …` }), 'Глагол — всегда на втором месте: после «heute/morgen/jetzt» идёт глагол, потом подлежащее.'),
  p('die-auto', /\b(die|der) auto\b/i, 'articles', 'grammar', () => ({ wrong: 'der/die Auto', right: 'das Auto' }), 'Auto — среднего рода: das Auto.'),
  p('verb-ich', /\bich (wohnen|lernen|kommen|arbeiten|sprechen|heißen)\b/i, 'regular-verbs', 'grammar', m => ({ wrong: m[0], right: `ich ${m[1].replace(/en$/, 'e')}` }), 'После ich у глагола окончание -e: ich wohne, ich lerne.'),
  p('perfekt-sein', /\bich habe (\w+ )?(gefahren|gegangen|gekommen|geflogen)\b/i, 'perfekt', 'grammar', m => ({ wrong: m[0], right: m[0].replace(/habe/i, 'bin') }), 'Глаголы движения образуют Perfekt с sein: ich bin gefahren.'),
  p('kein-nicht', /\bich habe nicht (auto|geld|zeit|hunger|bruder|schwester|wohnung|arbeit)\b/i, 'negation', 'grammar', m => {
    const w = m[1].toLowerCase()
    const k = w === 'bruder' || w === 'hunger' ? 'keinen' : w === 'auto' || w === 'geld' ? 'kein' : 'keine'
    return { wrong: m[0], right: `ich habe ${k} ${cap(w)}` }
  }, 'Существительное без артикля отрицаем через kein-, а не nicht.'),
  p('fuer-mir', /\bfür (ich|mir|du|dir|er|ihm)\b/i, 'akk-prep', 'grammar', m => ({ wrong: m[0], right: `für ${PRON_AKK[m[1].toLowerCase()]}` }), 'für требует Akkusativ: mich, dich, ihn.'),
  p('mit-ich', /\bmit (ich|du|er)\b/i, 'dativ-prep', 'grammar', m => ({ wrong: m[0], right: `mit ${PRON_DAT[m[1].toLowerCase()]}` }), 'mit требует Dativ: mir, dir, ihm.'),
  p('modal-zu', /\b(möchte|kann|muss|will|darf) (\w+ )?zu (\w+en)\b/i, 'modal', 'grammar', m => ({ wrong: m[0], right: m[0].replace(/ zu /, ' ') }), 'После модального глагола — инфинитив без zu.'),
  p('in-die-wo', /\bich (wohne|bin|arbeite) in (die|den) (stadt|küche|schule|firma|wohnung|park)\b/i, 'wechsel', 'grammar', m => ({ wrong: m[0], right: m[0].replace(/ (die|den) /i, ' der ') }), 'wohnen, sein, arbeiten отвечают на Wo? → Dativ: in der Stadt.'),
]

export interface FoundError { id: string; concept: string; category: ErrorPattern['category']; wrong: string; right: string; why: L10n }

export function findErrors(text: string): FoundError[] {
  const out: FoundError[] = []
  for (const e of ERROR_PATTERNS) {
    const m = text.match(e.re)
    if (m) out.push({ id: e.id, concept: e.concept, category: e.category, ...e.fix(m), why: e.why })
  }
  return out
}
