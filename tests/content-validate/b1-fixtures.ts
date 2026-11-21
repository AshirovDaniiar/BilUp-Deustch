// A small, fully COMPLIANT synthetic B1 unit (the Unit 21 slot, with its approved permanent identity and concept ids) for the B1 validator tests, built on top of the REAL A1/A2 content so that the
// overlap, recycling and revision checks run against real lemmas, concepts and vocabulary ids. TEST-ONLY: nothing here is B1 learning content,
// the lesson/vocabulary ids follow the approved conventions but are test data, and the file is never imported by the application.
import { fullBundle } from '../../scripts/content-validate/bundle'
import type { ContentBundle } from '../../scripts/content-validate/types'
import { withoutB1Content } from './fixtures'
import type { B1Text, B1UnitMeta } from '../../src/data/b1/meta'
import type {
  Exercise,
  GrammarConcept,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  SpeakingScenario,
  VocabularyItem,
  WritingTask,
} from '../../src/data/types'

const l = (ru: string, ky: string) => ({ ru, ky })
const author = { kind: 'authored', author: 'Test Author' } as const
const text = (de: string, ru: string, ky: string): B1Text => ({ de, ru, ky })

export const FIXTURE_UNIT = 21
const S10 = 'Wir gehen heute ins Kino und sehen einen langen Film.' // exactly 10 words
const S10_RU = 'Мы сегодня идём в кино и смотрим длинный фильм.'
const S10_KY = 'Биз бүгүн киного барып узун тасма көрөбүз.'

const word = (n: number): VocabularyItem => ({
  id: `v21-${n}`,
  unit: 21,
  pos: 'noun',
  article: 'der',
  de: `Fixturewort${String.fromCharCode(96 + ((n - 1) % 26) + 1)}${Math.ceil(n / 26)}`,
  plural: `Fixturewörter${n}`,
  ru: `слово для проверки ${n}`,
  ky: `текшерүү сөзү ${n}`,
  example: `Das ist ein Beispielsatz für das Wort ${n}.`,
  exampleRu: `Это пример для слова ${n}.`,
  exampleKy: `Бул ${n}-сөз үчүн мисал.`,
  related: [],
})

const concept = (id: string, n: number): GrammarConcept => ({
  id,
  category: 'tenses',
  level: 'B1',
  unit: 21,
  title: l(`Тема ${n}`, `${n}-тема`),
  summary: l(`Кратко ${n}`, `Кыскача ${n}`),
  discover: l(`Вопрос ${n}`, `${n}-суроо`),
  why: l(`Потому что ${n}`, `Анткени ${n}`),
  when: [l(`Когда ${n}`, `Качан ${n}`)],
  examples: [{ de: 'Wir gingen gestern ins Kino.', ru: 'Мы вчера ходили в кино.', ky: 'Биз кечээ киного бардык.' }],
  mistakes: [{ wrong: 'Wir gehen gestern.', right: 'Wir gingen gestern.', note: l('Прошедшее время', 'Өткөн чак') }],
  reallife: [{ de: 'Ich arbeitete in einem Büro.', ru: 'Я работал в офисе.', ky: 'Мен кеңседе иштедим.' }],
  visual: 'none',
  dialogue: [{ speaker: 'A', text: 'Was hast du gemacht?', ru: 'Что ты делал?', ky: 'Сен эмне кылдың?' }],
  speakPrompt: { prompt: l('Расскажите о вчера.', 'Кечээ жөнүндө айтыңыз.'), sample: 'Gestern ging ich ins Kino.', keywords: ['ging'] },
  source: author,
})

const listening = (n: number): ListeningExercise => ({
  id: `b1-li-21-0${n}`,
  level: 'B1',
  unit: 21,
  title: `Gespräch ${n}`,
  keywords: ['Kino'],
  lines: Array.from({ length: 12 }, (_, i) => ({ speaker: i % 2 ? 'B' : 'A', text: S10, ru: S10_RU, ky: S10_KY })),
  questions: [
    { q: 'Wohin gehen sie?', options: ['Ins Kino', 'Ins Theater', 'Ins Museum'], answer: (n + 0) % 3 },
    { q: 'Wann?', options: ['Gestern', 'Heute', 'Morgen'], answer: (n + 1) % 3 },
    { q: 'Was sehen sie?', options: ['Einen Film', 'Ein Spiel', 'Eine Show'], answer: (n + 2) % 3 },
  ],
  source: author,
})

const reading = (n: number): ReadingText => ({
  id: `b1-re-21-0${n}`,
  level: 'B1',
  unit: 21,
  title: `Text ${n}`,
  body: [Array.from({ length: 6 }, () => S10).join(' '), Array.from({ length: 6 }, () => S10).join(' ')],
  gloss: [
    {
      word: 'Film',
      ru: 'фильм',
      ky: 'тасма',
      example: 'Der Film ist lang.',
      grammar: 'der Film',
      grammarKy: 'der Film (эркек род)',
      related: [],
    },
  ],
  questions: [
    { q: 'Was sehen sie?', options: ['Einen Film', 'Ein Spiel', 'Eine Show'], answer: (n + 0) % 3 },
    { q: 'Wann?', options: ['Gestern', 'Heute', 'Morgen'], answer: (n + 1) % 3 },
    { q: 'Wohin?', options: ['Ins Kino', 'Ins Theater', 'Ins Museum'], answer: (n + 2) % 3 },
  ],
  source: author,
})

const writing = (n: number, minWords: number, formal = false): WritingTask => ({
  id: `b1-wr-21-0${n}`,
  level: 'B1',
  unit: 21,
  title: `Aufgabe ${n}`,
  situation: l('Напишите письмо другу.', 'Досуңузга кат жазыңыз.'),
  formal,
  minWords,
  mustInclude: [{ label: 'Gruß', patterns: ['hallo'], explain: l('Приветствие.', 'Саламдашуу.') }],
  model: 'Hallo Paul, gestern gingen wir ins Kino. Bis bald, Anna.',
  tips: [l('Начните с приветствия.', 'Саламдашуудан баштаңыз.')],
  source: author,
})

const speaking: SpeakingScenario = {
  id: 'b1-sp-21-01',
  title: 'Ein Erlebnis',
  titleRu: 'Происшествие',
  titleKy: 'Окуя',
  icon: '🎬',
  level: 'B1',
  goal: l('Расскажите о событии.', 'Окуя жөнүндө айтып бериңиз.'),
  turns: Array.from({ length: 5 }, (_, i) => ({
    ai: `Was ist passiert? ${i}`,
    aiRu: `Что произошло? ${i}`,
    aiKy: `Эмне болду? ${i}`,
    hints: ['Gestern ging ich ins Kino.'],
    keywords: ['kino'],
  })),
  source: author,
}

const exercise = (n: number): Exercise => ({
  id: `b1-ex-21-0${n}`,
  type: 'fill',
  unit: 21,
  concept: 'b1-praeteritum-erzaehlen',
  prompt: `Gestern ___ ich müde ${n}.`,
  answer: 'war',
  options: ['war', 'bin', 'ist'],
  promptRu: `Вчера я был усталым ${n}.`,
  promptKy: `Кечээ мен чарчадым ${n}.`,
  why: l('Präteritum von sein', 'sein этишинин өткөн чагы'),
})

export interface FixtureOptions {
  /** status of the B1 level in the course registry (production: planned) */
  status?: 'planned' | 'beta' | 'released'
}

/** The compliant fixture. Everything it adds belongs to the Unit 21 slot of B1; A1 and A2 are the real shipped content. */
export function validB1Bundle(options: FixtureOptions = {}): ContentBundle {
  const b = withoutB1Content(structuredClone(fullBundle()))
  const status = options.status ?? 'planned'
  const a2 = (unit: number) => b.vocabulary.filter(v => v.unit === unit).map(v => v.id)
  const a2Concepts = b.grammar.filter(g => g.unit >= 11 && g.unit <= 20).map(g => g.id)

  const unit: LearningUnit = {
    id: 21,
    key: 'b1-erlebnisse-erinnerungen', // the approved permanent key and title of unit 21 (src/data/b1/registry.ts)
    level: 'B1',
    title: 'Erlebnisse und Erinnerungen erzählen',
    subtitle: l('Тестовый юнит', 'Сыноо бөлүмү'),
    icon: '🎬',
    grammarIds: ['b1-praeteritum-erzaehlen', 'b1-temporale-konnektoren'],
  }
  const final = {
    unit: 21,
    questions: Array.from({ length: 15 }, (_, i) => {
      const skill = i < 6 ? 'grammar' : i < 9 ? 'vocabulary' : i < 13 ? 'reading' : 'listening'
      const recycled = i === 0 || i === 1 // A2 concepts (↻)
      return {
        id: `b1-ft-21-${String(i + 1).padStart(2, '0')}`,
        prompt: skill === 'grammar' ? `Gestern ___ ich müde ${i}.` : `Frage ${i}: Was passt?`,
        promptRu: `Вопрос ${i}`,
        promptKy: `${i}-суроо`,
        options: ['A1', 'B1', 'C1'].map(o => `${o} ${i}`),
        answer: `${['A1', 'B1', 'C1'][i % 3]} ${i}`,
        skill,
        ...(skill === 'grammar' ? { concept: recycled ? a2Concepts[i] : 'b1-praeteritum-erzaehlen' } : {}),
        why: l('Потому что так.', 'Анткени ушундай.'),
      }
    }),
  }

  const meta: B1UnitMeta = {
    unit: 21,
    canDo: [
      text('Ich kann von Erlebnissen erzählen.', 'Я могу рассказать о событиях.', 'Мен окуялар жөнүндө айтып бере алам.'),
      text('Ich kann die Reihenfolge von Ereignissen nennen.', 'Я могу назвать порядок событий.', 'Мен окуялардын ирдигин айта алам.'),
    ],
    objectives: {
      lesen: text(
        'Ich kann die Reihenfolge in einem Text erkennen.',
        'Я могу определить порядок в тексте.',
        'Мен текстте иретти таба алам.',
      ),
      hoeren: text('Ich kann eine Erzählung verstehen.', 'Я могу понять рассказ.', 'Мен баянды түшүнө алам.'),
      sprechen: text('Ich kann ein Erlebnis erzählen.', 'Я могу рассказать о событии.', 'Мен окуяны айтып бере алам.'),
      schreiben: text(
        'Ich kann eine Nachricht über ein Erlebnis schreiben.',
        'Я могу написать сообщение о событии.',
        'Мен окуя жөнүндө билдирүү жаза алам.',
      ),
    },
    differenceFromA2: text('A2 erzählt kurz, B1 erzählt zusammenhängend.', 'A2 коротко, B1 связно.', 'A2 кыска, B1 байланыштуу.'),
    concepts: [
      { conceptId: 'b1-praeteritum-erzaehlen', proficiency: 'P-lim', load: 'H', role: 'new', closedList: ['gehen', 'sehen', 'kommen'] },
      { conceptId: 'b1-temporale-konnektoren', proficiency: 'P', load: 'M', role: 'new' },
    ],
    scenario: {
      id: 'b1-sp-21-01',
      unexpectedElement: text('Der Gesprächspartner zweifelt.', 'Собеседник сомневается.', 'Маектеш шектенет.'),
    },
    strands: {
      repairChunks: [
        text('Können Sie das bitte wiederholen?', 'Повторите, пожалуйста.', 'Кайталап берсеңиз.'),
        text('Was bedeutet das?', 'Что это значит?', 'Бул эмнени билдирет?'),
        text('Wie sagt man das auf Deutsch?', 'Как это сказать по-немецки?', 'Муну немисче кантип айтабыз?'),
      ],
      strategyNote: text('Achte auf Signalwörter.', 'Обращайте внимание на сигнальные слова.', 'Белги сөздөргө көңүл буруңуз.'),
    },
    topics: [{ topic: 'feelings', itemIds: ['v21-1', 'v21-2'] }],
    recapConcepts: a2Concepts.slice(0, 3),
    revision: { fromPrevious: a2(20).slice(0, 4), fromThirdBack: a2(18).slice(0, 2), fromA2: a2(15).slice(0, 2) },
  }

  return {
    ...b,
    course: b.course?.map(c => (c.id === 'B1' ? { ...c, status, releasedLocales: status === 'planned' ? [] : ['ru', 'ky'] } : c)),
    units: [...b.units, unit],
    vocabulary: [...b.vocabulary, ...Array.from({ length: 40 }, (_, i) => word(i + 1))],
    grammar: [...b.grammar, concept('b1-praeteritum-erzaehlen', 1), concept('b1-temporale-konnektoren', 2)],
    exercises: [...b.exercises, ...Array.from({ length: 8 }, (_, i) => exercise(i + 1))],
    listening: [...b.listening, listening(1), listening(2)],
    reading: [...b.reading, reading(1), reading(2)],
    writing: [...b.writing, writing(1, 70)],
    speaking: [...b.speaking, structuredClone(speaking)],
    tests: [...b.tests, { id: 'unit-21', title: l('Итоговый тест', 'Жыйынтык тест'), kind: 'topic', level: 'B1', unit: 21, size: 15 }],
    finalTests: [...(b.finalTests ?? []), final as unknown as NonNullable<ContentBundle['finalTests']>[number]],
    unitSpeaking: { ...b.unitSpeaking, B1: ['b1-sp-21-01'] },
    speakingLevels: { ...b.speakingLevels, 'b1-sp-21-01': 'B1' },
    b1Meta: [meta],
  }
}

export const clone = <T>(x: T): T => structuredClone(x)
