/**
 * The B1 RU/KY terminology glossary (P1 remediation of the final audit, B1_FINAL_AUDIT.md §5 and §9 item 4 "glossary first").
 *
 * PURPOSE: one place that fixes how the recurring grammar terms are written in the Russian and Kyrgyz explanations of Units 21–32, so that a native reviewer corrects each term ONCE and the course does not drift.
 * Every entry records the wording the course ALREADY uses most (the dominant form); nothing here is a new grammatical term and none is invented. All of it is an AI-assisted draft:
 * `review: 'native-pending'` means that no native speaker has confirmed the term; `uncertain` marks a wording the author is not sure about. The regression test `tests/b1/glossary.test.ts` keeps the
 * course consistent with this list (the `avoid*` patterns must not occur in any B1 explanation).
 */
export interface GlossaryTerm {
  /** the German term (kept in Latin script in both languages whenever the course writes it so) */
  de: string
  /** how the Russian explanations write it */
  ru: string
  /** how the Kyrgyz explanations write it */
  ky: string
  /** Russian variants that must NOT appear (a competing wording used earlier) */
  avoidRu?: RegExp[]
  /** Kyrgyz variants that must NOT appear */
  avoidKy?: RegExp[]
  /** English note for reviewers */
  note: string
  review: 'native-pending'
  /** true = the author is unsure whether this wording is the best one; to be decided by a native speaker */
  uncertain: boolean
}

export const B1_GLOSSARY: readonly GlossaryTerm[] = [
  {
    de: 'Nebensatz',
    ru: 'придаточное предложение / придаточная часть',
    ky: 'кошумча бөлүк',
    avoidKy: [/[Кк]ошумча сүйлөм/],
    note: 'Both Russian wordings occur and are accepted as synonyms (the clause is also called a "part" of the sentence); the Kyrgyz wording is "кошумча бөлүк" everywhere (54 uses). "кошумча сүйлөм" (11 uses in Units 25, 28, 32 and the level test) was standardised to it.',
    review: 'native-pending',
    uncertain: true,
  },
  {
    de: 'Hauptsatz',
    ru: 'главная часть / главное предложение',
    ky: 'башкы бөлүк',
    avoidKy: [/[Бб]ашкы сүйлөм/],
    note: 'Kyrgyz "башкы бөлүк" (34 uses) is the pair of "кошумча бөлүк"; "башкы сүйлөм" (20 uses) was standardised to it so that the main and the subordinate clause use one noun.',
    review: 'native-pending',
    uncertain: true,
  },
  {
    de: 'Relativsatz',
    ru: 'Relativsatz (the German term); the pronoun: относительное местоимение',
    ky: 'Relativsatz',
    avoidRu: [/относительн\p{L}* предложен\p{L}*/u],
    note: 'The Russian explanations write the German term; "относительное предложение" (5 uses in Units 23 and 32) was standardised to it.',
    review: 'native-pending',
    uncertain: false,
  },
  {
    de: 'Passiv',
    ru: 'Passiv',
    ky: 'Passiv (with Kyrgyz case endings, e.g. Passivге)',
    avoidRu: [/пассив/i, /страдательн/i],
    note: 'The German term is used in Latin script (31 uses). Lower-case "пассив" (Units 24, 26) was standardised to "Passiv", and "актив" to "Aktiv".',
    review: 'native-pending',
    uncertain: false,
  },
  {
    de: 'Aktiv',
    ru: 'Aktiv',
    ky: 'Aktiv (with Kyrgyz case endings)',
    avoidRu: [/из актива/i],
    avoidKy: [/активден/i],
    note: 'Used together with "Passiv" in the Aktiv → Passiv explanations of Units 24 and 26.',
    review: 'native-pending',
    uncertain: false,
  },
  {
    de: 'Zustandspassiv / Vorgangspassiv',
    ru: 'Zustandspassiv / Vorgangspassiv',
    ky: 'Zustandspassiv / Vorgangspassiv (with case endings)',
    note: 'German terms in Latin script in both languages (Unit 31).',
    review: 'native-pending',
    uncertain: false,
  },
  {
    de: 'Partizip II',
    ru: 'Partizip II (the generic word причастие is used for the ten participles of the closed Zustandspassiv list)',
    ky: 'Partizip II (the generic word причастие is used for the ten participles of the closed list)',
    note: 'Latin "Partizip II" names the form; "причастие" (7 uses, Units 31 and 32) is the generic word for a participle in the closed list. Whether Kyrgyz should say "причастие" is uncertain.',
    review: 'native-pending',
    uncertain: true,
  },
  {
    de: 'Konjunktiv II',
    ru: 'Konjunktiv II',
    ky: 'Konjunktiv II (twice described as "шарттуу ыңгай" in Units 25 and 32)',
    avoidRu: [/сослагательн/i],
    note: 'Latin term in Russian (16 uses, never "сослагательное наклонение"). The two Kyrgyz descriptions "шарттуу ыңгай" are not a settled term and are left for native review.',
    review: 'native-pending',
    uncertain: true,
  },
  {
    de: 'Genitiv / Dativ / Akkusativ / Nominativ',
    ru: 'Genitiv / Dativ / Akkusativ / Nominativ',
    ky: 'Genitiv / Dativ / Akkusativ / Nominativ (with case endings, e.g. Dativде)',
    note: 'German case names in Latin script everywhere.',
    review: 'native-pending',
    uncertain: false,
  },
  {
    de: 'Plusquamperfekt, Futur I, Präteritum, Perfekt',
    ru: 'the German tense name',
    ky: 'the German tense name',
    note: 'Tense names are always German.',
    review: 'native-pending',
    uncertain: false,
  },
  {
    de: 'Satzklammer, Mittelfeld, TeKaMoLo',
    ru: 'the German term; "порядок слов" for word order in general',
    ky: 'the German term; "сүйлөмдүн ортосундагы сөз иретти" for word order in the middle of the sentence',
    note: 'Unit 32 introduces these terms; the Kyrgyz paraphrase for the Mittelfeld is the author\'s own wording and is uncertain.',
    review: 'native-pending',
    uncertain: true,
  },
  {
    de: 'Verbposition (zweite Stelle / Satzende)',
    ru: 'глагол на втором месте / глагол в конце',
    ky: 'этиш экинчи орунда / этиш эң аягында',
    note: 'The dominant fixed phrases of the word-order explanations (Russian 18 + 19 uses; Kyrgyz 21 + 38 uses).',
    review: 'native-pending',
    uncertain: false,
  },
]

/**
 * Kyrgyz glosses that need a native look. NOT confirmed errors: the audit found B1 words whose Kyrgyz gloss equals the gloss of a DIFFERENT A1/A2 word. In every case below the B1 gloss is defensible; the doubtful
 * gloss is on the A2 side (A2 content is out of scope and was not touched). Kept as data so that a test fails when the situation changes and the list is re-reviewed.
 */
export interface KyGlossCollision {
  /** B1 vocabulary id and word */
  id: string
  de: string
  ky: string
  /** the A1/A2 word with the identical Kyrgyz gloss */
  equalTo: { id: string; de: string }
  note: string
}
export const KY_GLOSS_COLLISIONS_WITH_A2: readonly KyGlossCollision[] = [
  { id: 'v21-11', de: 'Begegnung', ky: 'жолугушуу', equalTo: { id: 'v12-28', de: 'sich treffen' }, note: 'noun vs verb of the same root; acceptable' },
  { id: 'v21-27', de: 'zunächst', ky: 'адегенде', equalTo: { id: 'v11-29', de: 'zuerst' }, note: 'near-synonyms; acceptable' },
  { id: 'v26-10', de: 'Werbung', ky: 'жарнама', equalTo: { id: 'v13-1', de: 'Anzeige' }, note: '"жарнама" = advertising, correct for Werbung; the A2 gloss of Anzeige (объявление) is doubtful — A2 not touched' },
  { id: 'v26-37', de: 'überprüfen', ky: 'текшерүү', equalTo: { id: 'v14-30', de: 'Untersuchung' }, note: '"текшерүү" = check; acceptable for both senses' },
  { id: 'v27-23', de: 'Rabatt', ky: 'арзандатуу', equalTo: { id: 'v9-13', de: 'Angebot' }, note: '"арзандатуу" = discount, correct for Rabatt; the A2 gloss of Angebot (предложение, акция) is doubtful — A2 not touched' },
  { id: 'v27-33', de: 'ersetzen', ky: 'алмаштыруу', equalTo: { id: 'v9-6', de: 'umtauschen' }, note: 'replace / exchange are one verb in Kyrgyz; acceptable' },
]
/** Pairs of B1 words (noun + verb of one root) that share one Kyrgyz gloss — legitimate derivation, listed for the native reviewer. */
export const KY_GLOSS_DERIVED_PAIRS: readonly [string, string][] = [
  ['v22-38', 'v30-23'], // unterstützen / Unterstützung
  ['v25-6', 'v25-35'], // Behandlung / behandeln
  ['v27-6', 'v27-31'], // Rückgabe / zurückgeben
  ['v28-14', 'v28-33'], // Konzentration / sich konzentrieren
  ['v31-6', 'v31-31'], // Bestätigung / bestätigen
]
