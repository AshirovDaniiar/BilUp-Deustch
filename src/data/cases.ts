import type { GrammarExample, GrammarMistake, L10n } from './types'

export type CaseId = 'nom' | 'akk' | 'dat' | 'gen'
export type Gender = 'm' | 'f' | 'n' | 'pl'

const l = (ru: string, ky?: string, de?: string): L10n => ({ ru, ky, de })
const ex = (de: string, ru: string, focus?: string): GrammarExample => ({ de, ru, focus })
const mk = (wrong: string, right: string, note: string): GrammarMistake => ({ wrong, right, note: l(note) })

export const GENDER_LABEL: Record<Gender, string> = { m: 'der', f: 'die', n: 'das', pl: 'die (Pl.)' }
export const CASE_ORDER: CaseId[] = ['nom', 'akk', 'dat', 'gen']

/** Demonstration nouns: Mann (m), Frau (f), Kind (n), Kinder (pl) in the four cases. */
export const DEMO: Record<Gender, { definite: string[]; indefinite: (string | null)[]; noun: string[] }> = {
  m: { definite: ['der', 'den', 'dem', 'des'], indefinite: ['ein', 'einen', 'einem', 'eines'], noun: ['Mann', 'Mann', 'Mann', 'Mannes'] },
  f: { definite: ['die', 'die', 'der', 'der'], indefinite: ['eine', 'eine', 'einer', 'einer'], noun: ['Frau', 'Frau', 'Frau', 'Frau'] },
  n: { definite: ['das', 'das', 'dem', 'des'], indefinite: ['ein', 'ein', 'einem', 'eines'], noun: ['Kind', 'Kind', 'Kind', 'Kindes'] },
  pl: { definite: ['die', 'die', 'den', 'der'], indefinite: [null, null, null, null], noun: ['Kinder', 'Kinder', 'Kindern', 'Kinder'] },
}

export interface CaseInfo {
  id: CaseId
  name: string
  question: L10n
  short: L10n
  why: L10n
  when: L10n[]
  examples: GrammarExample[]
  mistakes: GrammarMistake[]
  reallife: GrammarExample[]
}

export const CASES: Record<CaseId, CaseInfo> = {
  nom: {
    id: 'nom', name: 'Nominativ',
    question: l('Wer? Was?', 'Ким? Эмне?', 'Wer? Was?'),
    short: l('Подлежащее — тот, кто действует или о ком говорят.', 'Ээ — иштеген же жөнүндө айтылган зат.', 'Das Subjekt: wer handelt?'),
    why: l('Немецкий — язык, где у слова есть «роль» в предложении. Роль «действующего лица» — Nominativ. Это словарная форма: артикль не меняется.', 'Ээнин ролу — Nominativ.', 'Der Nominativ markiert das Subjekt.'),
    when: [l('Подлежащее: Der Mann arbeitet.'), l('После sein и werden: Er ist ein Freund.'), l('Словарная форма слова')],
    examples: [ex('Der Mann trinkt Kaffee.', 'Мужчина пьёт кофе.', 'Der Mann'), ex('Die Frau liest ein Buch.', 'Женщина читает книгу.', 'Die Frau'), ex('Das Kind schläft.', 'Ребёнок спит.', 'Das Kind')],
    mistakes: [mk('Den Mann arbeitet.', 'Der Mann arbeitet.', 'Подлежащее не может быть в Akkusativ.'), mk('Ich bin einen Lehrer.', 'Ich bin ein Lehrer.', 'После sein — тоже Nominativ.')],
    reallife: [ex('Der Zug kommt gleich.', 'Поезд скоро придёт.'), ex('Das ist mein Chef.', 'Это мой начальник.')],
  },
  akk: {
    id: 'akk', name: 'Akkusativ',
    question: l('Wen? Was?', 'Кимди? Эмнени?', 'Wen? Was?'),
    short: l('Прямое дополнение — на кого/что направлено действие. Меняется только мужской род.', 'Туура толуктоочтук.', 'Das direkte Objekt. Nur Maskulinum ändert sich.'),
    why: l('В предложении «Мужчина видит собаку» нужно отличать, кто видит, а кто — объект. Немецкий делает это артиклем: der Mann (видит) vs. den Mann (его видят). Меняется только мужской род — для остальных форма та же, что в Nominativ.', 'Объектти артикль менен белгилейт.', 'Der Artikel zeigt die Rolle im Satz.'),
    when: [l('Вопрос: Wen oder was? — Ich sehe den Mann.'), l('Глаголы: haben, brauchen, kaufen, essen, trinken, sehen, nehmen, möchten'), l('Предлоги: für, durch, gegen, ohne, um')],
    examples: [ex('Ich sehe den Mann.', 'Я вижу мужчину.', 'den Mann'), ex('Wir kaufen einen Tisch.', 'Мы покупаем стол.', 'einen Tisch'), ex('Er liebt die Frau.', 'Он любит женщину.', 'die Frau')],
    mistakes: [mk('Ich möchte ein Kaffee.', 'Ich möchte einen Kaffee.', 'der Kaffee → Akkusativ: einen.'), mk('Ich brauche der Schlüssel.', 'Ich brauche den Schlüssel.', 'Прямое дополнение мужского рода: den.')],
    reallife: [ex('Ich nehme den Salat.', 'Я возьму салат.'), ex('Haben Sie einen Termin?', 'У вас есть запись?')],
  },
  dat: {
    id: 'dat', name: 'Dativ',
    question: l('Wem?', 'Кимге?', 'Wem?'),
    short: l('Косвенное дополнение — адресат: кому? Меняются все роды: dem / der / dem / den.', 'Кыйыр толуктоочтук — кимге?', 'Das indirekte Objekt: wem?'),
    why: l('Dativ — «адресат» действия: кому помогаю, кому даю, кому нравится. Кроме того, ряд предлогов (mit, bei, nach, zu, von, aus, seit) всегда ведёт за собой Dativ — это свойство предлога, а не выбор.', 'Dativ — аракеттин алуучусу.', 'Dativ = Adressat; manche Präpositionen verlangen ihn immer.'),
    when: [l('Вопрос: Wem? — Ich helfe dem Mann.'), l('Глаголы: helfen, danken, gefallen, gehören, antworten'), l('Предлоги: aus, bei, mit, nach, seit, von, zu'), l('Множественное число: den Kindern (+n)')],
    examples: [ex('Ich helfe dem Mann.', 'Я помогаю мужчине.', 'dem Mann'), ex('Ich fahre mit dem Auto.', 'Я еду на машине.', 'dem Auto'), ex('Das Buch gehört der Frau.', 'Книга принадлежит женщине.', 'der Frau')],
    mistakes: [mk('Ich fahre mit der Bus.', 'Ich fahre mit dem Bus.', 'mit + Dativ → dem.'), mk('Ich helfe den Kinder.', 'Ich helfe den Kindern.', 'Во мн. ч. в Dativ добавляется -n.')],
    reallife: [ex('Kann ich Ihnen helfen?', 'Могу я вам помочь?'), ex('Die Jacke gefällt mir.', 'Куртка мне нравится.')],
  },
  gen: {
    id: 'gen', name: 'Genitiv',
    question: l('Wessen?', 'Кимдин?', 'Wessen?'),
    short: l('Принадлежность — чей? Мужской и средний род получают -(e)s. В речи часто: von + Dativ.', 'Таандык — кимдин?', 'Besitz: wessen?'),
    why: l('Genitiv показывает «кому принадлежит». Он характерен для письменной речи. В разговоре немцы чаще говорят «das Auto von meinem Vater» — оба варианта правильны.', 'Genitiv — жазуу тилинде көп колдонулат.', 'Genitiv vor allem in der Schriftsprache.'),
    when: [l('Вопрос: Wessen? — das Auto des Mannes'), l('Мужской/средний род: des Mannes, des Kindes'), l('Женский и мн. ч.: der Frau, der Kinder'), l('Разговорная замена: von + Dativ')],
    examples: [ex('Das ist das Auto des Mannes.', 'Это машина мужчины.', 'des Mannes'), ex('Das ist die Tasche der Frau.', 'Это сумка женщины.', 'der Frau'), ex('Das ist das Spielzeug des Kindes.', 'Это игрушка ребёнка.', 'des Kindes')],
    mistakes: [mk('das Auto des Mann', 'das Auto des Mannes', 'Мужской род получает окончание -(e)s.'), mk('die Tasche des Frau', 'die Tasche der Frau', 'Женский род: der.')],
    reallife: [ex('Die Abfahrt des Zuges ist um 9 Uhr.', 'Отправление поезда в 9 часов.'), ex('Das ist die Adresse des Hotels.', 'Это адрес отеля.')],
  },
}

export const CASE_BY_CONCEPT: Record<string, CaseId> = { nominativ: 'nom', akkusativ: 'akk', 'akk-prep': 'akk', dativ: 'dat', 'dativ-prep': 'dat', genitiv: 'gen' }
