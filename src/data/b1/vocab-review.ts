/**
 * P2 review registers (audit §9 item 5). DATA ONLY — nothing here changes what a learner sees, and nothing here is part of the lazy B1 content.
 *
 * 1. `KY_COLLISION_ANALYSIS`: the six Kyrgyz glosses that equal an A1/A2 gloss of a DIFFERENT German word (listed in glossary.ts). `source` says why the two entries share a gloss; `distinguishable` whether the German
 *    words can be told apart in Kyrgyz at all; `question` is the exact question for a native reviewer. NOTHING was changed: no Kyrgyz word was invented, and the A1/A2 entries (out of scope) were not touched.
 * 2. `B1_VOCAB_GAPS`: a CLASSIFICATION of the thematic words the audit found missing from the 1083-word A1–B1 lists. It adds NO word. Teaching one means swapping an entry of a unit (each has exactly 40), a
 *    content decision for the owner; the author must not enlarge the vocabulary only to cover a word. `seenIn` lists the texts in which the word already occurs (verified by a test); `proposed` is a PROPOSAL
 *    of the proficiency (P = productive, R = receptive).
 */
export interface KyCollisionAnalysis {
  id: string
  source: 'same-root-derivation' | 'near-synonyms' | 'a2-gloss-doubtful' | 'one-kyrgyz-verb-for-two-german-verbs'
  distinguishable: 'not-needed' | 'unknown-native-review'
  question: string
  status: 'native-review-pending'
}
export const KY_COLLISION_ANALYSIS: readonly KyCollisionAnalysis[] = [
  {
    id: 'v21-11',
    source: 'same-root-derivation',
    distinguishable: 'unknown-native-review',
    question:
      'Begegnung (встреча, знакомство) and sich treffen both use "жолугушуу". The Russian gloss of Begegnung also says "знакомство": does Kyrgyz need a second word for the acquaintance sense?',
    status: 'native-review-pending',
  },
  {
    id: 'v21-27',
    source: 'near-synonyms',
    distinguishable: 'not-needed',
    question:
      'zunächst ("поначалу") and zuerst ("сначала") are near-synonyms in German; is one Kyrgyz word "адегенде" acceptable for both?',
    status: 'native-review-pending',
  },
  {
    id: 'v26-10',
    source: 'a2-gloss-doubtful',
    distinguishable: 'unknown-native-review',
    question:
      'Werbung = "жарнама" (advertising) is natural. The A2 entry Anzeige (объявление) has the same gloss, and its example says "Мен жарнаманы интернеттен окудум": is "жарнама" right for an announcement that one reads? (A2 content was not touched.)',
    status: 'native-review-pending',
  },
  {
    id: 'v26-37',
    source: 'one-kyrgyz-verb-for-two-german-verbs',
    distinguishable: 'not-needed',
    question:
      'überprüfen (verb) and Untersuchung (noun, medical/inspection sense) share "текшерүү" — the Kyrgyz verbal noun doubles as the noun. Is that natural for both senses?',
    status: 'native-review-pending',
  },
  {
    id: 'v27-23',
    source: 'a2-gloss-doubtful',
    distinguishable: 'unknown-native-review',
    question:
      'Rabatt = "арзандатуу" (discount) is natural. The A2 entry Angebot (предложение, акция) has the same gloss and, unlike Rabatt, no Kyrgyz example sentence: is "арзандатуу" right for Angebot / акция? (A2 content was not touched.)',
    status: 'native-review-pending',
  },
  {
    id: 'v27-33',
    source: 'one-kyrgyz-verb-for-two-german-verbs',
    distinguishable: 'unknown-native-review',
    question:
      'ersetzen (заменить) and umtauschen (обменять) both use "алмаштыруу". Does Kyrgyz distinguish "replace" from "exchange" in a shop context, and is a second verb needed?',
    status: 'native-review-pending',
  },
]

/** Observation outside B1: two A2 entries involved above have NO Kyrgyz example sentence. A2 content is out of scope; recorded for the owner. */
export const A2_ENTRIES_WITHOUT_KY_EXAMPLE: readonly string[] = ['v9-13', 'v9-6']

export type VocabGapCategory = 'essential-thematic' | 'useful-receptive' | 'optional' | 'out-of-scope-by-design'
export interface VocabGap {
  word: string
  /** the unit whose topic needs it (0 = none) */
  topicUnit: number
  category: VocabGapCategory
  proposed: 'P' | 'R' | '-'
  seenIn: string[]
  note: string
  status: 'pending-owner'
}
const gap = (
  word: string,
  topicUnit: number,
  category: VocabGapCategory,
  proposed: 'P' | 'R' | '-',
  seenIn: string[],
  note: string,
): VocabGap => ({
  word,
  topicUnit,
  category,
  proposed,
  seenIn,
  note,
  status: 'pending-owner',
})
export const B1_VOCAB_GAPS: readonly VocabGap[] = [
  gap(
    'Medien',
    26,
    'essential-thematic',
    'P',
    [],
    'the key word of the topic of Unit 26 ("Medien, Technik und Nachrichten"); only the compound "Medienthema" occurs in the unit',
  ),
  gap(
    'Grund',
    22,
    'essential-thematic',
    'P',
    ['b1-re-30-02'],
    'argumentation (Units 22 and 30: "ein guter Grund"); occurs once in a reading, unglossed',
  ),
  gap('Folge', 30, 'essential-thematic', 'P', [], 'cause and consequence: Unit 30 teaches the consecutive connectors but not the noun'),
  gap('Wunsch', 27, 'essential-thematic', 'P', [], 'Unit 27 teaches "Ich wünschte, …" and wishes with Konjunktiv II; the noun is missing'),
  gap(
    'Zukunft',
    28,
    'essential-thematic',
    'P',
    ['b1-re-28-02', 'b1-li-30-01'],
    'topic word of Unit 28 ("Zukunftspläne"); occurs in two texts, unglossed',
  ),
  gap(
    'Gefühl',
    25,
    'essential-thematic',
    'P',
    [],
    'feelings and relationships (Units 21, 25): many adjectives of feeling are taught, not the noun',
  ),
  gap('Ursache', 30, 'useful-receptive', 'R', [], 'near-synonym of Grund; receptive is enough'),
  gap('Chance', 23, 'useful-receptive', 'R', [], 'work and career (Unit 23); an international word'),
  gap(
    'Vergleich',
    22,
    'useful-receptive',
    'R',
    ['b1-re-22-01', 'b1-re-29-01', 'b1-li-29-02'],
    'only as the glossed phrase "im Vergleich zu"; the verb vergleichen is taught in Unit 22',
  ),
  gap(
    'Freiwillige',
    30,
    'useful-receptive',
    'R',
    ['b1-re-30-01', 'b1-li-30-01'],
    'the topic of Unit 30 is volunteering; the noun occurs in two texts but is not listed',
  ),
  gap('Konflikt', 25, 'optional', 'R', [], 'Streit and Missverständnis (Unit 25) already cover the situations'),
  gap('Interview', 26, 'optional', 'R', [], 'an international word, understood without teaching'),
  gap('Bewertung', 29, 'optional', 'R', [], 'the compound "Hotelbewertung" and the verb bewerten (Unit 26) are taught'),
  gap('Absicht', 0, 'optional', 'R', [], 'sich vornehmen and Vorsatz (Unit 32) cover it'),
  gap('Zweck', 0, 'optional', 'R', [], 'um … zu / damit already express purpose (Units 23, 30)'),
  gap('Symptom', 25, 'optional', 'R', [], 'Beschwerden is taught (Unit 25)'),
  gap('Bewegung', 25, 'optional', 'R', [], 'Sport and Ausgleich cover the topic'),
  gap(
    'Gesetz',
    31,
    'out-of-scope-by-design',
    '-',
    [],
    'the course makes no legal claims and teaches no law (Unit 31 attributes every rule to a fictional document)',
  ),
  gap('Politik', 0, 'out-of-scope-by-design', '-', [], 'no claims about real politics; kept out of a Beta without expert review'),
  gap('Regierung', 0, 'out-of-scope-by-design', '-', [], 'as Politik'),
  gap('Wirtschaft', 0, 'out-of-scope-by-design', '-', [], 'as Politik'),
  gap('Religion', 0, 'out-of-scope-by-design', '-', [], 'sensitive; not needed for the approved topics'),
  gap(
    'Wahl',
    0,
    'out-of-scope-by-design',
    '-',
    ['b1-re-22-01'],
    'the political sense is out of scope; "die bessere Wahl" occurs once in a reading (the everyday sense)',
  ),
]
