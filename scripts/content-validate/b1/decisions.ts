// The REGISTER of every open B1 curriculum decision (P1 remediation of the final audit, B1_FINAL_AUDIT.md §3 / §9 item 1).
//
// WHY: until now only the decisions that are attached to a grammar CONCEPT (D-3, D-5, D-6, D-7, D-8, D-9) raised a validator review flag; D-2, D-4 and D-10…D-14 had none, and the flag on `b1-lassen` carried the
// wrong id (D-1 is the A2→B1 boundary of the dossier). This file lists ALL of them with an owner-review status, so that no unresolved decision can be forgotten.
//
// WHAT THIS IS NOT: it approves nothing. No entry may be `approved` — a person must record an approval in the dossier first (the validator rejects any other status). The author's proposed default is what is
// IMPLEMENTED; it is not verified. Items that need an independent German/CEFR expert say so.
//
// IDs: D-1…D-14 are the decision numbers of docs/b1/B1_CURRICULUM_V2_APPROVAL.md §9. `X-n` are decisions found DURING authoring that the dossier does not number (documented in the unit reports).
export type B1DecisionStatus = 'pending-expert' | 'pending-owner' | 'pending-owner-and-expert'

export interface B1Decision {
  id: string
  title: string
  /** the units the decision affects (21–32); an empty list = the whole course */
  units: number[]
  /** what is implemented today (the author's proposed default, unverified) */
  implemented: string
  /** the educational consequence if the reviewer disagrees */
  consequence: string
  /** the dossier's fallback, or the recommended resolution for an `X-n` item */
  fallback: string
  status: B1DecisionStatus
  /** true = an independent German teacher / CEFR specialist must judge it; the author must not guess */
  expertRequired: boolean
  /** true = a grammar concept of curriculum.ts carries this id in `expertReview` (its flag is raised per concept) */
  carriedByConcept: boolean
}

export const B1_DECISIONS: readonly B1Decision[] = [
  {
    id: 'D-1',
    title: 'A2→B1 boundary (Plusquamperfekt, Passiv, Konjunktiv II forms, Relativsatz at B1)',
    units: [21, 23, 24, 25, 29],
    implemented: 'allocated at B1 as in the dossier §3',
    consequence: 'if more than two of the ⚑ items are rejected the allocation must be reopened; up to 2–3 units move',
    fallback: 'reopen the allocation if more than two ⚑ items are rejected',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'D-2',
    title: '`obwohl` / `trotzdem` and the Relativsatz productive from Units 22 / 23',
    units: [22, 23],
    implemented: 'productive from Unit 22 (konzessive Sätze) and Unit 23 (Relativsätze Nominativ/Akkusativ)',
    consequence: 'possible early load for learners coming from A2',
    fallback: 'move one of the two concepts one unit later',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'D-3',
    title: 'Partizip I/II as adjective receptive; Futur I limited-productive',
    units: [26, 28],
    implemented: 'Partizip I only receptive (Unit 26); Futur I limited to conjecture with "wohl" (Unit 28)',
    consequence: 'Futur I may be under- or over-taught; the participle adjectives get no second exposure',
    fallback: 'drop Futur I to receptive',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'D-4',
    title: 'Konjunktiv II der Vergangenheit receptive only (Unit 31)',
    units: [31],
    implemented: 'glossed in one reading, never required in a task or a test (`receptiveOnly` metadata of Unit 31)',
    consequence: 'learners meet the form once; B1-style reading can contain it more often',
    fallback: 'remove from B1 entirely (B2) or promote to limited-productive',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'D-5',
    title: 'Passiv Perfekt receptive only',
    units: [24, 26],
    implemented: 'glossed in one reading of Unit 24, never required in a task or a test',
    consequence: 'the form "ist … worden" is understood but never produced',
    fallback: 'limited-productive in Unit 26',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'D-6',
    title: 'Plusquamperfekt + `nachdem` productive in Unit 29',
    units: [21, 29, 32],
    implemented: 'productive in Unit 29, recycled in Unit 32 and in `level-b1`; `nachdem` + Perfekt is already met in Unit 21',
    consequence: 'heavy for one unit; the fallback would also change the Unit 32 and level-test items',
    fallback: 'receptive first',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'D-7',
    title: 'Genitivattribute receptive-first; Genitiv-Präpositionen limited-productive (A1 only has an overview)',
    units: [22, 27, 29],
    implemented:
      'Genitiv-Präpositionen taught on a closed list (Unit 27); Genitivattribut receptive (Unit 29) and kept out of production items and examples',
    consequence: 'learners use Genitiv prepositions but never see Genitivattribute productively; examples were rewritten to avoid them',
    fallback: 'receptive only',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'D-8',
    title: 'Nomen-Verb-Verbindungen capped at 20; Zustandspassiv limited-productive',
    units: [30, 31],
    implemented: 'closed lists (20 expressions; ten participles for the Zustandspassiv)',
    consequence: 'a closed list can leave common expressions unexplained',
    fallback: 'receptive only (B2 boundary)',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'D-9',
    title: 'Mittelfeld as a Unit-32 systematisation (not a new system)',
    units: [32],
    implemented: 'concept `b1-satzbau-mittelfeld` with the role `revision`',
    consequence: 'the rules are used from Unit 21 but named only in Unit 32',
    fallback: 'demote to a revision list without a concept',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'D-10',
    title: '12-unit span with Unit 32 as consolidation',
    units: [32],
    implemented: 'implemented as proposed (Units 21–31 new content, Unit 32 consolidation without new grammar)',
    consequence: 'none known; the structure is complete',
    fallback: 'none',
    status: 'pending-owner',
    expertRequired: false,
    carriedByConcept: false,
  },
  {
    id: 'D-11',
    title: 'Text-length ramp (§5.2) and 38–42 new words per unit',
    units: [],
    implemented: 'texts 94–215 words; 40 words per unit; a clause-link progression floor per unit (P1 remediation)',
    consequence: 'the lengths and the clause density are the author’s calibration, not an exam-format judgement',
    fallback: "adjust per the reviewer's exam-format knowledge",
    status: 'pending-owner-and-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'D-12',
    title: 'Closed lists: Verb+Präposition (≈ 20) and Präteritum verbs (≈ 35)',
    units: [21, 28],
    implemented: 'lists authored by the project and used in productive items',
    consequence: 'unreviewed lists drive productive items',
    fallback: 'the reviewer supplies the final lists',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'D-13',
    title: 'Mediation covered by micro-tasks only',
    units: [26, 28, 31],
    implemented: 'three mediation micro-tasks of about 30 words',
    consequence: 'mediation is a real B1 skill and coverage is thin',
    fallback: 'defer mediation',
    status: 'pending-owner',
    expertRequired: false,
    carriedByConcept: false,
  },
  {
    id: 'D-14',
    title: 'Prerequisite policy: no gating, label "recommended after A2"',
    units: [],
    implemented: 'no gating; no placement check before Unit 21',
    consequence: 'an A1 learner can open B1',
    fallback: 'gate by a readiness check',
    status: 'pending-owner',
    expertRequired: false,
    carriedByConcept: false,
  },
  {
    id: 'X-1',
    title:
      'Placement of `lassen` (P-lim) and receptive `sich lassen` — dossier ⚑ item 13 (it has no D-number; the flag was mislabelled D-1)',
    units: [26],
    implemented: 'productive "etwas reparieren lassen" on a closed list of six; `sich lassen` receptive',
    consequence: 'B1/B2 placement of the productive use is unconfirmed',
    fallback: 'receptive only',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: true,
  },
  {
    id: 'X-2',
    title: 'Extra connector `zweitens` in the closed connector list of Unit 30',
    units: [30],
    implemented: 'added to the closed list during authoring',
    consequence: 'the list is larger than the dossier states',
    fallback: 'remove it from the list',
    status: 'pending-owner-and-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'X-3',
    title: 'The micro-task kind `note` is reused for several different tasks',
    units: [28, 29, 30, 31, 32],
    implemented: 'kind `note` for invitations, notices, excuses, a learning diary',
    consequence: 'learners and reports cannot tell the task types apart',
    fallback: 'introduce dedicated micro-task kinds (a shared-type change)',
    status: 'pending-owner',
    expertRequired: false,
    carriedByConcept: false,
  },
  {
    id: 'X-4',
    title: 'The unauthored "Widerspruch" writing alternative of Unit 31',
    units: [31],
    implemented: 'not authored (needs the Nomen-Verb decision D-8 first)',
    consequence: 'no writing task on objecting to a decision',
    fallback: 'author it after D-8 is decided',
    status: 'pending-owner-and-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'X-5',
    title: 'Legal / administrative review of the fictional Unit 31 scenarios',
    units: [31],
    implemented:
      'every deadline and condition is attributed to a fictional document ("laut diesem Schreiben"); no real office, law or advice',
    consequence: 'a sentence could still be read as a rule of German administration',
    fallback: 'a qualified reviewer checks the attribution formulas',
    status: 'pending-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'X-6',
    title:
      'Form `b1-level-v2` of the final assessment: 60 items (approved plan: 40), 50 % per part (approved: 40 %), uncalibrated 55 % "almost" band',
    units: [],
    implemented: '60 items, part threshold 50 %, bands qualified "по проверенным частям"; listening not assessed for a technical reason',
    consequence: 'the size and thresholds deviate from the approved plan and are unvalidated',
    fallback: 'return to 40 items / 40 % or recalibrate after a learner pilot',
    status: 'pending-owner-and-expert',
    expertRequired: true,
    carriedByConcept: false,
  },
  {
    id: 'X-7',
    title: 'The additive `levelTest` mechanism (`LevelResultCard`, `evaluateLevel`) as the permanent design for level tests',
    units: [],
    implemented: 'optional `levelTest` content field; A1/A2 behaviour unchanged',
    consequence: 'a second level-test path exists next to the legacy mixed quiz',
    fallback: 'fold it into the shared test architecture',
    status: 'pending-owner',
    expertRequired: false,
    carriedByConcept: false,
  },
]
