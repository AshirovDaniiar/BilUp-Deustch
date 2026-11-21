import type { PlannedUnit } from '../a2/types'

/**
 * The twelve B1 units: stable identity only (numeric id 21–32, a permanent key, the approved German title).
 *
 * This is a PLAN, not content: it contains no learning material and no Russian/Kyrgyz text, and no unit is authored yet (`B1_CONTENT.units`
 * is empty). Nothing in the application reads it; the content validator does (every authored unit must match its planned identity, and ids,
 * keys and titles stay stable). The level of every item of a unit is the level of this unit (decision D-1).
 *
 * APPROVED by the owner as part of the B1 curriculum v2 product design (docs/b1/B1_CURRICULUM_V2_APPROVAL.md §2, recorded in
 * scripts/content-validate/b1/approval.ts). From now on an id or key is NEVER reused or changed; a title changes only together with the
 * authored unit and a recorded curriculum change. This is the owner's approval of the product design, NOT an official CEFR approval.
 * B1 stays `planned` (course registry): having a plan makes nothing visible.
 */
export const B1_UNIT_PLAN: readonly PlannedUnit[] = [
  { id: 21, key: 'b1-erlebnisse-erinnerungen', level: 'B1', titleDe: 'Erlebnisse und Erinnerungen erzählen' },
  { id: 22, key: 'b1-meinungen-diskussion', level: 'B1', titleDe: 'Meinungen äußern und diskutieren' },
  { id: 23, key: 'b1-arbeit-bewerbung', level: 'B1', titleDe: 'Arbeit, Bewerbung und Karriere' },
  { id: 24, key: 'b1-wohnen-umwelt', level: 'B1', titleDe: 'Wohnen, Umzug und Umwelt' },
  { id: 25, key: 'b1-gesundheit-lebensstil', level: 'B1', titleDe: 'Gesundheit, Beziehungen und Lebensstil' },
  { id: 26, key: 'b1-medien-technik', level: 'B1', titleDe: 'Medien, Technik und Nachrichten' },
  { id: 27, key: 'b1-konsum-reklamation', level: 'B1', titleDe: 'Konsum, Geld und Reklamation' },
  { id: 28, key: 'b1-bildung-zukunft', level: 'B1', titleDe: 'Bildung, Lernen und Zukunftspläne' },
  { id: 29, key: 'b1-reisen-kultur', level: 'B1', titleDe: 'Reisen, Kultur und Alltag im Vergleich' },
  { id: 30, key: 'b1-gesellschaft-engagement', level: 'B1', titleDe: 'Gesellschaft, Zusammenleben und Engagement' },
  { id: 31, key: 'b1-behoerden-recht', level: 'B1', titleDe: 'Behörden, Verträge und Alltagsprobleme' },
  { id: 32, key: 'b1-rueckblick-pruefung', level: 'B1', titleDe: 'Rückblick, Bilanz und Prüfungsvorbereitung' },
]
