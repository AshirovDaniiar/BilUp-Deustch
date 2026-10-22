import type { L10n } from './types'

/** Configuration for the interactive grammar visualisations. Kept as data, not hard-coded in components. */
const l = (ru: string, ky?: string, de?: string): L10n => ({ ru, ky, de })

export type Role = 'subj' | 'verb' | 'time' | 'obj' | 'place' | 'prefix' | 'inf' | 'conj' | 'qword'
export interface Block { id: string; text: string; role: Role }
export interface Variant { label: string; blocks: Block[]; explain: L10n }
export interface SentenceLab { note: L10n; variants: Variant[] }

const b = (id: string, text: string, role: Role): Block => ({ id, text, role })

export const ROLE_LABEL: Record<Role, L10n> = {
  subj: l('подлежащее', 'ээ', 'Subjekt'), verb: l('глагол', 'этиш', 'Verb'), time: l('время', 'убакыт', 'Zeit'), obj: l('дополнение', 'толуктоочтук', 'Objekt'),
  place: l('место', 'орун', 'Ort'), prefix: l('приставка', 'уңгу', 'Vorsilbe'), inf: l('инфинитив', 'инфинитив', 'Infinitiv'), conj: l('союз', 'байламта', 'Konjunktion'), qword: l('вопр. слово', 'суроо сөз', 'W-Wort'),
}

const verbpos: SentenceLab = {
  note: l('Глагол (фиолетовый) всегда на втором месте. Остальные блоки можно переставлять.', 'Этиш (кызгылт көк) дайыма экинчи орунда.', 'Das Verb (violett) steht immer an Position 2.'),
  variants: [
    { label: 'Ich …', explain: l('Позиция 1: подлежащее. Позиция 2: глагол.'), blocks: [b('s', 'Ich', 'subj'), b('v', 'lerne', 'verb'), b('t', 'heute', 'time'), b('o', 'Deutsch', 'obj')] },
    { label: 'Heute …', explain: l('Позиция 1: время. Глагол остаётся вторым — подлежащее уходит за него.'), blocks: [b('t', 'Heute', 'time'), b('v', 'lerne', 'verb'), b('s', 'ich', 'subj'), b('o', 'Deutsch', 'obj')] },
    { label: 'Deutsch …', explain: l('Позиция 1: дополнение (для акцента). Глагол всё равно второй.'), blocks: [b('o', 'Deutsch', 'obj'), b('v', 'lerne', 'verb'), b('s', 'ich', 'subj'), b('t', 'heute', 'time')] },
  ],
}

const questions: SentenceLab = {
  note: l('W-вопрос: глагол вторым после вопросительного слова. «Да/нет»-вопрос: глагол первым.', 'W-суроо: этиш экинчи; «ооба/жок» суроодо этиш биринчи.', 'W-Frage: Verb auf 2. Ja/Nein-Frage: Verb auf 1.'),
  variants: [
    { label: 'Wo …?', explain: l('W-слово на 1-м месте, глагол сразу за ним.'), blocks: [b('q', 'Wo', 'qword'), b('v', 'wohnst', 'verb'), b('s', 'du', 'subj')] },
    { label: 'Ja / Nein', explain: l('Нет вопросительного слова — глагол идёт первым.'), blocks: [b('v', 'Wohnst', 'verb'), b('s', 'du', 'subj'), b('p', 'in Berlin', 'place')] },
    { label: 'Woher …?', explain: l('То же правило: W-слово → глагол → подлежащее.'), blocks: [b('q', 'Woher', 'qword'), b('v', 'kommst', 'verb'), b('s', 'du', 'subj')] },
  ],
}

const separable: SentenceLab = {
  note: l('В инфинитиве приставка «приклеена». В предложении она отделяется и уходит в конец.', 'Инфинитивде уңгу чапталган, сүйлөмдө аягына өтөт.', 'Im Satz geht die Vorsilbe ans Ende.'),
  variants: [
    { label: 'aufstehen', explain: l('Инфинитив: приставка auf- + глагол stehen.'), blocks: [b('p', 'auf', 'prefix'), b('v', 'stehen', 'verb')] },
    { label: 'Ich stehe … auf', explain: l('Глагол — 2-й, приставка — в конце: получается «рамка».'), blocks: [b('s', 'Ich', 'subj'), b('v', 'stehe', 'verb'), b('t', 'um sieben Uhr', 'time'), b('p', 'auf', 'prefix')] },
    { label: 'Wann stehst du auf?', explain: l('В вопросе — то же самое: приставка в конце.'), blocks: [b('q', 'Wann', 'qword'), b('v', 'stehst', 'verb'), b('s', 'du', 'subj'), b('p', 'auf', 'prefix')] },
  ],
}

const modal: SentenceLab = {
  note: l('Модальный глагол — 2-й, смысловой глагол в инфинитиве — в самом конце (рамка).', 'Модалдык этиш экинчи, негизги этиш аягында.', 'Modalverb auf 2, Infinitiv am Ende.'),
  variants: [
    { label: 'möchte', explain: l('Вежливое желание.'), blocks: [b('s', 'Ich', 'subj'), b('v', 'möchte', 'verb'), b('o', 'einen Kaffee', 'obj'), b('i', 'bestellen', 'inf')] },
    { label: 'kann', explain: l('Умею / могу / можно.'), blocks: [b('v', 'Kannst', 'verb'), b('s', 'du', 'subj'), b('o', 'mir', 'obj'), b('i', 'helfen', 'inf')] },
    { label: 'muss', explain: l('Должен / нужно.'), blocks: [b('s', 'Ich', 'subj'), b('v', 'muss', 'verb'), b('t', 'heute', 'time'), b('i', 'arbeiten', 'inf')] },
  ],
}

const conjunctions: SentenceLab = {
  note: l('aber / und / oder / denn: порядок не меняется. weil: глагол уходит в конец.', 'weil: этиш аягына өтөт.', 'weil schickt das Verb ans Ende.'),
  variants: [
    { label: 'aber', explain: l('После aber — обычный порядок слов.'), blocks: [b('s1', 'Ich', 'subj'), b('v1', 'lerne', 'verb'), b('o1', 'Deutsch,', 'obj'), b('c', 'aber', 'conj'), b('s2', 'ich', 'subj'), b('v2', 'arbeite', 'verb'), b('o2', 'viel.', 'time')] },
    { label: 'weil', explain: l('После weil спрягаемый глагол — в самом конце.'), blocks: [b('s1', 'Ich', 'subj'), b('v1', 'lerne', 'verb'), b('o1', 'Deutsch,', 'obj'), b('c', 'weil', 'conj'), b('s2', 'ich', 'subj'), b('o2', 'viel', 'time'), b('v2', 'arbeite.', 'verb')] },
  ],
}

const timeOrder: SentenceLab = {
  note: l('am + день, um + время. Время обычно идёт перед местом. Глагол — второй.', 'am + күн, um + убакыт.', 'am + Tag, um + Uhrzeit.'),
  variants: [
    { label: 'Ich habe …', explain: l('Обычный порядок.'), blocks: [b('s', 'Ich', 'subj'), b('v', 'habe', 'verb'), b('t1', 'am Montag', 'time'), b('t2', 'um neun Uhr', 'time'), b('o', 'einen Termin', 'obj')] },
    { label: 'Am Montag …', explain: l('Время вынесено вперёд — глагол остаётся вторым.'), blocks: [b('t1', 'Am Montag', 'time'), b('v', 'habe', 'verb'), b('s', 'ich', 'subj'), b('t2', 'um neun Uhr', 'time'), b('o', 'einen Termin', 'obj')] },
  ],
}

export const SENTENCE_LABS: Record<string, SentenceLab> = {
  'verb-position': verbpos,
  questions,
  separable,
  modal,
  conjunctions,
  'time-order': timeOrder,
}

// ---------- conjugation ----------
export interface ConjVerb { inf: string; forms: string[]; note?: L10n }
export const PRONOUNS = ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie']
const cv = (inf: string, forms: string[], note?: L10n): ConjVerb => ({ inf, forms, note })

export const CONJ_LABS: Record<string, ConjVerb[]> = {
  'sein-haben': [
    cv('sein', ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], l('Полностью неправильный — выучить наизусть.')),
    cv('haben', ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], l('Почти правильный: du hast, er hat (без b).')),
  ],
  'regular-verbs': [
    cv('lernen', ['lerne', 'lernst', 'lernt', 'lernen', 'lernt', 'lernen']),
    cv('wohnen', ['wohne', 'wohnst', 'wohnt', 'wohnen', 'wohnt', 'wohnen']),
    cv('arbeiten', ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten'], l('Основа на -t: добавляется -e- (du arbeitest, er arbeitet).')),
    cv('sprechen', ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'], l('e → i в формах du и er/sie/es.')),
    cv('kommen', ['komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen']),
  ],
}

// ---------- plural ----------
export const PLURAL_TYPES: { label: string; hint: L10n; pairs: [string, string][] }[] = [
  { label: '-e / ¨e', hint: l('чаще мужской род'), pairs: [['der Sohn', 'die Söhne'], ['der Tag', 'die Tage'], ['der Freund', 'die Freunde']] },
  { label: '-(e)n', hint: l('чаще женский род'), pairs: [['die Frau', 'die Frauen'], ['die Wohnung', 'die Wohnungen'], ['die Tasche', 'die Taschen']] },
  { label: '-er / ¨er', hint: l('чаще средний род'), pairs: [['das Kind', 'die Kinder'], ['das Haus', 'die Häuser'], ['das Ei', 'die Eier']] },
  { label: '-s', hint: l('иностранные слова'), pairs: [['das Auto', 'die Autos'], ['das Hotel', 'die Hotels'], ['der Park', 'die Parks']] },
  { label: '– / ¨', hint: l('слова на -er, -el, -en'), pairs: [['der Lehrer', 'die Lehrer'], ['der Bruder', 'die Brüder'], ['der Koffer', 'die Koffer']] },
]

// ---------- articles ----------
export const ARTICLE_COLUMNS: { art: 'der' | 'die' | 'das'; tone: string; hints: string[]; nouns: string[] }[] = [
  { art: 'der', tone: 'masc', hints: ['Wochentage: der Montag', 'Jahreszeiten: der Sommer', '-er (Beruf): der Lehrer'], nouns: ['Tisch', 'Bahnhof', 'Kaffee', 'Arzt'] },
  { art: 'die', tone: 'fem', hints: ['-ung: die Wohnung', '-heit / -keit: die Freiheit', '-schaft: die Freundschaft', '-in: die Ärztin'], nouns: ['Lampe', 'Küche', 'Miete', 'Rechnung'] },
  { art: 'das', tone: 'neut', hints: ['-chen: das Mädchen', '-ment: das Dokument', 'Verb als Nomen: das Essen'], nouns: ['Brot', 'Zimmer', 'Bett', 'Kind'] },
]

// ---------- prepositions (Wo? / Wohin?) ----------
export interface PrepPos { prep: string; x: number; y: number; wo: string; wohin: string; twoBoxes?: boolean; behind?: boolean }
export const PREP_POSITIONS: PrepPos[] = [
  { prep: 'in', x: 150, y: 138, wo: 'Der Ball ist in der Kiste.', wohin: 'Ich werfe den Ball in die Kiste.' },
  { prep: 'auf', x: 150, y: 84, wo: 'Der Ball liegt auf der Kiste.', wohin: 'Ich lege den Ball auf die Kiste.' },
  { prep: 'an', x: 196, y: 126, wo: 'Der Ball liegt an der Kiste.', wohin: 'Ich rolle den Ball an die Kiste.' },
  { prep: 'über', x: 150, y: 36, wo: 'Der Ball hängt über der Kiste.', wohin: 'Ich hänge den Ball über die Kiste.' },
  { prep: 'unter', x: 150, y: 184, wo: 'Der Ball liegt unter der Kiste.', wohin: 'Ich lege den Ball unter die Kiste.' },
  { prep: 'vor', x: 112, y: 178, wo: 'Der Ball liegt vor der Kiste.', wohin: 'Ich lege den Ball vor die Kiste.' },
  { prep: 'hinter', x: 176, y: 100, behind: true, wo: 'Der Ball liegt hinter der Kiste.', wohin: 'Ich lege den Ball hinter die Kiste.' },
  { prep: 'neben', x: 232, y: 140, wo: 'Der Ball liegt neben der Kiste.', wohin: 'Ich lege den Ball neben die Kiste.' },
  { prep: 'zwischen', x: 150, y: 140, twoBoxes: true, wo: 'Der Ball liegt zwischen den Kisten.', wohin: 'Ich lege den Ball zwischen die Kisten.' },
]

// ---------- timeline (Perfekt) ----------
export const TIMELINE: { id: string; label: L10n; tense: string; sentence: string; ru: string; parts: { text: string; role: Role }[] }[] = [
  { id: 'past', label: l('Вчера', 'Кечээ', 'Gestern'), tense: 'Perfekt', sentence: 'Gestern habe ich Deutsch gelernt.', ru: 'Вчера я учил немецкий.', parts: [{ text: 'habe', role: 'verb' }, { text: 'ich', role: 'subj' }, { text: 'Deutsch', role: 'obj' }, { text: 'gelernt', role: 'inf' }] },
  { id: 'now', label: l('Сейчас', 'Азыр', 'Jetzt'), tense: 'Präsens', sentence: 'Jetzt lerne ich Deutsch.', ru: 'Сейчас я учу немецкий.', parts: [{ text: 'lerne', role: 'verb' }, { text: 'ich', role: 'subj' }, { text: 'Deutsch', role: 'obj' }] },
  { id: 'future', label: l('Завтра', 'Эртең', 'Morgen'), tense: 'Präsens + Zeitwort', sentence: 'Morgen lerne ich wieder Deutsch.', ru: 'Завтра я снова буду учить немецкий.', parts: [{ text: 'lerne', role: 'verb' }, { text: 'ich', role: 'subj' }, { text: 'wieder', role: 'time' }, { text: 'Deutsch', role: 'obj' }] },
]

// ---------- negation ----------
export const NEGATION_ITEMS: { positive: string; negative: string; rule: 'kein' | 'nicht'; reason: L10n }[] = [
  { positive: 'Ich habe ein Auto.', negative: 'Ich habe kein Auto.', rule: 'kein', reason: l('Существительное с ein-артиклем → kein.') },
  { positive: 'Ich trinke Milch.', negative: 'Ich trinke keine Milch.', rule: 'kein', reason: l('Существительное без артикля → kein- (Milch: die → keine).') },
  { positive: 'Ich habe Zeit.', negative: 'Ich habe keine Zeit.', rule: 'kein', reason: l('Zeit без артикля → keine.') },
  { positive: 'Ich arbeite heute.', negative: 'Ich arbeite heute nicht.', rule: 'nicht', reason: l('Отрицаем глагол → nicht в конце.') },
  { positive: 'Das ist teuer.', negative: 'Das ist nicht teuer.', rule: 'nicht', reason: l('Прилагательное → nicht перед ним.') },
  { positive: 'Ich kenne den Mann.', negative: 'Ich kenne den Mann nicht.', rule: 'nicht', reason: l('Существительное с определённым артиклем (den) → nicht.') },
]
