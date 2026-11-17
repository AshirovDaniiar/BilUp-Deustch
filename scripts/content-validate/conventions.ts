// A2 authoring ID conventions (Stage 6B) — the machine-readable form of docs/authoring/A2_AUTHORING_GUIDE.md §2.
// A test keeps the guide and this file in agreement.
//
// IMPORTANT: an id is only a NAME. Identity, ownership and behaviour come from explicit metadata (`unit`, `kind`, `level`, `size`…); the
// application never parses an id. The conventions exist so ids are predictable, never collide across levels and show their owner at a glance.
// `p` is the level prefix in lower case (`a2`); `u` is the unit id (11–20).

export interface Convention {
  /** human-readable form, as shown in messages and the guide */
  form: string
  re: RegExp
}

const num = '[1-9]\\d*'
const kebab = '[a-z0-9]+(?:-[a-z0-9]+)*'

export const conventions = (p: string) => ({
  unitKey: { form: `${p}-<slug>`, re: new RegExp(`^${p}-[a-z]+(?:-[a-z]+)*$`) } as Convention,
  vocabulary: (u: number): Convention => ({ form: `v${u}-<n>`, re: new RegExp(`^v${u}-${num}$`) }),
  grammar: { form: `${p}-<kebab-case>`, re: new RegExp(`^${p}-${kebab}$`) } as Convention,
  exercise: (u: number): Convention => ({ form: `${p}-ex-${u}-<nn>`, re: new RegExp(`^${p}-ex-${u}-\\d{2}$`) }),
  articleDrill: (u: number): Convention => ({ form: `art-v${u}-<n>`, re: new RegExp(`^art-v${u}-${num}$`) }),
  listening: (u: number): Convention => ({ form: `${p}-li-${u}-<nn>`, re: new RegExp(`^${p}-li-${u}-\\d{2}$`) }),
  reading: (u: number): Convention => ({ form: `${p}-re-${u}-<nn>`, re: new RegExp(`^${p}-re-${u}-\\d{2}$`) }),
  writing: (u: number): Convention => ({ form: `${p}-wr-${u}-<nn>`, re: new RegExp(`^${p}-wr-${u}-\\d{2}$`) }),
  speaking: { form: `${p}-sp-<unit>-<nn>`, re: new RegExp(`^${p}-sp-\\d{2}-\\d{2}$`) } as Convention,
  unitTest: (u: number): Convention => ({ form: `unit-${u}`, re: new RegExp(`^unit-${u}$`) }),
  levelTest: { form: `level-${p}`, re: new RegExp(`^level-${p}$`) } as Convention,
  placementTest: { form: `placement-${p}`, re: new RegExp(`^placement-${p}$`) } as Convention,
  finalQuestion: (u: number): Convention => ({ form: `${p}-ft-${u}-<nn>`, re: new RegExp(`^${p}-ft-${u}-\\d{2}$`) }),
  placementItem: { form: `${p}-pl-<nn>`, re: new RegExp(`^${p}-pl-\\d{2}$`) } as Convention,
  tutorTemplate: { form: `${p}-tt-<kebab-case>`, re: new RegExp(`^${p}-tt-${kebab}$`) } as Convention,
  instruction: { form: `${p}-in-<kebab-case>`, re: new RegExp(`^${p}-in-${kebab}$`) } as Convention,
})
