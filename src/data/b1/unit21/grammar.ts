import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_21_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 21 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-praeteritum-erzaehlen` (H, limited-productive): Präteritum as the narrative tense. Closed list of 35 verbs (see the unit metadata); the
 *     Perfekt stays the tense of conversation (↻ A2). Not taught here: Plusquamperfekt (Unit 29), Passiv, Relativsatz, Infinitiv mit zu.
 *  2. `b1-temporale-konnektoren` (M, productive): bevor, während, seitdem / seit, bis, nachdem (+ Perfekt, with a present-tense main clause or spoken
 *     narration). `als` / `wenn` are only revised (↻ A2-Unit 17).
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 */
export const UNIT_21_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-praeteritum-erzaehlen',
    category: 'tenses',
    level: 'B1',
    unit: 21,
    visual: 'timeline',
    title: l('Präteritum — рассказывать о прошлом в тексте', 'Präteritum — өткөн чак жөнүндө жазуу жүзүндө баяндоо'),
    summary: l(
      'В разговоре вы рассказываете о прошлом в Perfekt: «Ich bin gestern ins Kino gegangen». Когда вы пишете блог, письмо или рассказ и ведёте историю по порядку, по-немецки обычно используют Präteritum: «Ich ging ins Kino». У правильных глаголов добавляется -te (wohnen → wohnte), у неправильных меняется основа (kommen → kam). В этом юните вы учите около 35 самых частых глаголов; war, hatte, konnte, wollte и musste вы знаете из A2.',
      'Сүйлөшкөндө өткөн чак жөнүндө Perfekt менен айтасыз: «Ich bin gestern ins Kino gegangen». Блог, кат же аңгеме жазып, окуяны ирети менен баяндаганда немис тилинде көбүнчө Präteritum колдонулат: «Ich ging ins Kino». Туура этиштерге -te кошулат (wohnen → wohnte), туура эмес этиштерде уңгу өзгөрөт (kommen → kam). Бул бөлүмдө эң көп колдонулган 35чакты этишти үйрөнөсүз; war, hatte, konnte, wollte жана musste этиштерин A2 деңгээлинен билесиз.',
    ),
    discover: l(
      'Сравните: «Gestern bin ich zu spät nach Hause gekommen» и «Gestern kam ich zu spät nach Hause». Оба предложения верны. Где вы чаще услышите первое, а где прочитаете второе?',
      '«Gestern bin ich zu spät nach Hause gekommen» жана «Gestern kam ich zu spät nach Hause» сүйлөмдөрүн салыштырыңыз. Экөө тең туура. Биринчисин кайда көбүрөөк угасыз, экинчисин кайда окуйсуз?',
    ),
    why: l(
      'Чтобы рассказать историю — о поездке, о трудном дне, о важном решении — нужно «вести» рассказ: событие за событием. В письменном рассказе Perfekt звучит слишком по-разговорному, а Präteritum делает текст ровным и связным. Кроме того, почти каждый немецкий текст, который вы будете читать (новости, блоги, книги), написан в Präteritum.',
      'Окуяны — саякат, оор күн же маанилүү чечим жөнүндө — айтып берүү үчүн аңгемени бири-бирине улап жүргүзүү керек: окуя артынан окуя. Жазма аңгемеде Perfekt өтө оозеки угулат, ал эми Präteritum текстти бир калыпта жана байланыштуу кылат. Андан тышкары, окуй турган немис тексттеринин дээрлик бардыгы (жаңылыктар, блогдор, китептер) Präteritum менен жазылган.',
    ),
    when: [
      l(
        'Разговор — Perfekt: «Ich habe den Zug verpasst». Письменный рассказ, блог, письмо о событиях — Präteritum: «Ich verpasste den Zug».',
        'Сүйлөшүү — Perfekt: «Ich habe den Zug verpasst». Жазма аңгеме, блог, окуялар жөнүндө кат — Präteritum: «Ich verpasste den Zug».',
      ),
      l(
        'Правильные глаголы: основа + -te: wohnen → ich wohnte, wir wohnten; landen → ich landete; lachen → sie lachten. Если основа кончается на -t или -d, вставляется -e-: arbeiten → arbeitete.',
        'Туура этиштер: уңгу + -te: wohnen → ich wohnte, wir wohnten; landen → ich landete; lachen → sie lachten. Уңгу -t же -d менен бүтсө, -e- кошулат: arbeiten → arbeitete.',
      ),
      l(
        'Неправильные глаголы нужно знать наизусть — основа меняется: kommen → kam, gehen → ging, sehen → sah, finden → fand, nehmen → nahm, laufen → lief. У ich и er/sie/es окончания нет: ich kam, er kam; у wir и sie — -en: wir kamen.',
        'Туура эмес этиштерди жаттап алуу керек — уңгу өзгөрөт: kommen → kam, gehen → ging, sehen → sah, finden → fand, nehmen → nahm, laufen → lief. ich жана er/sie/es менен жалгоо жок: ich kam, er kam; wir жана sie менен — -en: wir kamen.',
      ),
      l(
        'Глагол стоит на втором месте: «Dann nahm ich den Zug». У глаголов с отделяемой приставкой приставка уходит в конец: «Ich wachte um sieben auf» — а в придаточном предложении слитно: «Als ich aufwachte, …».',
        'Этиш экинчи орунда турат: «Dann nahm ich den Zug». Приставкасы ажыраган этиштерде приставка сүйлөмдүн аягына чыгат: «Ich wachte um sieben auf» — ал эми als менен башталган сүйлөм бөлүгүндө этиш чогуу жазылат: «Als ich aufwachte, …».',
      ),
      l(
        'Из A2 вы знаете: war, hatte, konnte, wollte, musste. Именно они чаще всего встречаются и в разговоре.',
        'A2 деңгээлинен билесиз: war, hatte, konnte, wollte, musste. Алар оозеки сүйлөөдө да эң көп кездешет.',
      ),
    ],
    examples: [
      {
        de: 'Ich landete am Abend in Frankfurt.',
        ru: 'Я прилетел вечером во Франкфурт.',
        ky: 'Мен кечинде Франкфуртка учуп келдим.',
        focus: 'landete (правильный глагол: -te)',
      },
      {
        de: 'Dann nahm ich den Zug nach Kassel.',
        ru: 'Потом я сел на поезд до Касселя.',
        ky: 'Анан мен Касселге поезд менен жөнөдүм.',
        focus: 'nahm (неправильный: nehmen → nahm)',
      },
      {
        de: 'Im Zug schlief ich ein.',
        ru: 'В поезде я заснул.',
        ky: 'Поездде мен уктап калдым.',
        focus: 'schlief … ein (отделяемая приставка)',
      },
      {
        de: 'Er holte mich eine Stunde später ab.',
        ru: 'Через час он забрал меня.',
        ky: 'Ал мени бир сааттан кийин алып кетти.',
        focus: 'holte … ab',
      },
      {
        de: 'Wir lachten viel an diesem Abend.',
        ru: 'В тот вечер мы много смеялись.',
        ky: 'Ошол кечте биз көп күлдүк.',
        focus: 'lachten (wir: -en)',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich kommte gestern an.',
        right: 'Ich kam gestern an.',
        note: l(
          'Kommen — неправильный глагол: основа меняется (kam), -te не добавляется.',
          'Kommen — туура эмес этиш: уңгу өзгөрөт (kam), -te кошулбайт.',
        ),
      },
      {
        wrong: 'Dann ich nahm den Zug.',
        right: 'Dann nahm ich den Zug.',
        note: l(
          'После «Dann» глагол остаётся на втором месте, подлежащее идёт за ним.',
          '«Dann» сөзүнөн кийин этиш экинчи орунда калат, ээ андан кийин келет.',
        ),
      },
      {
        wrong: 'Ich habe den Zug nahm.',
        right: 'Ich nahm den Zug.',
        note: l(
          'Нельзя смешивать: либо Perfekt («Ich habe den Zug genommen»), либо Präteritum («Ich nahm den Zug»).',
          'Аралаштырууга болбойт: же Perfekt («Ich habe den Zug genommen»), же Präteritum («Ich nahm den Zug»).',
        ),
      },
      {
        wrong: 'Er rufte mich an.',
        right: 'Er rief mich an.',
        note: l(
          'Rufen — неправильный глагол: rief. Приставка an уходит в конец.',
          'Rufen — туура эмес этиш: rief. an приставкасы сүйлөмдүн аягына чыгат.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich arbeitete drei Jahre in einem Restaurant.',
        ru: 'Я три года работал в ресторане.',
        ky: 'Мен үч жыл ресторанда иштедим.',
        focus: 'arbeitete',
      },
      { de: 'Im Sommer fuhren wir nach Italien.', ru: 'Летом мы ездили в Италию.', ky: 'Жайында биз Италияга бардык.', focus: 'fuhren' },
      {
        de: 'Am Montag begann mein neuer Job.',
        ru: 'В понедельник началась моя новая работа.',
        ky: 'Дүйшөмбүдө менин жаңы жумушум башталды.',
        focus: 'begann',
      },
    ],
    dialogue: [
      {
        speaker: 'Lena',
        text: 'Wie war dein erster Tag in Köln?',
        ru: 'Как прошёл твой первый день в Кёльне?',
        ky: 'Кёльндөгү биринчи күнүң кандай өттү?',
      },
      {
        speaker: 'Tom',
        text: 'Ich habe fast den Zug verpasst. Ich schreibe gerade einen Blog darüber.',
        ru: 'Я чуть не опоздал на поезд. Сейчас пишу об этом блог.',
        ky: 'Мен поездге аз калып жетпей калдым. Азыр ал жөнүндө блог жазып жатам.',
      },
      { speaker: 'Lena', text: 'Und was schreibst du?', ru: 'И что ты пишешь?', ky: 'Эмне деп жазып жатасың?' },
      {
        speaker: 'Tom',
        text: 'Ich verpasste fast den Zug. Dann half mir ein Fremder.',
        ru: 'Я едва не опоздал на поезд. Потом мне помог незнакомец.',
        ky: 'Мен поездге аз калып жетпей калдым. Анан мага бир бейтааныш адам жардам берди.',
      },
      {
        speaker: 'Lena',
        text: 'Interessant! Im Blog schreibst du ganz anders als beim Sprechen.',
        ru: 'Интересно! В блоге ты пишешь совсем не так, как говоришь.',
        ky: 'Кызык! Блогдо сен сүйлөгөндөн таптакыр башкача жазып жатасың.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о важном дне в вашей жизни — как будто пишете блог. Используйте минимум три глагола в Präteritum, например: kam, wohnte, war, fand.',
        'Жашооңуздагы маанилүү күн жөнүндө блог жазып жаткандай айтып бериңиз. Präteritum формасындагы кеминде үч этишти колдонуңуз, мисалы: kam, wohnte, war, fand.',
      ),
      sample:
        'Vor drei Jahren kam ich nach Deutschland. Ich wohnte zuerst bei einem Freund. Es war nicht leicht, aber ich fand schnell Arbeit.',
      keywords: ['kam', 'wohnte', 'war', 'fand'],
    },
    source: UNIT_21_SOURCE,
  },
  {
    id: 'b1-temporale-konnektoren',
    category: 'conjunctions',
    level: 'B1',
    unit: 21,
    visual: 'verbpos',
    title: l('bevor, während, seitdem, bis, nachdem — порядок событий', 'bevor, während, seitdem, bis, nachdem — окуялардын ирети'),
    summary: l(
      'Эти союзы показывают, как события связаны во времени: bevor — «до того как», während — «в то время как», seitdem — «с тех пор как», bis — «пока не», nachdem — «после того как». Они вводят придаточное предложение: спрягаемый глагол стоит в самом конце. Если придаточное идёт первым, то сразу за запятой следует глагол главного предложения: «Bevor ich ging, rief ich an». С als и wenn вы познакомились в A2 — здесь мы только повторяем их.',
      'Бул байламталар окуялар убакыт боюнча кандай байланышканын көрсөтөт: bevor — «…гандан мурун», während — «…ып жатканда», seitdem — «…ган убактан бери», bis — «…ганга чейин», nachdem — «…гандан кийин». Алар сүйлөмдүн өзүнчө бөлүгүн киргизет: бул бөлүктө этиш эң аягында турат. Бул бөлүк биринчи келсе, үтүрдөн кийин дароо башкы бөлүктүн этиши турат: «Bevor ich ging, rief ich an». als жана wenn менен A2 деңгээлинде таанышкансыз — бул жерде аларды кайталайбыз гана.',
    ),
    discover: l(
      'Сравните: «Ich rief an. Dann ging ich» и «Bevor ich ging, rief ich an». Что изменилось в порядке слов — и как придаточное предложение показывает, что произошло раньше?',
      '«Ich rief an. Dann ging ich» жана «Bevor ich ging, rief ich an» сүйлөмдөрүн салыштырыңыз. Сөздөрдүн иретинде эмне өзгөрдү жана bevor менен башталган бөлүк кайсынысы мурда болгонун кантип көрсөтөт?',
    ),
    why: l(
      'История понятна, когда слушатель знает порядок событий. «Dann» и «danach» только ставят события в ряд. Союзы bevor, während, seitdem, bis и nachdem показывают, что произошло раньше, что одновременно и что длилось до какого-то момента — так ваш рассказ становится связным.',
      'Угуучу окуялардын иретин билгенде баян түшүнүктүү болот. «Dann» жана «danach» окуяларды катарга гана тизет. bevor, während, seitdem, bis жана nachdem байламталары кайсы окуя мурда болгонун, кайсынысы бир убакта өткөнүн жана кайсы учурга чейин созулганын көрсөтөт — ошентип баяныңыз байланыштуу болот.',
    ),
    when: [
      l(
        'bevor: сначала главное событие, потом то, что в придаточном: «Bevor ich ins Bett gehe, lese ich noch ein Kapitel».',
        'bevor: адегенде башкы бөлүктөгү окуя, андан кийин bevor менен башталган бөлүктөгүсү: «Bevor ich ins Bett gehe, lese ich noch ein Kapitel».',
      ),
      l(
        'während: два события происходят одновременно: «Während ich im Zug saß, schlief ich ein».',
        'während: эки окуя бир убакта болот: «Während ich im Zug saß, schlief ich ein».',
      ),
      l(
        'seitdem (или seit): начало в прошлом, продолжается до сегодня: «Seitdem ich in Deutschland wohne, laufe ich jeden Morgen».',
        'seitdem (же seit): башталышы өткөндө, бүгүнкүгө чейин уланат: «Seitdem ich in Deutschland wohne, laufe ich jeden Morgen».',
      ),
      l(
        'bis: действие продолжается до наступления момента: «Ich wartete, bis der Bus kam». Не путайте с предлогом bis («bis morgen»).',
        'bis: аракет белгилүү учур келгенге чейин уланат: «Ich wartete, bis der Bus kam». bis предлогу менен чаташтырбаңыз («bis morgen»).',
      ),
      l(
        'nachdem + Perfekt: «Nachdem ich gegessen habe, gehe ich spazieren». В разговоре о прошлом часто звучит и так: «Nachdem wir gegessen haben, sind wir spazieren gegangen». Строгая форма для рассказа в прошлом (Plusquamperfekt) появится позже, в юните 29.',
        'nachdem + Perfekt: «Nachdem ich gegessen habe, gehe ich spazieren». Өткөн чак жөнүндө сүйлөшкөндө мындай да айтылат: «Nachdem wir gegessen haben, sind wir spazieren gegangen». Өткөн чакта баяндоонун так формасы (Plusquamperfekt) кийинчерээк, 29-бөлүмдө келет.',
      ),
    ],
    examples: [
      {
        de: 'Bevor ich den Bahnhof fand, lief ich eine Stunde durch den Flughafen.',
        ru: 'Прежде чем я нашёл вокзал, я целый час шёл по аэропорту.',
        ky: 'Вокзалды тапканга чейин мен бир саат аэропорттун ичинде жүрдүм.',
        focus: 'bevor … fand, lief ich',
      },
      {
        de: 'Während ich im Zug saß, schlief ich ein.',
        ru: 'Пока я сидел в поезде, я заснул.',
        ky: 'Поездде отурганымда мен уктап калдым.',
        focus: 'während … saß',
      },
      {
        de: 'Seitdem ich in Deutschland wohne, laufe ich jeden Morgen im Park.',
        ru: 'С тех пор как я живу в Германии, я каждое утро бегаю в парке.',
        ky: 'Германияда жашаганымдан бери мен ар күнү эртең менен паркта жүгүрөм.',
        focus: 'seitdem … wohne, laufe ich',
      },
      {
        de: 'Ich wartete, bis der Bus kam.',
        ru: 'Я ждал, пока не пришёл автобус.',
        ky: 'Мен автобус келгенге чейин күттүм.',
        focus: 'bis … kam',
      },
      {
        de: 'Nachdem ich gegessen habe, gehe ich spazieren.',
        ru: 'После того как я поем, я иду гулять.',
        ky: 'Тамактанып бүткөндөн кийин мен сейилдегени чыгам.',
        focus: 'nachdem … gegessen habe',
      },
    ],
    mistakes: [
      {
        wrong: 'Bevor ich ging, ich rief an.',
        right: 'Bevor ich ging, rief ich an.',
        note: l(
          'Придаточное предложение стоит на первом месте, поэтому за запятой сразу идёт глагол главного предложения: rief ich.',
          'Бүтүндөмө сүйлөм биринчи орунда турат, ошондуктан үтүрдөн кийин дароо башкы бөлүктүн этиши келет: rief ich.',
        ),
      },
      {
        wrong: 'Seitdem ich wohne in Berlin, lerne ich Deutsch.',
        right: 'Seitdem ich in Berlin wohne, lerne ich Deutsch.',
        note: l(
          'В придаточном предложении спрягаемый глагол стоит в самом конце.',
          'seitdem менен башталган бөлүктө этиш эң аягында турат.',
        ),
      },
      {
        wrong: 'Ich wartete, bis kam der Bus.',
        right: 'Ich wartete, bis der Bus kam.',
        note: l(
          'После bis (как союза) глагол уходит в конец придаточного предложения.',
          'bis (байламта катары) сөзүнөн кийин этиш сүйлөм бөлүгүнүн аягына өтөт.',
        ),
      },
      {
        wrong: 'Nachdem ich gegessen habe, ich gehe spazieren.',
        right: 'Nachdem ich gegessen habe, gehe ich spazieren.',
        note: l(
          'Придаточное предложение первое — следом глагол главного: gehe ich.',
          'Бүтүндөмө сүйлөм биринчи — андан кийин башкы бөлүктүн этиши: gehe ich.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Bevor ich ins Bett gehe, lese ich noch ein Kapitel.',
        ru: 'Перед сном я читаю ещё одну главу.',
        ky: 'Уктаардан мурун мен дагы бир бапты окуйм.',
        focus: 'bevor',
      },
      {
        de: 'Wir blieben im Café, bis es dunkel war.',
        ru: 'Мы просидели в кафе, пока не стемнело.',
        ky: 'Биз караңгы болгонго чейин кафеде отурдук.',
        focus: 'bis',
      },
      {
        de: 'Seitdem ich Deutsch lerne, verstehe ich die Nachrichten besser.',
        ru: 'С тех пор как я учу немецкий, я лучше понимаю новости.',
        ky: 'Немис тилин үйрөнгөндөн бери мен жаңылыктарды жакшыраак түшүнөм.',
        focus: 'seitdem',
      },
    ],
    dialogue: [
      {
        speaker: 'Ali',
        text: 'Seit wann wohnst du in Bremen?',
        ru: 'Как давно ты живёшь в Бремене?',
        ky: 'Бременде качантан бери жашайсың?',
      },
      {
        speaker: 'Mira',
        text: 'Seitdem ich meinen Job habe. Das sind jetzt zwei Jahre.',
        ru: 'С тех пор как у меня эта работа. Уже два года.',
        ky: 'Жумушум болгондон бери. Азыр эки жыл болду.',
      },
      { speaker: 'Ali', text: 'Und was hast du vorher gemacht?', ru: 'А что ты делала раньше?', ky: 'Ал эми мурда эмне кылчу элең?' },
      {
        speaker: 'Mira',
        text: 'Bevor ich hierher kam, studierte ich in Almaty. Ich blieb dort, bis ich fertig war.',
        ru: 'Прежде чем приехать сюда, я училась в Алматы. Я оставалась там, пока не закончила.',
        ky: 'Бул жакка келгенче Алматыда окуганмын. Бүткөнчө ошол жерде калдым.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что вы делали до переезда и что изменилось с тех пор. Используйте bevor и seitdem.',
        'Көчүп келгенге чейин эмне кылганыңызды жана ошондон бери эмне өзгөргөнүн айтып бериңиз. bevor жана seitdem колдонуңуз.',
      ),
      sample: 'Bevor ich nach Deutschland kam, arbeitete ich in Bischkek. Seitdem ich hier wohne, lerne ich jeden Tag Deutsch.',
      keywords: ['bevor', 'seitdem', 'kam', 'wohne'],
    },
    source: UNIT_21_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_21_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Dann nahm ich den Zug nach Kassel.',
    ru: 'Потом я сел на поезд до Касселя.',
    ky: 'Анан мен Касселге поезд менен жөнөдүм.',
    word: 'nahm',
    conceptId: 'b1-praeteritum-erzaehlen',
    reason: l(
      'Nehmen — неправильный глагол. В Präteritum его основа меняется: nehmen → nahm. У ich окончания нет: ich nahm.',
      'Nehmen — туура эмес этиш. Präteritum формасында анын уңгусу өзгөрөт: nehmen → nahm. ich менен жалгоо жок: ich nahm.',
    ),
    more: [
      { de: 'Er nahm den Bus.', ru: 'Он поехал на автобусе.', ky: 'Ал автобус менен жөнөдү.' },
      { de: 'Wir nahmen ein Taxi.', ru: 'Мы взяли такси.', ky: 'Биз такси алдык.' },
    ],
  },
  {
    sentence: 'Bevor ich ging, rief ich an.',
    ru: 'Перед уходом я позвонил.',
    ky: 'Кетерден мурун мен чалдым.',
    word: 'rief',
    conceptId: 'b1-temporale-konnektoren',
    reason: l(
      'Придаточное предложение с bevor стоит первым, поэтому сразу после запятой идёт глагол главного предложения: rief ich (не «ich rief»).',
      'bevor менен башталган сүйлөм бөлүгү биринчи турат, ошондуктан үтүрдөн кийин дароо башкы бөлүктүн этиши келет: rief ich («ich rief» эмес).',
    ),
    more: [
      {
        de: 'Nachdem ich gegessen habe, gehe ich spazieren.',
        ru: 'Поев, я иду гулять.',
        ky: 'Тамактанып бүткөндөн кийин сейилдегени чыгам.',
      },
      { de: 'Während ich schlief, kam er nach Hause.', ru: 'Пока я спал, он пришёл домой.', ky: 'Мен уктап жатканда ал үйгө келди.' },
    ],
  },
  {
    sentence: 'Als ich aufwachte, stand der Zug schon in Göttingen.',
    ru: 'Когда я проснулся, поезд уже стоял в Геттингене.',
    ky: 'Мен ойгонгондо поезд Геттингенде эле турган.',
    word: 'aufwachte',
    conceptId: 'b1-praeteritum-erzaehlen',
    reason: l(
      'В придаточном предложении глагол с отделяемой приставкой пишется слитно и стоит в конце: als ich aufwachte. В главном предложении приставка уходит в конец: Ich wachte auf.',
      'als менен башталган сүйлөм бөлүгүндө приставкасы бар этиш чогуу жазылып, аягында турат: als ich aufwachte. Башкы бөлүктө приставка сүйлөмдүн аягына чыгат: Ich wachte auf.',
    ),
    more: [
      { de: 'Ich wachte um sieben auf.', ru: 'Я проснулся в семь.', ky: 'Мен саат жетиде ойгондум.' },
      { de: 'Sie holte mich vom Bahnhof ab.', ru: 'Она забрала меня с вокзала.', ky: 'Ал мени вокзалдан алып кетти.' },
    ],
  },
]
