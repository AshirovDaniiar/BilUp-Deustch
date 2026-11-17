import type { PlannedUnit } from './types'

/**
 * The ten approved A2 units: stable identity only (numeric id 11–20, a permanent key, the approved German title).
 *
 * This is a PLAN, not content. It contains no learning material and no Russian/Kyrgyz text, `A2_UNITS` stays empty until a unit is
 * actually authored and approved, and nothing in the application reads this list: A2 remains planned and invisible. The content
 * validator uses it to (a) require every planned unit in a release, (b) check that an authored unit matches its planned identity,
 * and (c) keep ids, keys and titles stable. The level of every item of a unit is the level of this unit (decision D-1).
 */
export const A2_UNIT_PLAN: readonly PlannedUnit[] = [
  { id: 11, key: 'a2-ueber-mich', level: 'A2', titleDe: 'Über mich und meine Erfahrungen' },
  { id: 12, key: 'a2-familie-freunde', level: 'A2', titleDe: 'Familie, Freunde und Zusammenleben' },
  { id: 13, key: 'a2-wohnen-nachbarschaft', level: 'A2', titleDe: 'Wohnen und Nachbarschaft' },
  { id: 14, key: 'a2-gesundheit', level: 'A2', titleDe: 'Gesundheit und Wohlbefinden' },
  { id: 15, key: 'a2-essen-einkaufen', level: 'A2', titleDe: 'Essen, Einkaufen und Dienstleistungen' },
  { id: 16, key: 'a2-freizeit-medien', level: 'A2', titleDe: 'Freizeit, Medien und Kultur' },
  { id: 17, key: 'a2-schule-beruf', level: 'A2', titleDe: 'Schule, Ausbildung und Beruf' },
  { id: 18, key: 'a2-reisen-urlaub', level: 'A2', titleDe: 'Reisen, Urlaub und Mobilität' },
  { id: 19, key: 'a2-stadtleben', level: 'A2', titleDe: 'Stadtleben und öffentliche Dienste' },
  { id: 20, key: 'a2-plaene-einladungen', level: 'A2', titleDe: 'Pläne, Einladungen und gemeinsame Entscheidungen' },
]
