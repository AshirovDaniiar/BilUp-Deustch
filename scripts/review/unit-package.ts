// Generates the independent-review packages of a unit FROM THE REAL DATA (so a package can never differ from the shipped content).
//   cefrPackage(11)  → German content + context for a qualified German teacher (CEFR A2 suitability)
//   kyPackage(11)    → every Kyrgyz field with its source, for a native reviewer to approve or correct field by field
// Output is plain Markdown. Nothing here records a review or approval: the tables have EMPTY decision columns.
// Generated files: docs/review/A2_UNIT11_CEFR_REVIEW_PACKAGE.md, docs/review/A2_UNIT11_KY_REVIEW_PACKAGE.md (npm run review:package).
import { createHash } from 'node:crypto'
import { A2_CONTENT } from '../../src/data/a2/a2-content'
import { UNIT_11_RECEPTIVE_WORDS } from '../../src/data/a2/vocabulary'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import {
  exercisesForUnit,
  finalTestOfUnit,
  grammarForUnit,
  grammarIndex,
  listeningForUnit,
  readingForUnit,
  registerLevelContent,
  speakingIndex,
  speakingForUnit,
  unitById,
  vocabularyForUnit,
  whyNotesOf,
  writingForUnit,
} from '../../src/data/catalog'

registerLevelContent('A2', A2_CONTENT)

const cell = (s: string | undefined) => (s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
const row = (...c: (string | undefined)[]) => `| ${c.map(cell).join(' | ')} |`
const table = (head: string[], rows: (string | undefined)[][]) =>
  [row(...head), row(...head.map(() => '---')), ...rows.map(r => row(...r))].join('\n')
const opt = (q: { options: string[]; answer: string | number }) =>
  q.options.map((o, i) => `${'ABC'[i]}) ${o}${(typeof q.answer === 'number' ? i === q.answer : o === q.answer) ? ' ✔' : ''}`).join(' · ')

export const PACKAGE_FILES = {
  cefr: 'docs/review/A2_UNIT11_CEFR_REVIEW_PACKAGE.md',
  ky: 'docs/review/A2_UNIT11_KY_REVIEW_PACKAGE.md',
} as const

/** Footer identifying exactly which content a review refers to: the reviewer copies it into the tracker. */
const withFingerprint = (body: string): string => {
  const fp = createHash('sha256').update(body).digest('hex').slice(0, 12)
  const note =
    'a hash of everything above; if the content changes and the package is regenerated, the fingerprint changes. Write it in the tracker so it is clear which version was reviewed.'
  return [body, '---', '', '**Package fingerprint: `' + fp + '`** (' + note + ')', ''].join('\n')
}

const GENERATED =
  'GENERATED FILE — produced by `npm run review:package` from the shipped Unit 11 data. Do not edit by hand; edit the data and regenerate.'

// ───────────────────────────── CEFR package ─────────────────────────────
export function cefrPackage(unitId = 11): string {
  const unit = unitById(unitId)!
  const vocab = vocabularyForUnit(unitId)
  const grammar = grammarForUnit(unitId)
  const exercises = exercisesForUnit(unitId)
  const listening = listeningForUnit(unitId)
  const reading = readingForUnit(unitId)
  const writing = writingForUnit(unitId)[0]
  const scenario = speakingIndex.get(speakingForUnit(unitId) ?? '')!
  const final = finalTestOfUnit(unitId)!
  const receptive = new Set(UNIT_11_RECEPTIVE_WORDS)
  const out: string[] = []
  const h = (s: string) => out.push('', s, '')
  const p = (s: string) => out.push(s)

  out.push(`# Unit 11 — CEFR A2 review package (for a qualified German teacher)`, '', `<!-- ${GENERATED} -->`, '')
  p(
    `**Unit:** ${unitId} · \`${unit.key}\` · *${unit.title}* · pilot unit of the A2 course of BilUp Til (German for speakers of Russian and Kyrgyz).`,
  )
  p(
    `**Status:** AI-assisted original material, **not yet reviewed by any person**. Your review decides whether Unit 11 can serve as the template for Units 12–20.`,
  )
  p(
    `**What we ask:** judge whether each part is *genuinely CEFR A2* (not A1 with a label, not B1), whether it is natural German, and whether it teaches what it claims. Use the decision tables in this document and in \`docs/review/A2_UNIT11_REVIEW_TRACKER.md\`. Everything below is the content as it is shipped (generated from the data).`,
  )

  h('## 1. Context you need')
  p(
    `* **Learners:** adults, A1 completed, mother tongue Russian and/or Kyrgyz (explanations are given in those languages; you will see only German here, plus short English reviewer summaries marked *[reviewer summary]*, which are not learner content).`,
  )
  p(
    `* **What A1 of this course already taught** (checked in the A1 data): Perfekt basics with haben/sein (A1 unit 8: regular and irregular Partizip II, separable prefixes, motion → sein); \`und, aber, oder, denn, weil\` (A1 unit 6; \`weil\` with verb at the end, present tense); modal verbs möchten/können/müssen with infinitive at the end (A1 unit 4); W-questions, separable verbs, Akkusativ/Dativ, time and dates.`,
  )
  p(
    `* **Not taught before this unit:** Präteritum of any verb, \`dass\`, \`seit\`/\`vor\` as time expressions, reflexive verbs in Perfekt, sequence adverbs (zuerst … schließlich).`,
  )
  p(
    `* **Unit structure:** vocabulary → grammar (3 concepts) → listening (2) → reading (2) → speaking (1) → writing (1) → revision (8 exercises) → final test (15 questions, authored separately from the exercises). Pass mark 70 %.`,
  )

  h('## 2. Learning objectives  *[reviewer summary]*')
  p(`After the unit the learner can:`)
  p(`1. Introduce themselves in more detail: where they grew up, education, work, moves.`)
  p(
    `2. Describe personal experiences and past events (Perfekt), and describe what a past situation was like (Präteritum of sein, haben, modal verbs).`,
  )
  p(`3. Describe achievements and changes (bestehen, erreichen, sich verändern, mutiger geworden).`)
  p(`4. Ask and answer questions about experience (*Hast du schon einmal …? — Noch nie.*, *Wo bist du aufgewachsen?*).`)
  p(`5. Connect events and give reasons: zuerst / danach / schließlich, \`weil\`, and \`dass\` after glauben / wissen / finden.`)

  h('## 3. Vocabulary inventory (37 items)')
  p(
    `"Recognition" = the learner must understand the word, but no task requires producing it (decision F4). Please mark any word that is not A2 (or not useful at A2).`,
  )
  p('')
  p(
    table(
      ['#', 'Word', 'Part of speech', 'Example (German)', 'Use', 'A2? ✔ / too high / too low / drop'],
      vocab.map((v, i) => [
        String(i + 1),
        `${v.article ? v.article + ' ' : ''}${v.de}${v.plural ? ' (Pl. ' + v.plural + ')' : ''}`,
        v.pos,
        v.example,
        receptive.has(v.de) ? 'recognition' : 'active',
        '',
      ]),
    ),
  )

  h('## 4. Grammar concepts')
  const summaries: Record<string, string> = {
    'a2-perfekt-erfahrungen':
      '[reviewer summary] Perfekt for personal experience: haben/sein in position 2 + Partizip II at the end; sein with motion and change of state (ziehen, aufwachsen, werden); no ge- after be-/ent-/er-/ver-/-ieren; separable verbs (abgeschlossen, umgezogen); time expressions vor + Dativ, im Jahr …, schon einmal, noch nie; seit + present tense for something that continues.',
    'a2-praeteritum-sein-haben-modal':
      '[reviewer summary] Präteritum only of sein, haben and the modal verbs können / wollen / müssen (war, hatte, konnte, wollte, musste) to describe what the past was like; all other verbs stay in Perfekt. Forms: ich/er same form; du -st; wir/sie -en.',
    'a2-ereignisse-verbinden':
      '[reviewer summary] Sequencing and reasons: zuerst / dann / danach / später / schließlich in position 1 (verb stays in position 2); `weil` clause with verb at the end (recalled from A1, now also with Perfekt auxiliary or modal at the end); `dass` only after Ich glaube / Ich weiß / Ich finde, simple present.',
  }
  for (const g of grammar) {
    out.push('', `### ${g.id}`, '')
    p(summaries[g.id])
    p('')
    p('**Examples**')
    for (const e of g.examples) p(`* ${e.de}${e.focus ? `  *(focus: ${e.focus})*` : ''}`)
    p('')
    p('**Typical mistakes taught (wrong → right)**')
    for (const m of g.mistakes) p(`* ✗ ${m.wrong}  →  ✔ ${m.right}`)
    p('')
    p('**Real-life sentences**')
    for (const e of g.reallife) p(`* ${e.de}`)
    p('')
    p('**Model dialogue**')
    for (const d of g.dialogue) p(`* **${d.speaker}:** ${d.text}`)
    p('')
    p(`**Speaking prompt sample:** ${g.speakPrompt.sample}`)
    p('')
    p(
      `| Judgement | A2 ✔ / too easy (A1) / too hard (B1) | Comment |\n| --- | --- | --- |\n| Rule and scope of this concept | | |\n| Examples natural and A2? | | |\n| Typical mistakes realistic? | | |`,
    )
  }

  h('## 5. Listening dialogues')
  for (const l of listening) {
    out.push('', `### ${l.id} — ${l.title}`, '')
    for (const x of l.lines) p(`* **${x.speaker}:** ${x.text}`)
    p('')
    p('**Questions** (✔ = intended answer)')
    l.questions.forEach((q, i) => p(`${i + 1}. ${q.q}  — ${opt(q)}`))
    p('')
    p(
      `| Judgement | Answer | Comment |\n| --- | --- | --- |\n| Level of language (A2?) | | |\n| Natural when spoken? | | |\n| Length / speed appropriate? | | |\n| Questions test comprehension, unambiguous? | | |`,
    )
  }

  h('## 6. Reading texts')
  for (const r of reading) {
    out.push('', `### ${r.id} — ${r.title}`, '')
    for (const para of r.body) p(para + '\n')
    p(`**Glossed words:** ${r.gloss.map(g => g.word).join(', ')}`)
    p('')
    p('**Questions** (✔ = intended answer)')
    r.questions.forEach((q, i) => p(`${i + 1}. ${q.q}  — ${opt(q)}`))
    p('')
    p(
      `| Judgement | Answer | Comment |\n| --- | --- | --- |\n| Level of language (A2?) | | |\n| Coherent, realistic context? | | |\n| Length appropriate? | | |\n| Questions unambiguous? | | |`,
    )
  }

  h('## 7. Speaking task')
  out.push(
    `**Scenario ${scenario.id} — ${scenario.title}.** [reviewer summary] The learner meets a language partner and tells their own story; the partner asks four questions. Learner hints and the keywords the app listens for are shown.`,
    '',
  )
  scenario.turns.forEach((t, i) => {
    p(`${i + 1}. **Partner:** ${t.ai}`)
    p(`   * Hints: ${t.hints.join(' / ')}`)
    p(`   * Keywords: ${t.keywords.join(', ')}`)
  })
  p('')
  p(
    `| Judgement | Answer | Comment |\n| --- | --- | --- |\n| Questions A2 and natural (du-register)? | | |\n| Hints sufficient for an A2 learner? | | |\n| Keywords reasonable as a scoring signal? | | |`,
  )

  h('## 8. Writing task')
  p(
    `**Task ${writing.id} — ${writing.title}.** [reviewer summary] A personal e-mail to a language partner in Germany (informal, at least ${writing.minWords} words): where I grew up, what I did after school, why I moved or what changed, what I am proud of, my goal.`,
  )
  p('')
  p('**Required elements checked by the app:** ' + writing.mustInclude.map(m => m.label).join(' · '))
  p('')
  p('**Model answer**')
  p('')
  p('> ' + writing.model)
  p('')
  p(
    `| Judgement | Answer | Comment |\n| --- | --- | --- |\n| Task is A2 (length ${writing.minWords}+ words, 7 elements)? | | |\n| Model answer is natural A2 German? | | |`,
  )

  h('## 9. Revision exercises (8, shown to learners after each unit)')
  p(
    table(
      ['id', 'type', 'concept', 'task (German)', 'answer', 'options / words'],
      exercises.map(e => [
        e.id,
        e.type,
        e.concept?.replace('a2-', '') ?? '',
        e.type === 'order' ? '(put the words in order)' : e.prompt,
        e.answer,
        e.type === 'order' ? (e.words ?? []).join(' ') : (e.options ?? []).join(' / '),
      ]),
    ),
  )

  h('## 10. Final test (15 questions, authored separately from the exercises)')
  p(
    `Skill: grammar 10 · vocabulary 3 · reading 2. Three options each; exactly one correct (✔). Please judge: is each item A2, is the key unambiguous, are the distractors plausible *errors* (not other correct answers)?`,
  )
  p('')
  p(
    table(
      ['id', 'skill', 'question (German)', 'options (✔ = key)', 'unambiguous? / A2?'],
      final.questions.map(q => [q.id, q.skill, q.prompt, opt(q), '']),
    ),
  )

  h('## 11. Decisions already taken (Stages 7A.1–7A.2) — F1–F11')
  p(`Please confirm or overrule each. *Applied* = already changed in the content you see above.`)
  p('')
  p(
    table(
      ['#', 'Question', 'Decision taken (author, not a CEFR authority)', 'Reviewer: confirm / overrule'],
      [
        ['F1', '`dass` clauses', 'Applied: `dass` only after glauben / wissen / finden; adjective + dass ("stolz, dass") removed.', ''],
        [
          'F2',
          'Verb-final Perfekt in subordinate clauses',
          'Applied: reading 2 simplified; `dass` + Perfekt removed. Kept: single `weil` + Perfekt (e.g. "…, weil ich Arbeit gefunden habe").',
          '',
        ],
        ['F3', 'Reflexive verbs in Perfekt (habe mich entschieden, hat sich verändert)', 'Kept.', ''],
        ['F4', 'Possibly advanced vocabulary', 'Applied: kept as recognition-only (see the "Use" column of §3).', ''],
        ['F5', 'Konjunktiv II look-alikes as wrong options', 'Applied: removed (also from all explanations).', ''],
        ['F6', 'du / Sie register', 'Kept; consistent within each text (interview = Sie, peer talk = du).', ''],
        ['F7', 'seit + present, vor + Dativ, schon einmal, noch nie', 'Kept.', ''],
        ['F8', 'Final-test item "Pizza mit Ananas"', 'Kept (low relevance to the theme).', ''],
        ['F9', 'Years in the texts (2018, 2022, 2023)', 'Kept.', ''],
        [
          'F10',
          'Modal at the end of a weil clause ("…, weil ich dort studieren wollte")',
          'Kept (A1 already shows "weil … arbeiten möchte").',
          '',
        ],
        ['F11', '`weil` already taught in A1', 'Applied: the A2 rule marks `weil` as revision from A1.', ''],
      ],
    ),
  )

  h('## 12. Remaining CEFR questions for the reviewer')
  const questions = [
    'Is `weil` + Perfekt / modal at the end of the clause (single subordinate clause) appropriate for A2, given `weil` + present is known from A1?',
    'Is `dass` after *Ich glaube / weiß / finde* acceptable as taught A2 grammar in this course, or should `dass` move to B1 / be removed from the unit?',
    'Is the Präteritum of sein, haben and modal verbs the right (and only) Präteritum scope for A2?',
    'Are reflexive verbs in Perfekt (sich entscheiden, sich verändern) acceptable, and does the unit need to *teach* the reflexive pronoun position?',
    'Vocabulary: please list words that are too high or too low for A2 (§3); is the active/recognition split sensible?',
    'Is the sequence *zuerst – dann – danach – später – schließlich* the right A2 inventory (is *schließlich* too advanced)?',
    'Texts: are the reading texts (≈70–90 words) and dialogues (≈100–125 words) the right length and density for A2?',
    'Listening 2 is an interview using *Sie* with some institutional language ("Herzlichen Glückwunsch", "in dieser Zeit") — is the register and density A2?',
    'Writing task: ≥ 60 words with 7 required elements — realistic for A2?',
    'Assessment: are the final-test items valid at A2 (three options, plausible distractors, unambiguous keys)? Any item that should be removed or replaced?',
    'Does the unit avoid B1 constructions (Passiv, Relativsatz, Konjunktiv II, Plusquamperfekt, Genitiv, obwohl/damit/nachdem)? Please list any you find.',
    'Overall: is Unit 11 a good TEMPLATE for the remaining nine A2 units (depth, balance, assessment design)? What should change in the template before it is reused?',
  ]
  questions.forEach((q, i) => p(`${i + 1}. ${q}\n   * Answer / comment: `))

  h('## 13. Overall recommendation (to be filled in by the reviewer)')
  p(
    `| | |\n| --- | --- |\n| Overall CEFR A2 suitability | ☐ approved ☐ approved with changes ☐ changes required ☐ rejected |\n| Template for Units 12–20 | ☐ yes ☐ yes, after the changes listed ☐ no |\n| Reviewer name / qualification | |\n| Date | |\n\nRecord the formal outcome in \`docs/review/A2_UNIT11_REVIEW_TRACKER.md\`.`,
  )
  return withFingerprint(out.join('\n') + '\n')
}

// ───────────────────────────── Kyrgyz package ─────────────────────────────
type Field = { id: string; de?: string; ru?: string; ky: string }

function kyFields(unitId: number): { section: string; fields: Field[] }[] {
  const unit = unitById(unitId)!
  const sections: { section: string; fields: Field[] }[] = []
  const add = (section: string, fields: Field[]) => sections.push({ section, fields })

  add(
    '1. Learning instructions',
    A2_INSTRUCTIONS.filter(i => i.unit === unitId).map(i => ({ id: i.id, ru: i.text.ru, ky: i.text.ky })),
  )
  add('2. Unit title and subtitle', [{ id: 'unit-subtitle', de: unit.title, ru: unit.subtitle.ru, ky: unit.subtitle.ky ?? '' }])

  const grammar: Field[] = []
  for (const g of grammarForUnit(unitId)) {
    for (const k of ['title', 'summary', 'discover', 'why'] as const) grammar.push({ id: `${g.id} · ${k}`, ru: g[k].ru, ky: g[k].ky ?? '' })
    g.when.forEach((w, i) => grammar.push({ id: `${g.id} · when ${i + 1}`, ru: w.ru, ky: w.ky ?? '' }))
    g.examples.forEach((e, i) => grammar.push({ id: `${g.id} · example ${i + 1}`, de: e.de, ru: e.ru, ky: e.ky ?? '' }))
    g.mistakes.forEach((m, i) =>
      grammar.push({ id: `${g.id} · mistake ${i + 1} (✗ ${m.wrong} → ✔ ${m.right})`, ru: m.note.ru, ky: m.note.ky ?? '' }),
    )
    g.reallife.forEach((e, i) => grammar.push({ id: `${g.id} · real life ${i + 1}`, de: e.de, ru: e.ru, ky: e.ky ?? '' }))
    g.dialogue.forEach((d, i) => grammar.push({ id: `${g.id} · dialogue ${i + 1} (${d.speaker})`, de: d.text, ru: d.ru, ky: d.ky ?? '' }))
    grammar.push({ id: `${g.id} · speaking prompt`, ru: g.speakPrompt.prompt.ru, ky: g.speakPrompt.prompt.ky ?? '' })
  }
  add('3. Grammar explanations', grammar)

  const why: Field[] = []
  // a unit's package contains its own why-notes only (unit 12 notes live in the same level collection since Stage 7C)
  for (const n of whyNotesOf('A2').filter(x => grammarIndex.get(x.conceptId)?.unit === unitId)) {
    why.push({ id: `why · ${n.word} · sentence`, de: n.sentence, ru: n.ru, ky: n.ky ?? '' })
    why.push({ id: `why · ${n.word} · reason`, ru: n.reason.ru, ky: n.reason.ky ?? '' })
    n.more.forEach((m, i) => why.push({ id: `why · ${n.word} · more ${i + 1}`, de: m.de, ru: m.ru, ky: m.ky ?? '' }))
  }
  add('4. "Why?" notes', why)

  const vocab: Field[] = []
  for (const v of vocabularyForUnit(unitId)) {
    vocab.push({ id: `${v.id} · word`, de: `${v.article ? v.article + ' ' : ''}${v.de}`, ru: v.ru, ky: v.ky })
    vocab.push({ id: `${v.id} · example`, de: v.example, ru: v.exampleRu, ky: v.exampleKy ?? '' })
  }
  add('5. Vocabulary translations', vocab)

  const lis: Field[] = []
  for (const l of listeningForUnit(unitId))
    l.lines.forEach((x, i) => lis.push({ id: `${l.id} · line ${i + 1} (${x.speaker})`, de: x.text, ru: x.ru, ky: x.ky ?? '' }))
  add('6. Listening translations', lis)

  const rea: Field[] = []
  for (const r of readingForUnit(unitId)) {
    r.gloss.forEach((g, i) => {
      rea.push({ id: `${r.id} · gloss ${i + 1} · word (${g.word})`, de: g.word, ru: g.ru, ky: g.ky })
      rea.push({ id: `${r.id} · gloss ${i + 1} · grammar note`, de: g.example, ru: g.grammar, ky: g.grammarKy ?? '' })
    })
  }
  add('7. Reading glosses and grammar notes (the reading texts themselves are German only)', rea)

  const ex: Field[] = []
  for (const e of exercisesForUnit(unitId)) {
    ex.push({ id: `${e.id} · task`, de: e.type === 'order' ? e.answer : e.prompt, ru: e.promptRu, ky: e.promptKy ?? '' })
    ex.push({ id: `${e.id} · feedback`, ru: e.why.ru, ky: e.why.ky ?? '' })
  }
  add('8. Exercise tasks and feedback', ex)

  const ft: Field[] = []
  for (const q of finalTestOfUnit(unitId)!.questions) {
    ft.push({ id: `${q.id} · prompt`, de: q.prompt, ru: q.promptRu, ky: q.promptKy })
    ft.push({ id: `${q.id} · feedback`, ru: q.why.ru, ky: q.why.ky })
  }
  add('9. Final-test prompts and feedback', ft)

  const sc = speakingIndex.get(speakingForUnit(unitId) ?? '')!
  const sp: Field[] = [
    { id: `${sc.id} · title`, de: sc.title, ru: sc.titleRu, ky: sc.titleKy ?? '' },
    { id: `${sc.id} · goal`, ru: sc.goal.ru, ky: sc.goal.ky ?? '' },
    ...sc.turns.map((t, i): Field => ({ id: `${sc.id} · partner question ${i + 1}`, de: t.ai, ru: t.aiRu, ky: t.aiKy ?? '' })),
  ]
  const w = writingForUnit(unitId)[0]
  sp.push({ id: `${w.id} · situation`, ru: w.situation.ru, ky: w.situation.ky ?? '' })
  w.tips.forEach((t, i) => sp.push({ id: `${w.id} · tip ${i + 1}`, ru: t.ru, ky: t.ky ?? '' }))
  add('10. Speaking and writing guidance', sp)
  return sections
}

const OPEN_K: [string, string, string, string][] = [
  [
    'K4',
    'v11-33 word «geboren sein»',
    'туулган болуу',
    'туулуу (gloss "to be born"). The "…болуу" frame may be a calque of *geboren sein*.',
  ],
  [
    'K7',
    'v11-24 «schaffen»; reading a2-re-11-01 gloss 5',
    'аткара алуу, жөндөө / аткарган, жөндөгөн',
    'аткара алуу, жетишүү. *жөндөө* ("arrange / fix") may be a different meaning.',
  ],
  [
    'K8',
    'term «finite / conjugated verb» (concept 3, ex-11-08, ft-11-08, ft-11-09)',
    'жөндөлгөн этиш',
    'жакталган этиш. *жөндөлгөн* is the participle of noun declension.',
  ],
  ['K9', 'term «separable prefix» (ex-11-02 feedback)', 'ажыраган ab- приставкасы', 'one consistent term, e.g. бөлүнүүчү приставка'],
  ['K12', 'term «subordinate clause» (≈ 10 fields)', 'ээрчимелүү сүйлөм', 'confirm vs. the school-grammar term, e.g. багыныңкы сүйлөм'],
  ['K13', 'v11-26 «stolz»', 'сыймыктанган', 'сыймыктуу / сыймыктануу (the German word is an adjective, the gloss is a participle)'],
  [
    'K14',
    'register in dialogues (grammar dialogue 4 of concept 3; listening 2 line 4)',
    'анан … / андан кийин …',
    'choose one register per text',
  ],
  ['K16', 'v11-16 «umziehen», v11-36', 'көчүп кетүү', 'көчүп баруу where the sense is "to move to" (көчүп кетүү = move away)'],
  [
    'K18',
    'address form in instructions',
    'polite «-ңыз» used throughout',
    'confirm polite address is the intended standard for learner instructions (matches the existing Kyrgyz UI?)',
  ],
]

const APPLIED_K: [string, string, string][] = [
  ['K1', 'concept 2, example 5: «Биз көп иштеши керек болчубуз.»', '«Биз көп иштешибиз керек болчу.» — person agreement with *биз*'],
  ['K2', 'instruction a2-in-11-review: «жоопттон»', '«жооптон» — spelling'],
  ['K3', 'v11-33 example: «туулгамын»', '«туулганмын» — standard form (the gloss, K4, is open)'],
  ['K5', 'concept 1, real life 1: «иштегем»', '«иштегенмин» — full standard form'],
  ['K6', 'concept 1 dialogue 1; listening 1 line 1: «…өзү кайда/кайдан…»', '«өзү» (calque of *eigentlich*) dropped'],
  ['K10', 'instruction a2-in-11-vocabulary: «аттык сөздөрдү»', '«зат атоочторду»'],
  ['K11', 'why-note «sind»: «жайды өзгөртүү»', '«жашаган жерди өзгөртүү»'],
  ['K15', 'v11-37 «seit»: «бери»', '«бери (…дан/…ден бери)»'],
  ['K17', 'instruction a2-in-11-test: «эсептетүү үчүн»', '«эсептелиши үчүн»'],
]

export function kyPackage(unitId = 11): string {
  const out: string[] = []
  const p = (s: string) => out.push(s)
  out.push(`# Unit 11 — Kyrgyz review package (for a native Kyrgyz reviewer)`, '', `<!-- ${GENERATED} -->`, '')
  p(
    `**Unit:** ${unitId} · *${unitById(unitId)!.title}* — German as a foreign language, level A2, for Kyrgyz and Russian speakers. The Kyrgyz below is an **AI-assisted first draft; no native speaker has reviewed it**. The assistant's own second read (Stage 7A.1) and corrections (Stage 7A.2) are not approval.`,
  )
  p('')
  p(
    `**How to review.** Every learner-facing Kyrgyz field of the unit is listed with its German and/or Russian source. For each row mark **✔** (approve) or write a correction in the last column. German words and sentences inside Kyrgyz text must stay exactly as they are. Please judge: natural phrasing · grammar and spelling · consistent terminology · accuracy of the German grammar explanation · learner-friendliness (the learners are adults, level A2).`,
  )
  p('')
  p(
    `**Grammar terms.** *Perfekt, Präteritum, Partizip II, Dativ* are kept in Latin script on purpose; the rest of the terminology used in this unit is in §A. Please decide the open terms (§B) first — they affect many rows.`,
  )

  out.push('', '## A. Terminology used in the unit', '')
  p(
    table(
      ['German / concept', 'Kyrgyz term used', 'Reviewer: ✔ or replacement'],
      [
        ['past tense', 'өткөн чак', ''],
        ['auxiliary verb (haben/sein)', 'жардамчы этиш', ''],
        ['motion verb', 'кыймыл-аракет этиши', ''],
        ['modal verb', 'модалдык этиш', ''],
        ['conjunction', 'байламта', ''],
        ['main / subordinate clause', 'баш сүйлөм / ээрчимелүү сүйлөм (K12)', ''],
        ['conjugated (finite) verb', 'жөндөлгөн этиш (K8)', ''],
        ['separable prefix', 'ажыраган приставка (K9)', ''],
        ['prefix / ending / subject', 'приставка / мүчө / ээ', ''],
        ['noun', 'зат атооч (changed from «аттык сөз» in 7A.2)', ''],
        ['plural', 'көптүк сан', ''],
        ['unit (of the course)', 'бөлүм (matches the existing Kyrgyz UI)', ''],
        ['exam / internship', 'сынак / практика', ''],
      ],
    ),
  )

  out.push('', '## B. The nine unresolved items (K4, K7, K8, K9, K12, K13, K14, K16, K18)', '')
  p(`These were deliberately **left unchanged** because the assistant is not sure. Please decide each.`)
  p('')
  p(
    table(
      ['#', 'Where', 'Current text', 'Proposed (not applied)', 'Decision ✔ keep / use proposal / other', 'Comment'],
      OPEN_K.map(r => [...r, '', '']),
    ),
  )

  out.push('', '## C. Corrections already applied (Stage 7A.2) — please confirm', '')
  p(
    table(
      ['#', 'Was', 'Now', 'Confirmed ✔ / revert'],
      APPLIED_K.map(([k, was, now]) => [k, was, now, '']),
    ),
  )

  let n = 0
  for (const s of kyFields(unitId)) {
    out.push('', `## ${s.section}`, '')
    p(
      table(
        ['#', 'Field', 'German', 'Russian (source)', 'Kyrgyz (current)', '✔ / correction'],
        s.fields.map(f => [`${++n}`, f.id, f.de, f.ru, f.ky, '']),
      ),
    )
  }
  out.push('', '## Appendix — UI strings added in Stage 7A.2 (loading states)', '')
  p(`These three interface strings are not Unit 11 content but are also unreviewed Kyrgyz (key / Kyrgyz / Russian):`)
  p('')
  p(
    table(
      ['key', 'Kyrgyz', 'Russian', '✔ / correction'],
      [
        ['levelLoading', 'Деңгээлдин материалдары жүктөлүүдө…', 'Загружаем материалы уровня…', ''],
        [
          'levelLoadFailed',
          'Материалдарды жүктөө мүмкүн болгон жок. Интернетти текшерип, кайра аракет кылыңыз.',
          'Не удалось загрузить материалы. Проверьте подключение к интернету и попробуйте ещё раз.',
          '',
        ],
        [
          'levelLoadFailedAgain',
          'Дагы эле болгон жок. Ката кайталанса, баракты жаңыртыңыз.',
          'Всё ещё не получается. Если ошибка повторяется, обновите страницу.',
          '',
        ],
      ],
    ),
  )
  out.push('', `**Total fields in the table above: ${n}.**`, '', `Record the outcome in \`docs/review/A2_UNIT11_REVIEW_TRACKER.md\`.`)
  return withFingerprint(out.join('\n') + '\n')
}
