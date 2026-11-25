// A small, fully COMPLIANT synthetic A2 world used to prove the validator accepts valid A2 content and to give every rule a clean
// baseline to break. Test-only: this is not A2 learning content and it never ships (it is not imported by the application).
import { fullBundle } from '../../scripts/content-validate/bundle'
import type { ContentBundle } from '../../scripts/content-validate/types'
import type { A2FinalTest } from '../../src/data/a2/tests'
import type { A2PlacementItem, LearnerInstruction, TutorTemplate } from '../../src/data/a2/types'
import type {
  Exercise,
  GrammarConcept,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  SpeakingScenario,
  TestDef,
  VocabularyItem,
  WritingTask,
} from '../../src/data/types'

const l = (ru: string, ky: string) => ({ ru, ky })
const author = { kind: 'authored', author: 'Test Author' } as const

const unit: LearningUnit = {
  id: 11,
  key: 'a2-ueber-mich', // the planned stable key and the approved title of unit 11
  level: 'A2',
  title: 'Über mich und meine Erfahrungen',
  subtitle: l('Тестовый юнит', 'Сыноо бөлүмү'),
  icon: '🧭',
  grammarIds: ['a2-concept-one', 'a2-concept-two'],
}

const word = (n: number): VocabularyItem => ({
  id: `v11-${n}`,
  unit: 11,
  pos: 'noun',
  article: 'der',
  de: `Beispielwort${n}`,
  plural: `Beispielworte${n}`,
  ru: `слово номер ${n}`,
  ky: `${n}-сөз`,
  example: `Das ist ein Beispiel ${n}.`,
  exampleRu: `Это пример ${n}.`,
  exampleKy: `Бул ${n}-мисал.`,
  related: [],
})

const concept = (id: string, n: number): GrammarConcept => ({
  id,
  category: 'tenses',
  level: 'A2',
  unit: 11,
  title: l(`Тема ${n}`, `${n}-тема`),
  summary: l(`Кратко ${n}`, `Кыскача ${n}`),
  discover: l(`Вопрос ${n}`, `${n}-суроо`),
  why: l(`Потому что ${n}`, `Анткени ${n}`),
  when: [l(`Когда ${n}`, `Качан ${n}`)],
  examples: [{ de: 'Ich lerne heute Deutsch.', ru: 'Я сегодня учу немецкий.', ky: 'Мен бүгүн немис тилин үйрөнөм.' }],
  mistakes: [{ wrong: 'Ich lerne gestern.', right: 'Ich habe gestern gelernt.', note: l('Прошедшее время', 'Өткөн чак') }],
  reallife: [{ de: 'Ich arbeite in einem Büro.', ru: 'Я работаю в офисе.', ky: 'Мен кеңседе иштейм.' }],
  visual: 'none',
  dialogue: [{ speaker: 'A', text: 'Wie geht es dir?', ru: 'Как дела?', ky: 'Иштер кандай?' }],
  speakPrompt: { prompt: l('Скажите о себе.', 'Өзүңүз жөнүндө айтыңыз.'), sample: 'Ich heiße Anna.', keywords: ['heiße'] },
  source: author,
})

const listening: ListeningExercise = {
  id: 'a2-li-11-01',
  level: 'A2',
  unit: 11,
  title: 'Beim Arzt',
  keywords: ['Arzt'],
  lines: [
    {
      speaker: 'A',
      text: 'Guten Tag, wie kann ich helfen?',
      ru: 'Добрый день, чем могу помочь?',
      ky: 'Кайырлуу күн, эмне жардам бере алам?',
    },
    { speaker: 'B', text: 'Ich habe Kopfschmerzen.', ru: 'У меня болит голова.', ky: 'Менин башым ооруйт.' },
  ],
  questions: [
    { q: 'Was hat B?', options: ['Kopfschmerzen', 'Hunger', 'Durst'], answer: 0 },
    { q: 'Wer fragt?', options: ['B', 'A', 'Niemand'], answer: 1 },
    { q: 'Wo sind sie?', options: ['Zu Hause', 'Im Park', 'Beim Arzt'], answer: 2 },
  ],
  source: author,
}

const reading: ReadingText = {
  id: 'a2-re-11-01',
  level: 'A2',
  unit: 11,
  title: 'Mein Tag',
  body: [
    'Ich wohne in einer kleinen Stadt. Meine Wohnung hat zwei Zimmer und einen Balkon. Am Morgen trinke ich Kaffee und lese die Zeitung.',
    'Danach gehe ich zur Arbeit. Ich arbeite in einem Büro im Zentrum. Abends koche ich gern und sehe fern. Am Wochenende besuche ich meine Familie.',
  ],
  gloss: [
    {
      word: 'Balkon',
      ru: 'балкон',
      ky: 'балкон жайы',
      example: 'Der Balkon ist klein.',
      grammar: 'der Balkon',
      grammarKy: 'der Balkon (эркек род)',
      related: [],
    },
  ],
  questions: [
    { q: 'Wo wohnt die Person?', options: ['In einer Stadt', 'Auf dem Land', 'Im Ausland'], answer: 0 },
    { q: 'Was macht sie am Morgen?', options: ['Sie kocht', 'Sie trinkt Kaffee', 'Sie schläft'], answer: 1 },
  ],
  source: author,
}

const writing: WritingTask = {
  id: 'a2-wr-11-01',
  level: 'A2',
  unit: 11,
  title: 'Eine Nachricht',
  situation: l('Напишите сообщение другу.', 'Досуңузга билдирүү жазыңыз.'),
  formal: false,
  minWords: 20,
  mustInclude: [{ label: 'Gruß', patterns: ['hallo'] }],
  model: 'Hallo Paul, ich komme morgen um drei Uhr. Bis bald, Anna.',
  tips: [l('Начните с приветствия.', 'Саламдашуудан баштаңыз.')],
  source: author,
}

const speaking: SpeakingScenario = {
  id: 'a2-sp-11-01',
  title: 'Beim Arzt',
  titleRu: 'У врача',
  titleKy: 'Дарыгердин алдында',
  icon: '🩺',
  level: 'A2',
  goal: l('Опишите симптомы.', 'Белгилерди сүрөттөңүз.'),
  turns: [{ ai: 'Was fehlt Ihnen?', aiRu: 'Что с вами?', aiKy: 'Сизге эмне болду?', hints: ['Ich habe Fieber.'], keywords: ['fieber'] }],
  source: author,
}

const exercise = (n: number): Exercise => ({
  id: `a2-ex-11-0${n}`,
  type: 'fill',
  unit: 11,
  concept: 'a2-concept-one',
  prompt: `Ich ___ heute müde ${n}.`,
  answer: 'bin',
  options: ['bin', 'bist', 'ist'],
  promptRu: `Я сегодня устал ${n}.`,
  promptKy: `Мен бүгүн чарчадым ${n}.`,
  why: l('Глагол sein', 'sein этиши'),
})

const tests: TestDef[] = [
  { id: 'unit-11', title: l('Итоговый тест', 'Жыйынтык тест'), kind: 'topic', level: 'A2', unit: 11, size: 2 }, // NOT a `unit-<n>` id: identity is metadata
  { id: 'level-a2', title: l('Тест уровня', 'Деңгээл тести'), kind: 'level', level: 'A2', size: 15 },
]

const finalTests: A2FinalTest[] = [
  {
    unit: 11,
    questions: [
      {
        id: 'a2-ft-11-01',
        type: 'choice',
        prompt: 'Ich ___ müde.',
        promptRu: 'Я устал.',
        promptKy: 'Мен чарчадым.',
        options: ['bin', 'bist'],
        answer: 'bin',
        skill: 'grammar',
        why: l('Первое лицо', 'Биринчи жак'),
      },
      {
        id: 'a2-ft-11-02',
        type: 'choice',
        prompt: 'Du ___ hier.',
        promptRu: 'Ты здесь.',
        promptKy: 'Сен бул жерде.',
        options: ['bin', 'bist'],
        answer: 'bist',
        skill: 'grammar',
        why: l('Второе лицо', 'Экинчи жак'),
      },
    ] as unknown as A2FinalTest['questions'],
  },
]

const placement: A2PlacementItem[] = (['low', 'mid', 'high'] as const).map((band, i) => ({
  id: `a2-pl-0${i + 1}`,
  prompt: `Wir ___ hier ${i + 1}.`,
  promptRu: `Мы здесь ${i + 1}.`,
  promptKy: `Биз бул жерде ${i + 1}.`,
  options: ['sind', 'seid'],
  answer: 'sind',
  skill: 'grammar',
  band,
  why: l('Первое лицо множественного числа', 'Көптүк сандагы биринчи жак'),
})) as unknown as A2PlacementItem[]

const templates: TutorTemplate[] = [
  {
    id: 'a2-tt-explain-intro',
    kind: 'explain',
    text: l('Сейчас объясню тему {concept}.', '{concept} темасын азыр түшүндүрөм.'),
    placeholders: ['concept'],
  },
  { id: 'a2-tt-encourage', kind: 'encourage', unit: 11, text: l('У вас хорошо получается!', 'Сиз жакшы жасап жатасыз!') },
]

const instructions: LearnerInstruction[] = [
  {
    id: 'a2-in-listening',
    scope: 'listening',
    text: l('Послушайте диалог и ответьте на вопросы.', 'Диалогду уккула жана суроолорго жооп бергиле.'),
  },
  { id: 'a2-in-unit-eleven', scope: 'unit', unit: 11, text: l('Пройдите все разделы юнита.', 'Бөлүмдүн бардык бөлүктөрүн аткарыңыз.') },
]

/** A compliant A2 world on top of the real A1 content. `status` of the A2 level is configurable. */
export function validA2Bundle(status: 'planned' | 'beta' | 'released' = 'planned'): ContentBundle {
  const base = emptyA2Bundle()
  const course = (base.course ?? []).map(c =>
    c.id === 'A2' ? { ...c, status, releasedLocales: status === 'planned' ? [] : ['ru', 'ky'] } : c,
  )
  return {
    ...base,
    course,
    units: [...base.units, structuredClone(unit)],
    vocabulary: [...base.vocabulary, ...[1, 2, 3].map(word)],
    grammar: [...base.grammar, concept('a2-concept-one', 1), concept('a2-concept-two', 2)],
    exercises: [...base.exercises, ...[1, 2].map(exercise)],
    listening: [...base.listening, structuredClone(listening)],
    reading: [...base.reading, structuredClone(reading)],
    writing: [...base.writing, structuredClone(writing)],
    speaking: [...base.speaking, structuredClone(speaking)],
    tests: [
      ...base.tests,
      ...structuredClone(tests),
      {
        id: 'placement-a2',
        title: l('Тест на определение уровня A2', 'A2 деңгээлин аныктоо тести'),
        kind: 'placement',
        level: 'A2',
        size: 3,
      },
    ],
    whyNotes: [
      {
        sentence: 'Ich bin müde.',
        ru: 'Я устал.',
        ky: 'Мен чарчадым.',
        word: 'bin',
        reason: l('Первое лицо', 'Биринчи жак'),
        conceptId: 'a2-concept-one',
        more: [{ de: 'Du bist da.', ru: 'Ты здесь.', ky: 'Сен ошондосуң.' }],
      },
    ],
    placementItems: structuredClone(placement),
    tutorTemplates: structuredClone(templates),
    instructions: structuredClone(instructions),
    finalTests: structuredClone(finalTests),
    unitSpeaking: { ...base.unitSpeaking, A2: ['a2-sp-11-01'] },
    speakingLevels: { ...base.speakingLevels, 'a2-sp-11-01': 'A2' },
    reviews: { 11: { cefr: true, ru: true, ky: true, reviewer: 'Test Reviewer', date: '2026-01-01' } },
  }
}

export const clone = <T>(x: T): T => structuredClone(x)

/**
 * The shipped bundle with every A2 learning item removed: the A1 content, the course registry and the approved A2 unit PLAN, but no
 * authored A2 unit. Rule tests that need "an empty planned A2" or a clean base for a synthetic A2 world use this, so they never depend
 * on (or collide with) the real A2 content that is authored unit by unit. The real content is validated by the production tests.
 */
export function emptyA2Bundle(): ContentBundle {
  const b = withoutB1Content(structuredClone(fullBundle()))
  const a2 = b.course?.find(c => c.id === 'A2')
  const ranges = a2 ? [a2.unitIdRange, ...(a2.extraUnitIdRanges ?? [])] : [[11, 20] as const]
  const outside = (unit: number) => !ranges.some(([first, last]) => unit >= first && unit <= last)
  const a2Concepts = new Set(b.grammar.filter(g => !outside(g.unit)).map(g => g.id))
  const a2Scenarios = new Set(
    Object.entries(b.speakingLevels ?? {})
      .filter(([, level]) => level === 'A2')
      .map(([id]) => id),
  )
  return {
    ...b,
    // an EMPTY planned A2 (the production registry says beta): a level with no units cannot be visible
    course: b.course?.map(c => (c.id === 'A2' ? { ...c, status: 'planned' as const, releasedLocales: [] } : c)),
    units: b.units.filter(u => outside(u.id)),
    vocabulary: b.vocabulary.filter(v => outside(v.unit)),
    grammar: b.grammar.filter(g => outside(g.unit)),
    exercises: b.exercises.filter(e => outside(e.unit)),
    listening: b.listening.filter(x => outside(x.unit)),
    reading: b.reading.filter(x => outside(x.unit)),
    writing: b.writing.filter(x => outside(x.unit)),
    speaking: b.speaking.filter(s => !a2Scenarios.has(s.id)),
    tests: b.tests.filter(t => t.level !== 'A2'),
    finalTests: [],
    whyNotes: (b.whyNotes ?? []).filter(n => !a2Concepts.has(n.conceptId)),
    placementItems: [],
    tutorTemplates: [],
    instructions: [],
    unitSpeaking: { ...b.unitSpeaking, A2: [] },
    speakingLevels: Object.fromEntries(Object.entries(b.speakingLevels ?? {}).filter(([id]) => !a2Scenarios.has(id))),
  }
}

/**
 * The bundle with every AUTHORED B1 item removed (units, vocabulary, grammar, exercises, texts, tests, final tests, why-notes, unit metadata): what the
 * validator saw before B1 Unit 21 existed. Synthetic worlds for the A2 and B1 rule tests are built on this, so they never depend on (or collide with)
 * the real B1 content, which is validated by its own tests. The B1 unit PLAN, the course registry and the curriculum configuration stay.
 */
export function withoutB1Content(b: ContentBundle): ContentBundle {
  const b1 = b.course?.find(c => c.id === 'B1')
  const ranges = b1 ? [b1.unitIdRange, ...(b1.extraUnitIdRanges ?? [])] : ([[21, 32], [301, 336]] as const)
  const outside = (unit: number) => !ranges.some(([first, last]) => unit >= first && unit <= last)
  const b1Concepts = new Set(b.grammar.filter(g => !outside(g.unit)).map(g => g.id))
  const b1Scenarios = new Set(
    Object.entries(b.speakingLevels ?? {})
      .filter(([, level]) => level === 'B1')
      .map(([id]) => id),
  )
  return {
    ...b,
    // B1 with NO authored unit: a level without units cannot be visible (the production registry says beta, since the B1 Beta launch)
    course: b.course?.map(c => (c.id === 'B1' ? { ...c, status: 'planned' as const, releasedLocales: [] } : c)),
    units: b.units.filter(u => outside(u.id)),
    vocabulary: b.vocabulary.filter(v => outside(v.unit)),
    grammar: b.grammar.filter(g => outside(g.unit)),
    exercises: b.exercises.filter(e => outside(e.unit)),
    listening: b.listening.filter(x => outside(x.unit)),
    reading: b.reading.filter(x => outside(x.unit)),
    writing: b.writing.filter(x => outside(x.unit)),
    speaking: b.speaking.filter(s => !b1Scenarios.has(s.id)),
    tests: b.tests.filter(t => t.level !== 'B1'),
    finalTests: (b.finalTests ?? []).filter(f => outside(f.unit)),
    whyNotes: (b.whyNotes ?? []).filter(n => !b1Concepts.has(n.conceptId)),
    unitSpeaking: { ...b.unitSpeaking, B1: [] },
    speakingLevels: Object.fromEntries(Object.entries(b.speakingLevels ?? {}).filter(([id]) => !b1Scenarios.has(id))),
    b1Meta: [],
  }
}
