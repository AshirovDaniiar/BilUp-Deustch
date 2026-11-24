import type { LearningUnit } from './types'

export const UNITS: LearningUnit[] = [
  { id: 1, level: 'A1', title: 'Hallo & Ich', icon: '👋', subtitle: { ru: 'Знакомство, приветствия, первые фразы', ky: 'Таанышуу, саламдашуу, биринчи сүйлөмдөр', de: 'Sich vorstellen, grüßen, erste Sätze' }, grammarIds: ['articles', 'sein-haben', 'questions', 'nominativ'] },
  { id: 2, level: 'A1', title: 'Meine Familie', icon: '👨‍👩‍👧', subtitle: { ru: 'Семья, люди, описание', ky: 'Үй-бүлө, адамдар, сүрөттөө', de: 'Familie, Menschen, Beschreibungen' }, grammarIds: ['plural', 'possessive'] },
  { id: 3, level: 'A1', title: 'Mein Alltag', icon: '⏰', subtitle: { ru: 'Распорядок дня и привычки', ky: 'Күн тартиби жана адаттар', de: 'Tagesablauf und Gewohnheiten' }, grammarIds: ['regular-verbs', 'verb-position', 'separable'] },
  { id: 4, level: 'A1', title: 'Essen & Trinken', icon: '🍞', subtitle: { ru: 'Еда, кафе, заказ', ky: 'Тамак-аш, кафе, буйрутма', de: 'Essen, Café, bestellen' }, grammarIds: ['akkusativ', 'negation', 'modal'] },
  { id: 5, level: 'A1', title: 'Meine Wohnung', icon: '🏠', subtitle: { ru: 'Жильё, мебель, аренда', ky: 'Турак жай, эмерек, ижара', de: 'Wohnen, Möbel, Miete' }, grammarIds: ['wechsel'] },
  { id: 6, level: 'A1', title: 'Arbeit & Beruf', icon: '💼', subtitle: { ru: 'Профессии, офис, заявление', ky: 'Кесиптер, кеңсе, арыз', de: 'Berufe, Büro, Bewerbung' }, grammarIds: ['conjunctions'] },
  { id: 7, level: 'A1', title: 'In der Stadt', icon: '🏙️', subtitle: { ru: 'Ориентирование и места в городе', ky: 'Шаарда багыт табуу', de: 'Orientierung und Orte in der Stadt' }, grammarIds: ['dativ', 'dativ-prep'] },
  { id: 8, level: 'A1', title: 'Zeit & Termine', icon: '📅', subtitle: { ru: 'Время, дни недели, записи на приём', ky: 'Убакыт, апта күндөрү, жолугушуулар', de: 'Uhrzeit, Wochentage, Termine' }, grammarIds: ['time-order', 'perfekt'] },
  { id: 9, level: 'A1', title: 'Einkaufen', icon: '🛍️', subtitle: { ru: 'Покупки, цены, оплата', ky: 'Соода, баа, төлөм', de: 'Einkaufen, Preise, bezahlen' }, grammarIds: ['akk-prep'] },
  { id: 10, level: 'A1', title: 'Unterwegs', icon: '🚆', subtitle: { ru: 'Поездки, вокзал, аэропорт', ky: 'Саякат, вокзал, аэропорт', de: 'Reisen, Bahnhof, Flughafen' }, grammarIds: ['genitiv'] },
]

export const SECTIONS = ['vocabulary', 'grammar', 'merksaetze', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'] as const
export type SectionId = (typeof SECTIONS)[number]
export const unitById = (id: number) => UNITS.find(u => u.id === id)

/** Speaking scenario that belongs to each unit (index = unit id - 1). */
export const UNIT_SPEAKING = ['meeting', 'work', 'appointment', 'restaurant', 'viewing', 'interview', 'station', 'phone', 'supermarket', 'office']
export const unitOfScenario = (id: string) => UNIT_SPEAKING.indexOf(id) + 1
