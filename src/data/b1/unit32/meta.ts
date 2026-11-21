import type { B1UnitMeta } from '../meta-types'
import { UNIT_32_SPEAKING_ID } from './unit'

/**
 * Unit 32 metadata: learning objectives (German + independent Russian and Kyrgyz), the two REVISION concepts (Nebensätze im Überblick, P/L; Mittelfeld, P/M — decision D-9: partly new as a system;
 * fallback: a plain revision list without a concept) — Unit 32 declares NO new grammar —, the list of all earlier B1 concepts the unit recapitulates (Units 21–31), strands (all strategies as a
 * checklist, communication repair, Wortbildung, the self-assessment rubric), the micro-task (learning diary), the spaced-revision set and the Wiederholungsblock of Units 29–31 (curriculum v2: Units
 * 24, 28, 32). The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. The "Probeprüfung" is an exercise, not an official exam.
 */
export const UNIT_32_META: B1UnitMeta = {
  unit: 32,
  canDo: [
    {
      de: 'Ich kann meinen Lernweg bewerten: Stärken, Schwächen, Fortschritte und nächste Schritte nennen und begründen.',
      ru: 'Я могу оценить свой путь обучения: назвать и обосновать сильные и слабые стороны, прогресс и следующие шаги.',
      ky: 'Мен өз окуу жолумду баалай алам: күчтүү жана алсыз жактарды, жылышты жана кийинки кадамдарды атап, негиздей алам.',
    },
    {
      de: 'Ich kann einen kurzen Vortrag mit Einleitung, zwei Punkten und Schluss halten, auf einen Einwand reagieren und gemeinsam etwas planen.',
      ru: 'Я могу произнести короткое выступление со вступлением, двумя пунктами и заключением, отреагировать на возражение и вместе что-то спланировать.',
      ky: 'Мен киришүүсү, эки пункту жана жыйынтыгы бар кыска чыгуу жасап, каршы пикирге жооп берип жана чогуу бир нерсени пландай алам.',
    },
    {
      de: 'Ich kann Nebensätze und die Wortstellung im Mittelfeld systematisch prüfen und typische Fehler selbst korrigieren.',
      ru: 'Я могу систематически проверять придаточные предложения и порядок слов в середине предложения и сам исправлять типичные ошибки.',
      ky: 'Мен кошумча бөлүктөрдү жана сүйлөмдүн ортосундагы сөз иретин системалуу текшерип, типтүү каталарды өзүм оңдой алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann einen längeren Erfahrungsbericht und eine kurze Information im Aufgabenformat (richtig / falsch / steht nicht im Text) verstehen.',
      ru: 'Я могу понять длинный рассказ об опыте и короткую информацию в формате заданий (richtig / falsch / steht nicht im Text).',
      ky: 'Мен узун тажрыйба баянын жана тапшырма форматындагы кыска маалыматты (richtig / falsch / steht nicht im Text) түшүнө алам.',
    },
    hoeren: {
      de: 'Ich kann eine Durchsage mit einem Gespräch und einen kurzen Vortrag in den wichtigen Punkten verstehen.',
      ru: 'Я могу понять главное в объявлении с разговором и в коротком выступлении.',
      ky: 'Мен жарыя менен сүйлөшүүдөгү жана кыска чыгуудагы негизги нерселерди түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann einen kurzen Vortrag über meinen Lernweg halten, auf eine Frage reagieren und mit einem Partner eine Feier planen, auch wenn ein Raum nicht frei ist.',
      ru: 'Я могу сделать короткое выступление о своём пути обучения, ответить на вопрос и вместе с партнёром спланировать праздник, даже если зал занят.',
      ky: 'Мен өз окуу жолум жөнүндө кыска чыгуу жасап, суроого жооп берип жана зал бош эмес болсо да, шериги менен майрамды пландай алам.',
    },
    schreiben: {
      de: 'Ich kann eine informelle E-Mail und einen formellen Brief schreiben und einen kurzen Lerntagebucheintrag mit Selbsteinschätzung verfassen.',
      ru: 'Я могу написать неформальное письмо и формальное письмо и составить короткую запись в дневнике обучения с самооценкой.',
      ky: 'Мен расмий эмес кат жана расмий кат жазып, өзүн баалоосу бар окуу күндөлүгүнүн кыска жазуусун түзө алам.',
    },
  },
  concepts: [
    { conceptId: 'b1-nebensaetze-integration', proficiency: 'P', load: 'L', role: 'revision' },
    { conceptId: 'b1-satzbau-mittelfeld', proficiency: 'P', load: 'M', role: 'revision' },
  ],
  // every B1 concept of Units 21–31 that the unit and the level assessment recapitulate
  recapConcepts: [
    'b1-praeteritum-erzaehlen',
    'b1-temporale-konnektoren',
    'b1-konzessive-saetze',
    'b1-doppelkonnektoren',
    'b1-adjektive-dativ-genitiv',
    'b1-relativsaetze-nom-akk',
    'b1-infinitiv-mit-zu',
    'b1-passiv-praesens',
    'b1-adjektive-ohne-artikel',
    'b1-konjunktiv2-ratschlaege',
    'b1-reflexive-dativ',
    'b1-passiv-praeteritum-modal',
    'b1-lassen',
    'b1-wiedergeben-indikativ',
    'b1-konjunktiv2-wuensche-irreal',
    'b1-genitiv-praepositionen',
    'b1-futur1-vermutungen',
    'b1-falls-sobald-solange',
    'b1-verben-praepositionen',
    'b1-relativsaetze-dativ-praeposition',
    'b1-genitivattribute',
    'b1-plusquamperfekt-nachdem',
    'b1-nomen-verb-verbindungen',
    'b1-konsekutiv-final',
    'b1-textkohaesion',
    'b1-formelle-sprache',
    'b1-aktiv-passiv-zustandspassiv',
  ],
  scenario: {
    id: UNIT_32_SPEAKING_ID,
    unexpectedElement: {
      de: 'Der Raum ist nicht frei: „Der Raum ist am Freitag leider schon belegt. Was machen wir jetzt?“ Der Lernende muss ruhig reagieren, eine Alternative vorschlagen (falls / wenn) und den Plan ändern.',
      ru: 'Зал занят: «Зал в пятницу, к сожалению, уже занят. Что нам теперь делать?» Нужно спокойно отреагировать, предложить альтернативу (falls / wenn) и изменить план.',
      ky: 'Зал бош эмес: «Тилекке каршы, жума күнү зал бош эмес. Эми эмне кылабыз?» Сабырдуу жооп берип, альтернатива сунуштап (falls / wenn) жана планды өзгөртүү керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Habe ich Sie richtig verstanden? Nur der Freitag ist nicht möglich?',
        ru: 'Я правильно вас понял? Невозможна только пятница?',
        ky: 'Мен сизди туура түшүндүмбү? Жума гана мүмкүн эмеспи?',
      },
      {
        de: 'Entschuldigung, könnten Sie das bitte noch einmal anders erklären?',
        ru: 'Извините, не могли бы вы объяснить это ещё раз иначе?',
        ky: 'Кечиресиз, муну дагы бир жолу башкача түшүндүрүп бере аласызбы?',
      },
      {
        de: 'Moment, ich überlege kurz. Wie wäre es mit Samstag?',
        ru: 'Минуточку, я подумаю. А как насчёт субботы?',
        ky: 'Бир мүнөт, мен ойлонуп алайын. Ишемби кандай болот?',
      },
      {
        de: 'Das ist ein berechtigter Einwand. Darüber möchte ich nachdenken.',
        ru: 'Это обоснованное возражение. Я хочу над этим подумать.',
        ky: 'Бул орундуу каршы пикир. Мен муну ойлонгум келет.',
      },
    ],
    strategyNote: {
      de: 'Alle Strategien als Checkliste: Lesen — erst die Aufgabe und die Frage lesen, dann den Text nach Fakten durchsuchen; bei „richtig / falsch / steht nicht im Text“ nur entscheiden, was im Text steht. Hören — die Aufgabe vorher lesen, beim ersten Hören die Hauptsache, beim zweiten die Details. Sprechen — Einleitung, zwei Punkte, Schluss; bei einem Einwand erst sagen, was du verstehst. Schreiben — Anrede, Anlass, Inhalt, Wunsch, Gruß; danach Verb und Mittelfeld prüfen. Die „Probe“ in dieser Einheit ist eine Übung, keine offizielle Prüfung.',
      ru: 'Все стратегии в виде чек-листа: чтение — сначала прочитать задание и вопрос, потом искать в тексте факты; при «richtig / falsch / steht nicht im Text» решать только по тому, что написано в тексте. Аудирование — прочитать задание заранее, при первом прослушивании понять главное, при втором — детали. Речь — вступление, два пункта, заключение; при возражении сначала сказать, что вы понимаете. Письмо — обращение, повод, содержание, просьба, прощание; затем проверить глагол и порядок слов в середине предложения. «Probe» в этом юните — упражнение, а не официальный экзамен.',
      ky: 'Бардык стратегиялар чек-лист түрүндө: окуу — адегенде тапшырманы жана суроону окуу, андан кийин текстте фактыларды издөө; «richtig / falsch / steht nicht im Text» болгондо текстте эмне жазылганына гана караап чечүү. Угуу — тапшырманы алдын ала окуу, биринчи угууда негизги нерсени, экинчисинде майда-чүйдөсүн түшүнүү. Сүйлөө — киришүү, эки пункт, жыйынтык; каршы пикирде адегенде эмнени түшүнгөнүңүздү айтуу. Жазуу — кайрылуу, себеп, мазмун, өтүнүч, коштошуу; андан кийин этишти жана ортодогу сөз иретин текшерүү. Бул бөлүмдөгү «Probe» — көнүгүү, расмий экзамен эмес.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Nomen + Nomen: Lern + Tagebuch = das Lerntagebuch, Lern + Ziel = das Lernziel, Zeit + Plan = der Zeitplan (der Artikel kommt vom letzten Wort). Mit -ung wird aus einem Verb ein Nomen: zusammenfassen → die Zusammenfassung, gliedern → die Gliederung, einschätzen → die (Selbst-)Einschätzung. Verben mit Vorsilbe: zurück|blicken, ein|schätzen, fest|halten, zu|ordnen, an|kreuzen — im Hauptsatz geht die Vorsilbe ans Ende: „Ich blicke zurück.“',
      ru: 'Как образуются слова: существительное + существительное: Lern + Tagebuch = das Lerntagebuch, Lern + Ziel = das Lernziel, Zeit + Plan = der Zeitplan (артикль берётся от последнего слова). С -ung из глагола получается существительное: zusammenfassen → die Zusammenfassung, gliedern → die Gliederung, einschätzen → die (Selbst-)Einschätzung. Глаголы с приставкой: zurück|blicken, ein|schätzen, fest|halten, zu|ordnen, an|kreuzen — в главном предложении приставка уходит в конец: «Ich blicke zurück».',
      ky: 'Сөздөр кантип түзүлөт: зат атооч + зат атооч: Lern + Tagebuch = das Lerntagebuch, Lern + Ziel = das Lernziel, Zeit + Plan = der Zeitplan (артикль акыркы сөздөн алынат). -ung менен этиштен зат атооч жасалат: zusammenfassen → die Zusammenfassung, gliedern → die Gliederung, einschätzen → die (Selbst-)Einschätzung. Приставкасы бар этиштер: zurück|blicken, ein|schätzen, fest|halten, zu|ordnen, an|kreuzen — башкы бөлүктө приставка аягына өтөт: «Ich blicke zurück».',
    },
  },
  microTasks: [{ kind: 'note', taskId: 'b1-wr-32-03' }],
  revision: {
    fromPrevious: ['v31-6', 'v31-14', 'v31-27', 'v31-34'],
    fromThirdBack: ['v29-3', 'v29-28'],
    fromA2: ['v19-4', 'v19-38'],
    // Wiederholungsblock (curriculum v2: Units 24, 28, 32): words of Units 29–31 for one dedicated review round
    block: [
      'v29-1',
      'v29-2',
      'v29-3',
      'v29-4',
      'v29-12',
      'v29-17',
      'v29-26',
      'v29-28',
      'v30-1',
      'v30-4',
      'v30-7',
      'v30-12',
      'v30-17',
      'v30-23',
      'v30-26',
      'v31-1',
      'v31-2',
      'v31-6',
      'v31-14',
      'v31-26',
      'v31-27',
      'v31-34',
      'v31-36',
    ],
  },
}
