import type { ReadingText } from '../types'
import { A2_LESETEXTE } from './a2-lesetexte'
import { UNIT_11_SOURCE } from './provenance'
import { UNIT_12_READING } from './unit12/texts'
import { UNIT_13_READING } from './unit13/texts'
import { UNIT_14_READING } from './unit14/texts'
import { UNIT_15_READING } from './unit15/texts'
import { UNIT_16_READING } from './unit16/texts'
import { UNIT_17_READING } from './unit17/texts'
import { UNIT_18_READING } from './unit18/texts'
import { UNIT_19_READING } from './unit19/texts'
import { UNIT_20_READING } from './unit20/texts'

/** A2 reading texts (units 11–20), ids `a2-re-<unit>-<nn>`. Unit 11 has two. */
const UNIT_11_A2_READING: ReadingText[] = [
  {
    id: 'a2-re-11-01',
    unit: 11,
    level: 'A2',
    title: 'Mein Weg nach Deutschland',
    body: [
      'Ich heiße Nurlan und komme aus Karakol in Kirgisistan. Dort bin ich aufgewachsen und zur Schule gegangen. Nach der Schule habe ich zwei Jahre als Elektriker gearbeitet und viele Erfahrungen gesammelt.',
      '2022 habe ich mich entschieden: Ich wollte im Ausland arbeiten. Zuerst habe ich einen Deutschkurs besucht. Das war nicht leicht, weil ich abends nach der Arbeit müde war. Im Sommer 2023 habe ich die Prüfung bestanden und bin nach Deutschland gezogen.',
      'Heute arbeite ich in Nürnberg. Ich habe es geschafft und bin sehr stolz. Mein nächstes Ziel ist eine eigene Wohnung.',
    ],
    gloss: [
      { word: 'aufgewachsen', ru: 'вырос (Partizip II от aufwachsen)', ky: 'чоңойгон (aufwachsen этишинин Partizip II формасы)', example: 'Ich bin in Osch aufgewachsen.', grammar: 'Perfekt с sein: ich bin aufgewachsen', grammarKy: 'sein менен Perfekt: ich bin aufgewachsen', related: ['aufwachsen', 'die Heimat'] },
      { word: 'gesammelt', ru: 'собрал, накопил (Partizip II от sammeln)', ky: 'топтогон (sammeln этишинин Partizip II формасы)', example: 'Ich habe viele Erfahrungen gesammelt.', grammar: 'Perfekt с haben: ich habe gesammelt', grammarKy: 'haben менен Perfekt: ich habe gesammelt', related: ['Erfahrungen sammeln', 'die Erfahrung'] },
      { word: 'entschieden', ru: 'решил (sich entscheiden)', ky: 'чечим кабыл алган (sich entscheiden)', example: 'Ich habe mich für ein Studium entschieden.', grammar: 'приставка ent- → Partizip II без ge-', grammarKy: 'ent- приставкасы → Partizip II формасында ge- жок', related: ['sich entscheiden', 'das Ziel'] },
      { word: 'bestanden', ru: 'сдал (экзамен)', ky: 'өткөн (сынактан)', example: 'Ich habe die Prüfung bestanden.', grammar: 'приставка be- → Partizip II без ge-', grammarKy: 'be- приставкасы → Partizip II формасында ge- жок', related: ['bestehen', 'die Prüfung'] },
      { word: 'geschafft', ru: 'справился, получилось', ky: 'аткарган, жөндөгөн', example: 'Ich habe es geschafft!', grammar: 'Perfekt с haben: ich habe es geschafft', grammarKy: 'haben менен Perfekt: ich habe es geschafft', related: ['schaffen', 'der Erfolg'] },
    ],
    questions: [
      { q: 'Was hat Nurlan nach der Schule gemacht?', options: ['Er hat zwei Jahre als Elektriker gearbeitet.', 'Er hat in Deutschland studiert.', 'Er hat einen Deutschkurs gegeben.'], answer: 0 },
      { q: 'Warum war der Deutschkurs nicht leicht?', options: ['Der Kurs war zu teuer.', 'Die Prüfung war zu schwer.', 'Nurlan war abends nach der Arbeit müde.'], answer: 2 },
      { q: 'Was ist Nurlans nächstes Ziel?', options: ['Eine neue Arbeit', 'Eine eigene Wohnung', 'Eine Prüfung'], answer: 1 },
    ],
    source: UNIT_11_SOURCE,
  },
  {
    id: 'a2-re-11-02',
    unit: 11,
    level: 'A2',
    title: 'Früher und heute',
    body: [
      'Früher war ich sehr schüchtern. In der Schule wollte ich nie etwas sagen, und ich hatte immer Angst vor Fehlern.',
      'Mit 19 habe ich ein Praktikum in einem Hotel in Wien gemacht. Dort musste ich jeden Tag mit Gästen sprechen. Zuerst war das schwer, aber danach hat es mir Spaß gemacht.',
      'Heute arbeite ich als Reiseleiterin. Das Praktikum hat mein Leben verändert. Ich bin dort mutiger geworden.',
    ],
    gloss: [
      { word: 'schüchtern', ru: 'застенчивый', ky: 'уяң, тартынчаак', example: 'Früher war ich sehr schüchtern.', grammar: 'Präteritum von sein: ich war', grammarKy: 'sein этишинин Präteritum формасы: ich war', related: ['früher', 'damals'] },
      { word: 'musste', ru: 'должен был, приходилось (müssen)', ky: 'тийиш элем, туура келди (müssen)', example: 'Ich musste viel lernen.', grammar: 'Präteritum модального глагола: ich musste (без умлаута)', grammarKy: 'модалдык этиштин Präteritum формасы: ich musste (умлаутсуз)', related: ['müssen', 'konnte'] },
      { word: 'verändert', ru: 'изменил (verändern)', ky: 'өзгөрткөн (verändern)', example: 'Das Praktikum hat mein Leben verändert.', grammar: 'приставка ver- → Partizip II без ge-', grammarKy: 'ver- приставкасы → Partizip II формасында ge- жок', related: ['sich verändern', 'die Veränderung'] },
      { word: 'geworden', ru: 'стал (Partizip II от werden)', ky: 'болгон (werden этишинин Partizip II формасы)', example: 'Ich bin mutiger geworden.', grammar: 'Perfekt с sein: ich bin geworden', grammarKy: 'sein менен Perfekt: ich bin geworden', related: ['werden', 'die Veränderung'] },
    ],
    questions: [
      { q: 'Wie war die Schreiberin früher?', options: ['Sehr mutig', 'Sehr müde', 'Sehr schüchtern'], answer: 2 },
      { q: 'Was hat sie mit 19 gemacht?', options: ['Sie hat in einem Hotel in Wien ein Praktikum gemacht.', 'Sie hat in Wien studiert.', 'Sie hat als Reiseleiterin gearbeitet.'], answer: 0 },
      { q: 'Warum hat das Praktikum ihr Leben verändert?', options: ['Sie hat viel Geld verdient.', 'Sie ist mutiger geworden.', 'Sie hat dort Deutsch gelernt.'], answer: 1 },
    ],
    source: UNIT_11_SOURCE,
  },
]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_READING: ReadingText[] = [
  ...UNIT_11_A2_READING,
  ...UNIT_12_READING,
  ...UNIT_13_READING,
  ...UNIT_14_READING,
  ...UNIT_15_READING,
  ...UNIT_16_READING,
  ...UNIT_17_READING,
  ...UNIT_18_READING,
  ...UNIT_19_READING,
  ...UNIT_20_READING,
  ...A2_LESETEXTE,
]
