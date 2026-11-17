import type { Exercise, L10n } from '../types'
import { UNIT_12_EXERCISES } from './unit12/assessment'
import { UNIT_13_EXERCISES } from './unit13/assessment'
import { UNIT_14_EXERCISES } from './unit14/assessment'
import { UNIT_15_EXERCISES } from './unit15/assessment'
import { UNIT_16_EXERCISES } from './unit16/assessment'
import { UNIT_17_EXERCISES } from './unit17/assessment'
import { UNIT_18_EXERCISES } from './unit18/assessment'
import { UNIT_19_EXERCISES } from './unit19/assessment'
import { UNIT_20_EXERCISES } from './unit20/assessment'

const w = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * A2 handwritten revision (Wiederholung) exercises, 8 per unit. Unit 11: ids `a2-ex-11-01` … `a2-ex-11-08`.
 * They practise the unit's three concepts and are authored independently of the final test (`tests.ts`): no prompt, sentence or
 * answer of this file is reused there.
 */
const UNIT_11_A2_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-11-01',
    type: 'fill',
    unit: 11,
    concept: 'a2-perfekt-erfahrungen',
    prompt: 'Meine Eltern ___ vor fünf Jahren nach Almaty gezogen.',
    promptRu: 'Мои родители переехали в Алматы пять лет назад.',
    promptKy: 'Ата-энем беш жыл мурун Алматыга көчүп барышкан.',
    options: ['sind', 'haben', 'werden'],
    answer: 'sind',
    why: w(
      'Ziehen в значении «переехать» — это перемена места, поэтому Perfekt образуется с sein: «sind … gezogen».',
      'Ziehen «көчүү» маанисинде — жайдын өзгөрүшү, ошондуктан Perfekt sein менен түзүлөт: «sind … gezogen».',
    ),
  },
  {
    id: 'a2-ex-11-02',
    type: 'choice',
    unit: 11,
    concept: 'a2-perfekt-erfahrungen',
    prompt: 'Wie heißt das Partizip II von „abschließen“?',
    promptRu: 'Как звучит Partizip II от глагола «abschließen»?',
    promptKy: '«abschließen» этишинин Partizip II формасы кандай?',
    options: ['abgeschlossen', 'geabschlossen', 'abschlossen'],
    answer: 'abgeschlossen',
    why: w(
      'Abschließen — глагол с отделяемой приставкой ab-. Приставка ge- встаёт между приставкой и основой: ab + ge + schlossen.',
      'Abschließen — ажыраган ab- приставкасы бар этиш. Ge- приставкасы приставка менен уңгунун ортосуна кирет: ab + ge + schlossen.',
    ),
  },
  {
    id: 'a2-ex-11-03',
    type: 'order',
    unit: 11,
    concept: 'a2-perfekt-erfahrungen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я два года жил в Оше.',
    promptKy: 'Мен эки жыл Ошто жашадым.',
    words: ['gelebt.', 'in', 'Ich', 'zwei', 'Osch', 'habe', 'Jahre'],
    answer: 'Ich habe zwei Jahre in Osch gelebt.',
    why: w(
      'Вспомогательный глагол haben стоит на втором месте, Partizip II (gelebt) — в самом конце предложения.',
      'Жардамчы этиш haben экинчи орунда, ал эми Partizip II (gelebt) сүйлөмдүн эң аягында турат.',
    ),
  },
  {
    id: 'a2-ex-11-04',
    type: 'fill',
    unit: 11,
    concept: 'a2-praeteritum-sein-haben-modal',
    prompt: 'Früher ___ ich kein Wort Deutsch sprechen.',
    promptRu: 'Раньше я не мог сказать ни слова по-немецки.',
    promptKy: 'Мурда мен немисче бир ооз сөз айта алчу эмесмин.',
    options: ['konnte', 'können', 'kann'],
    answer: 'konnte',
    why: w(
      'Слово «früher» указывает на прошлое: Präteritum от können — konnte (без умлаута). Kann — настоящее время, können — инфинитив: здесь они не подходят.',
      '«Früher» сөзү өткөн убакытты көрсөтөт: können этишинин Präteritum формасы — konnte (умлаутсуз). Kann — азыркы чак, können — инфинитив: бул жерге алар туура келбейт.',
    ),
  },
  {
    id: 'a2-ex-11-05',
    type: 'choice',
    unit: 11,
    concept: 'a2-praeteritum-sein-haben-modal',
    prompt: 'Wir ___ damals wenig Geld.',
    promptRu: 'У нас тогда было мало денег.',
    promptKy: 'Ал кезде бизде акча аз болчу.',
    options: ['hatten', 'hatte', 'hattet'],
    answer: 'hatten',
    why: w(
      'Подлежащее wir требует формы «hatten» (как wir waren, wir konnten). Hatte — это ich и er/sie/es, hattet — это ihr.',
      'Wir ээси «hatten» формасын талап кылат (wir waren, wir konnten сыяктуу). Hatte — ich жана er/sie/es үчүн, hattet — ihr үчүн.',
    ),
  },
  {
    id: 'a2-ex-11-06',
    type: 'order',
    unit: 11,
    concept: 'a2-ereignisse-verbinden',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я переехал, потому что нашёл работу.',
    promptKy: 'Мен жумуш тапкандыктан көчүп кеттим.',
    words: ['habe.', 'Arbeit', 'umgezogen,', 'ich', 'Ich', 'weil', 'bin', 'gefunden'],
    answer: 'Ich bin umgezogen, weil ich Arbeit gefunden habe.',
    why: w(
      'После weil начинается придаточное предложение: подлежащее идёт сразу после weil, а вспомогательный глагол (habe) — в самом конце.',
      'Weil сөзүнөн кийин ээрчимелүү сүйлөм башталат: ээси weil сөзүнөн дароо кийин келет, ал эми жардамчы этиш (habe) эң аягында турат.',
    ),
  },
  {
    id: 'a2-ex-11-07',
    type: 'choice',
    unit: 11,
    concept: 'a2-ereignisse-verbinden',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Danach habe ich eine Stelle gefunden.', 'Danach ich habe eine Stelle gefunden.', 'Danach ich eine Stelle gefunden habe.'],
    answer: 'Danach habe ich eine Stelle gefunden.',
    why: w(
      'Danach занимает первое место, поэтому глагол (habe) стоит на втором, а подлежащее (ich) — на третьем.',
      'Danach биринчи орунду ээлегендиктен, этиш (habe) экинчи орунда, ал эми ээси (ich) үчүнчү орунда турат.',
    ),
  },
  {
    id: 'a2-ex-11-08',
    type: 'fill',
    unit: 11,
    concept: 'a2-ereignisse-verbinden',
    prompt: 'Ich glaube, dass Erfahrungen für den Beruf sehr wichtig ___.',
    promptRu: 'Я думаю, что опыт очень важен для профессии.',
    promptKy: 'Менимче, кесип үчүн тажрыйба абдан маанилүү.',
    options: ['sind', 'ist', 'sein'],
    answer: 'sind',
    why: w(
      'После dass спрягаемый глагол стоит в конце. Подлежащее «Erfahrungen» — множественное число, поэтому sind.',
      'Dass сөзүнөн кийин жөндөлгөн этиш аягында турат. «Erfahrungen» ээси — көптүк сан, ошондуктан sind.',
    ),
  },
]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_EXERCISES: Exercise[] = [...UNIT_11_A2_EXERCISES, ...UNIT_12_EXERCISES, ...UNIT_13_EXERCISES, ...UNIT_14_EXERCISES, ...UNIT_15_EXERCISES, ...UNIT_16_EXERCISES, ...UNIT_17_EXERCISES, ...UNIT_18_EXERCISES, ...UNIT_19_EXERCISES, ...UNIT_20_EXERCISES]
