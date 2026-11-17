import type { SpeakingScenario } from '../types'
import { UNIT_11_SOURCE } from './provenance'
import { UNIT_12_SPEAKING } from './unit12/texts'
import { UNIT_13_SPEAKING } from './unit13/texts'
import { UNIT_14_SPEAKING } from './unit14/texts'
import { UNIT_15_SPEAKING } from './unit15/texts'
import { UNIT_16_SPEAKING } from './unit16/texts'
import { UNIT_17_SPEAKING } from './unit17/texts'
import { UNIT_18_SPEAKING } from './unit18/texts'
import { UNIT_19_SPEAKING } from './unit19/texts'
import { UNIT_20_SPEAKING } from './unit20/texts'

/** A2 speaking scenarios (one per unit, referenced from `A2_UNIT_SPEAKING`), ids `a2-sp-<unit>-<nn>`. Unit 11 has one. */
const UNIT_11_A2_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-11-01',
    title: 'Erfahrungen im Gespräch',
    titleRu: 'Разговор об опыте',
    titleKy: 'Тажрыйба жөнүндө сүйлөшүү',
    icon: '🧭',
    level: 'A2',
    goal: {
      ru: 'Вы встретили языкового партнёра. Расскажите о своём пути: где выросли, что делали после школы, почему переехали, чем гордитесь и какая у вас цель.',
      ky: 'Сиз тил боюнча өнөктөш менен тааныштыңыз. Өз жолуңуз жөнүндө айтып бериңиз: кайда чоңойдуңуз, мектептен кийин эмне кылдыңыз, эмне үчүн көчтүңүз, эмнеңиз менен сыймыктанасыз жана максатыңыз кандай.',
    },
    turns: [
      {
        ai: 'Schön, dich kennenzulernen! Erzähl mal: Wo bist du aufgewachsen, und was hast du nach der Schule gemacht?',
        aiRu: 'Приятно познакомиться! Расскажи: где ты вырос и что делал после школы?',
        aiKy: 'Таанышканыма кубанычтамын! Айтып берчи: сен кайда чоңойдуң жана мектептен кийин эмне кылдың?',
        hints: ['Ich bin in … aufgewachsen.', 'Nach der Schule habe ich … gemacht.', 'Ich habe zwei Jahre als … gearbeitet.'],
        keywords: ['aufgewachsen', 'nach der schule', 'habe', 'gemacht', 'gearbeitet', 'studiert'],
      },
      {
        ai: 'Das klingt interessant! Warum hast du dich für diesen Weg entschieden?',
        aiRu: 'Звучит интересно! Почему ты выбрал именно этот путь?',
        aiKy: 'Кызыктуу угулат! Эмне үчүн дал ушул жолду тандадың?',
        hints: ['Ich wollte …, weil ich … mag.', 'Ich habe das gemacht, weil …'],
        keywords: ['weil', 'wollte', 'mag'],
      },
      {
        ai: 'Und wann bist du nach Deutschland gekommen? Wie war der Anfang?',
        aiRu: 'А когда ты приехал в Германию? Каким было начало?',
        aiKy: 'Ал эми Германияга качан келдиң? Башталышы кандай болду?',
        hints: ['Ich bin vor … Jahren gekommen.', 'Am Anfang war es schwer, denn ich konnte kaum Deutsch.', 'Zuerst habe ich einen Kurs besucht.'],
        keywords: ['vor', 'bin', 'gekommen', 'am anfang', 'war', 'konnte', 'zuerst'],
      },
      {
        ai: 'Was ist dein größter Erfolg? Und was ist dein nächstes Ziel?',
        aiRu: 'Какой твой самый большой успех? И какая у тебя следующая цель?',
        aiKy: 'Сенин эң чоң ийгилигиң кандай? Ал эми кийинки максатың эмне?',
        hints: ['Ich habe … gemacht. Ich bin sehr stolz.', 'Mein größter Erfolg ist …', 'Mein nächstes Ziel ist …'],
        keywords: ['stolz', 'ziel', 'nächstes', 'habe'],
      },
    ],
    source: UNIT_11_SOURCE,
  },
]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_SPEAKING: SpeakingScenario[] = [...UNIT_11_A2_SPEAKING, ...UNIT_12_SPEAKING, ...UNIT_13_SPEAKING, ...UNIT_14_SPEAKING, ...UNIT_15_SPEAKING, ...UNIT_16_SPEAKING, ...UNIT_17_SPEAKING, ...UNIT_18_SPEAKING, ...UNIT_19_SPEAKING, ...UNIT_20_SPEAKING]
