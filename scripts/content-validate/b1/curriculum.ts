// The B1 curriculum allocation the validator enforces (curriculum v2). The OWNER APPROVED the product design (see ./approval.ts), so the
// concept ids below are now permanent identities. This approval is NOT an official CEFR approval: every decision the dossier marks ⚑ carries
// `expertReview` and stays "pending independent expert verification"; no uncertain B1/B2 classification was upgraded.
//
// Source of truth for the numbers: docs/b1/B1_CURRICULUM_V2_APPROVAL.md §3 (29 concepts in 12 units) and docs/b1/B1_CURRICULUM.md §6/§8 (strands).
// A test keeps this file and the dossier in agreement (ids, units, proficiency, load, counts). To change the allocation: change the dossier, this
// file and the test together, as an owner-approved curriculum change — never silently.
//
// Nothing here is imported by the application. It lives under scripts/ and never ships.
import { B1_APPROVAL } from './approval'
import type { B1ConceptSpec, B1Curriculum, B1UnitRequirements, B1UnitSpec } from './types'

interface ConceptOptions {
  role?: B1ConceptSpec['role']
  listCap?: number
  /** a ⚑ decision of the dossier §8: the classification is the author's default and awaits the independent expert */
  review?: { decision: string; note: string }
}

const c = (id: string, proficiency: B1ConceptSpec['proficiency'], load: B1ConceptSpec['load'], o: ConceptOptions = {}): B1ConceptSpec => ({
  id,
  proficiency,
  load,
  role: o.role ?? 'new',
  ...(o.listCap === undefined ? {} : { listCap: o.listCap }),
  ...(o.review === undefined ? {} : { expertReview: { status: 'pending' as const, ...o.review } }),
})

const none: B1UnitRequirements = {
  differenceFromA2: false,
  wortbildung: false,
  meinungMicroTask: false,
  mediationMicroTask: false,
  comparison: false,
  recapConcepts: 0,
  a2Revision: false,
  revisionBlock: false,
  topics: [],
}
const u = (unit: number, concepts: B1ConceptSpec[], requires: Partial<B1UnitRequirements>): B1UnitSpec => ({
  unit,
  concepts,
  requires: { ...none, ...requires },
})

const UNITS: readonly B1UnitSpec[] = [
  u(21, [c('b1-praeteritum-erzaehlen', 'P-lim', 'H', { listCap: 35 }), c('b1-temporale-konnektoren', 'P', 'M')], {
    differenceFromA2: true,
    recapConcepts: 3,
    a2Revision: true,
    topics: ['feelings'],
  }),
  u(22, [c('b1-konzessive-saetze', 'P', 'M'), c('b1-doppelkonnektoren', 'P', 'M'), c('b1-adjektive-dativ-genitiv', 'P', 'L')], {
    differenceFromA2: true,
    comparison: true,
    a2Revision: true,
  }),
  u(23, [c('b1-relativsaetze-nom-akk', 'P', 'H'), c('b1-infinitiv-mit-zu', 'P', 'M')], { differenceFromA2: true, a2Revision: true }),
  u(
    24,
    [
      c('b1-passiv-praesens', 'P', 'H', {
        review: { decision: 'D-5', note: 'Passiv Perfekt is receptive only; the reviewer may promote it to limited-productive' },
      }),
      c('b1-adjektive-ohne-artikel', 'P', 'M'),
    ],
    { differenceFromA2: true, meinungMicroTask: true, a2Revision: true, revisionBlock: true },
  ),
  u(25, [c('b1-konjunktiv2-ratschlaege', 'P', 'H'), c('b1-reflexive-dativ', 'P-lim', 'M', { listCap: 10 })], {
    differenceFromA2: true,
    wortbildung: true,
    meinungMicroTask: true,
    topics: ['feelings', 'relationships'],
  }),
  u(
    26,
    [
      c('b1-passiv-praeteritum-modal', 'P', 'M'),
      c('b1-lassen', 'P-lim', 'L', {
        review: {
          decision: 'X-1',
          note: '"sich lassen" is receptive; the B1/B2 placement of the productive use is unconfirmed (dossier ⚑ item 13; it has no D-number)',
        },
      }),
      c('b1-wiedergeben-indikativ', 'P', 'M'),
    ],
    { differenceFromA2: true, wortbildung: true, meinungMicroTask: true, mediationMicroTask: true, topics: ['book-film'] },
  ),
  u(
    27,
    [
      c('b1-konjunktiv2-wuensche-irreal', 'P', 'H'),
      c('b1-genitiv-praepositionen', 'P-lim', 'M', {
        review: {
          decision: 'D-7',
          note: 'A1 teaches only a Genitiv overview (recognition); productive use of the Genitiv prepositions is unconfirmed; fallback: receptive only',
        },
      }),
    ],
    { differenceFromA2: true, wortbildung: true, meinungMicroTask: true, topics: ['money-banking'] },
  ),
  u(
    28,
    [
      c('b1-futur1-vermutungen', 'P-lim', 'L', {
        review: {
          decision: 'D-3',
          note: 'Futur I productive use is limited to forecasts and conjecture with "wohl"; fallback: receptive only',
        },
      }),
      c('b1-falls-sobald-solange', 'P', 'L'),
      c('b1-verben-praepositionen', 'P-lim', 'M', { listCap: 20 }),
    ],
    {
      differenceFromA2: true,
      wortbildung: true,
      meinungMicroTask: true,
      mediationMicroTask: true,
      revisionBlock: true,
      topics: ['school-kita'],
    },
  ),
  u(
    29,
    [
      c('b1-relativsaetze-dativ-praeposition', 'P', 'M'),
      // The dossier says "R-first; P-lim ⚑". Until the expert confirms a limited-productive use, the ENFORCED classification is the conservative
      // one: receptive. (The earlier validator configuration said P-lim, which would have silently upgraded an uncertain classification.)
      c('b1-genitivattribute', 'R', 'M', {
        review: {
          decision: 'D-7',
          note: 'receptive-first; a closed productive set (P-lim) is the pending upgrade if the reviewer confirms it',
        },
      }),
      c('b1-plusquamperfekt-nachdem', 'P', 'M', {
        review: { decision: 'D-6', note: 'Plusquamperfekt + nachdem is proposed as productive at B1; fallback: receptive first' },
      }),
    ],
    { differenceFromA2: true, wortbildung: true, meinungMicroTask: true, comparison: true },
  ),
  u(
    30,
    [
      c('b1-nomen-verb-verbindungen', 'P-lim', 'M', {
        listCap: 20,
        review: { decision: 'D-8', note: 'B1/B2 boundary; capped at 20 expressions; fallback: receptive only' },
      }),
      c('b1-konsekutiv-final', 'P', 'M'),
      c('b1-textkohaesion', 'P-lim', 'L'),
    ],
    { wortbildung: true, meinungMicroTask: true },
  ),
  u(
    31,
    [
      c('b1-formelle-sprache', 'P', 'L'),
      c('b1-aktiv-passiv-zustandspassiv', 'P', 'M', {
        review: { decision: 'D-8', note: 'Zustandspassiv is limited-productive within this concept; fallback: receptive only' },
      }),
    ],
    { differenceFromA2: true, wortbildung: true, meinungMicroTask: true, mediationMicroTask: true, topics: ['emergency-police'] },
  ),
  u(
    32,
    [
      c('b1-nebensaetze-integration', 'P', 'L', { role: 'revision' }),
      c('b1-satzbau-mittelfeld', 'P', 'M', {
        role: 'revision',
        review: {
          decision: 'D-9',
          note: 'a systematisation of order rules used since Unit 21, partly new to the learner; fallback: a plain revision list without a concept',
        },
      }),
    ],
    { wortbildung: true, revisionBlock: true },
  ),
]

/** The approved allocation; `approved` follows the recorded owner approval (true: product design). CEFR expert verification of ⚑ items is pending. */
export const B1_CURRICULUM: B1Curriculum = { approved: B1_APPROVAL.recorded, units: UNITS }
/** Total number of concepts of the approved curriculum. */
export const B1_CONCEPT_TARGET = 29
