import type { WritingTask } from '../types'
import { UNIT_11_SOURCE } from './provenance'
import { UNIT_12_WRITING } from './unit12/texts'
import { UNIT_13_WRITING } from './unit13/texts'
import { UNIT_14_WRITING } from './unit14/texts'
import { UNIT_15_WRITING } from './unit15/texts'
import { UNIT_16_WRITING } from './unit16/texts'
import { UNIT_17_WRITING } from './unit17/texts'
import { UNIT_18_WRITING } from './unit18/texts'
import { UNIT_19_WRITING } from './unit19/texts'
import { UNIT_20_WRITING } from './unit20/texts'

/** A2 writing tasks (ids `a2-wr-<unit>-<nn>`). Unit 11 has one: a personal e-mail about one's experiences. */
const UNIT_11_A2_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-11-01',
    unit: 11,
    level: 'A2',
    title: 'Eine E-Mail über mein Leben',
    situation: {
      ru: 'Вы нашли языкового партнёра в Германии. Напишите ему личное письмо: где вы выросли, что делали после школы, почему вы переехали или что в вашей жизни изменилось, чем вы гордитесь и какая у вас цель.',
      ky: 'Сиз Германиядан тил боюнча өнөктөш таптыңыз. Ага жеке кат жазыңыз: кайда чоңойдуңуз, мектептен кийин эмне кылдыңыз, эмне үчүн көчтүңүз же жашооңузда эмне өзгөрдү, эмнеңиз менен сыймыктанасыз жана максатыңыз кандай.',
    },
    formal: false,
    minWords: 60,
    mustInclude: [
      { label: 'Anrede (Hallo / Liebe / Lieber)', patterns: ['hallo', 'liebe ', 'lieber '] },
      { label: 'Perfekt mit sein (z. B. bin … aufgewachsen / gezogen / gekommen)', patterns: ['aufgewachsen', 'gezogen', 'gekommen', 'gefahren', 'geworden'] },
      { label: 'Perfekt mit haben (z. B. habe … gearbeitet / gemacht / studiert)', patterns: ['habe ', 'haben '] },
      { label: 'Präteritum (war / hatte / konnte / wollte / musste)', patterns: ['war ', 'hatte', 'konnte', 'wollte', 'musste'] },
      { label: 'Ein Grund mit weil', patterns: ['weil '] },
      { label: 'Zeitwörter (zuerst / danach / früher / vor … Jahren / seit)', patterns: ['zuerst', 'danach', 'früher', 'damals', 'schließlich', 'vor ', 'seit '] },
      { label: 'Ziel oder Erfolg (Ziel / stolz / Erfolg)', patterns: ['ziel', 'stolz', 'erfolg'] },
    ],
    model:
      'Hallo Jonas, ich möchte mich vorstellen. Ich bin in Karakol aufgewachsen. Nach der Schule habe ich zwei Jahre als Elektriker gearbeitet. Früher konnte ich kein Deutsch. Zuerst habe ich einen Kurs besucht. Danach bin ich nach Nürnberg gezogen, weil ich dort eine Stelle gefunden habe. Am Anfang war es schwer, aber jetzt geht es besser. Ich habe die Prüfung bestanden und bin sehr stolz. Mein nächstes Ziel ist eine eigene Wohnung. Und du? Was hast du schon erlebt? Viele Grüße, Nurlan',
    tips: [
      {
        ru: 'Рассказывайте о событиях в Perfekt: «Ich habe gearbeitet», «Ich bin umgezogen». Partizip II стоит в конце предложения.',
        ky: 'Окуяларды Perfekt менен айтыңыз: «Ich habe gearbeitet», «Ich bin umgezogen». Partizip II сүйлөмдүн аягында турат.',
      },
      {
        ru: 'Для описания прошлого состояния используйте war, hatte, konnte, wollte, musste.',
        ky: 'Өткөн абалды сүрөттөө үчүн war, hatte, konnte, wollte, musste колдонуңуз.',
      },
      {
        ru: 'Объясняйте причину через weil и помните: глагол уходит в конец придаточного предложения.',
        ky: 'Себепти weil менен түшүндүрүңүз жана этиш ээрчимелүү сүйлөмдүн аягына өтөрүн унутпаңыз.',
      },
      {
        ru: 'Связывайте события словами zuerst, danach, schließlich: после них глагол стоит на втором месте.',
        ky: 'Окуяларды zuerst, danach, schließlich сөздөрү менен байланыштырыңыз: алардан кийин этиш экинчи орунда турат.',
      },
    ],
    source: UNIT_11_SOURCE,
  },
]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_WRITING: WritingTask[] = [...UNIT_11_A2_WRITING, ...UNIT_12_WRITING, ...UNIT_13_WRITING, ...UNIT_14_WRITING, ...UNIT_15_WRITING, ...UNIT_16_WRITING, ...UNIT_17_WRITING, ...UNIT_18_WRITING, ...UNIT_19_WRITING, ...UNIT_20_WRITING]
