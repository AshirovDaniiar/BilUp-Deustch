import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_25_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 25 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-konjunktiv2-ratschlaege` (H, productive): the Konjunktiv II forms würde + Infinitiv, sollte, könnte, hätte, wäre for ADVICE and POLITE REQUESTS
 *     (An deiner Stelle würde ich …; Du solltest …; Du könntest …; Es wäre gut, … zu …; Hätten Sie …?), with the explicit contrast A2 `sollen` vs B1 `sollte`.
 *     NOT taught: unreal conditions and wishes (wenn ich … hätte, würde ich …; Ich wünschte, …) — Unit 27 — and the Konjunktiv II of the past (Unit 31, receptive).
 *  2. `b1-reflexive-dativ` (M, limited-productive): a CLOSED list of 10 verbs / expressions with the reflexive pronoun in the Dativ (mir die Hände waschen …).
 * Not taught here: Passiv beyond the A2/Unit 24 recycling, verbs with a prepositional object (Unit 28), relative clauses with a preposition (Unit 29).
 * The material is for language learning; it gives no medical diagnosis or treatment advice and always points to professional help.
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes the
 * grammar idea and does not use invented grammatical labels (see docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_25_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-konjunktiv2-ratschlaege',
    category: 'konjunktiv',
    level: 'B1',
    unit: 25,
    visual: 'modal',
    title: l(
      'Konjunktiv II (würde, sollte, könnte, hätte, wäre) — мягкий совет и вежливая просьба',
      'Konjunktiv II (würde, sollte, könnte, hätte, wäre) — жумшак кеңеш жана сылык өтүнүч',
    ),
    summary: l(
      'Konjunktiv II делает речь мягче и вежливее. Для совета: «An deiner Stelle würde ich mehr schlafen» («на твоём месте я бы больше спал»). Для большинства глаголов используется würde + инфинитив в конце (ich würde, du würdest, er/sie/es würde, wir würden, ihr würdet, sie würden). Отдельные формы нужны у пяти слов: sollte («тебе стоило бы»), könnte («ты мог бы», «можно было бы»), hätte (Hätten Sie Zeit? Ich hätte gern …) и wäre (Es wäre gut, … zu …). Сравните с A2: «Du sollst mehr schlafen» звучит как указание, «Du solltest mehr schlafen» — как совет.',
      'Konjunktiv II сүйлөөнү жумшак жана сылык кылат. Кеңеш үчүн: «An deiner Stelle würde ich mehr schlafen» («сенин ордуңда мен көбүрөөк уктамакмын»). Көпчүлүк этиштер менен würde + аягындагы инфинитив колдонулат (ich würde, du würdest, er/sie/es würde, wir würden, ihr würdet, sie würden). Беш сөздө өзүнчө форма бар: sollte («сага ылайыктуу болмок»), könnte («сен кыла алмаксың», «мүмкүн болмок»), hätte (Hätten Sie Zeit? Ich hätte gern …) жана wäre (Es wäre gut, … zu …). A2 менен салыштырыңыз: «Du sollst mehr schlafen» буйрукка окшош угулат, «Du solltest mehr schlafen» — кеңеш сыяктуу.',
    ),
    discover: l(
      'Сравните: «Du sollst mehr schlafen» и «Du solltest mehr schlafen». Какое предложение звучит как приказ, а какое — как совет? Чем отличаются глаголы и где стоит schlafen?',
      '«Du sollst mehr schlafen» жана «Du solltest mehr schlafen» сүйлөмдөрүн салыштырыңыз. Кайсысы буйрукка, кайсысы кеңешке окшош? Этиштер эмнеси менен айырмаланат жана schlafen кайда турат?',
    ),
    why: l(
      'На A2 вы учились говорить «Du sollst …» и «Bitte …». На B1 нужно давать советы друзьям, спрашивать совета и вежливо просить в поликлинике или на работе: «Könnten Sie mir bitte helfen?», «Hätten Sie am Dienstag einen Termin frei?». Конструкции с Konjunktiv II слышны в каждом разговоре о здоровье и отношениях. Помните: советы в этом юните — для тренировки языка; при проблемах со здоровьем нужно обращаться к врачу.',
      'A2 деңгээлинде сиз «Du sollst …» жана «Bitte …» деп айтууну үйрөндүңүз. B1 деңгээлинде достойго кеңеш берүү, кеңеш сурап алуу жана поликлиникада же жумушта сылык өтүнүү керек: «Könnten Sie mir bitte helfen?», «Hätten Sie am Dienstag einen Termin frei?». Konjunktiv II формалары ден соолук жана мамилелер жөнүндөгү ар бир сүйлөшүүдө угулат. Эсиңизде болсун: бул бөлүмдөгү кеңештер тилди машыктыруу үчүн; ден соолукта көйгөй болсо, дарыгерге кайрылыңыз.',
    ),
    when: [
      l(
        'Шаг 1 — совет с würde: «An deiner Stelle würde ich früher ins Bett gehen». Würde стоит на втором месте, инфинитив — в самом конце. После würde частицы zu нет.',
        '1-кадам — würde менен кеңеш: «An deiner Stelle würde ich früher ins Bett gehen». würde экинчи орунда турат, инфинитив — эң аягында. würde этишинен кийин zu бөлүкчөсү коюлбайт.',
      ),
      l(
        'Шаг 2 — sollte и könnte: «Du solltest mehr Wasser trinken», «Du könntest abends spazieren gehen». Окончания: ich sollte / könnte, du solltest / könntest, er sollte / könnte, wir sollten / könnten, ihr solltet / könntet. Инфинитив — в конце, без zu.',
        '2-кадам — sollte жана könnte: «Du solltest mehr Wasser trinken», «Du könntest abends spazieren gehen». Уландылар: ich sollte / könnte, du solltest / könntest, er sollte / könnte, wir sollten / könnten, ihr solltet / könntet. Инфинитив — аягында, zu жок.',
      ),
      l(
        'Шаг 3 — wäre и hätte: «Es wäre gut, regelmäßig Pause zu machen» (Unit 23: zu + инфинитив). Вежливый вопрос: «Hätten Sie am Dienstag einen Termin frei?», «Könnten Sie das bitte wiederholen?», «Ich hätte gern einen Termin».',
        '3-кадам — wäre жана hätte: «Es wäre gut, regelmäßig Pause zu machen» (23-бөлүм: zu + инфинитив). Сылык суроо: «Hätten Sie am Dienstag einen Termin frei?», «Könnten Sie das bitte wiederholen?», «Ich hätte gern einen Termin».',
      ),
      l(
        'Контраст с A2: sollst — указание («Der Arzt sagt, du sollst …»), solltest — мягкий совет. В этом юните Konjunktiv II — только для советов и вежливых просьб. Нереальные условия («Wenn ich Zeit hätte, würde ich …») появятся в юните 27.',
        'A2 менен контраст: sollst — көрсөтмө («Der Arzt sagt, du sollst …»), solltest — жумшак кеңеш. Бул бөлүмдө Konjunktiv II кеңеш жана сылык өтүнүч үчүн гана. Чыныгы эмес шарттар («Wenn ich Zeit hätte, würde ich …») 27-бөлүмдө келет.',
      ),
    ],
    examples: [
      {
        de: 'An deiner Stelle würde ich früher ins Bett gehen.',
        ru: 'На твоём месте я бы раньше ложился спать.',
        ky: 'Сенин ордуңда мен эртерээк жатмакмын.',
        focus: 'würde + Infinitiv am Ende',
      },
      {
        de: 'Du solltest mehr Wasser trinken.',
        ru: 'Тебе стоило бы пить больше воды.',
        ky: 'Сен көбүрөөк суу ичишиң керек болмок.',
        focus: 'sollte (Ratschlag; A2: du sollst = Anweisung)',
      },
      {
        de: 'Du könntest abends einen Spaziergang machen.',
        ru: 'Ты мог бы вечером погулять.',
        ky: 'Сен кечинде сейилдеп келишиң мүмкүн.',
        focus: 'könnte (Vorschlag)',
      },
      {
        de: 'Es wäre gut, regelmäßig Pause zu machen.',
        ru: 'Было бы хорошо регулярно делать перерывы.',
        ky: 'Үзгүлтүксүз тыныгуу жасаганыбыз жакшы болмок.',
        focus: 'wäre + zu-Infinitiv',
      },
      {
        de: 'Hätten Sie am Dienstag einen Termin frei?',
        ru: 'У вас найдётся свободное время во вторник?',
        ky: 'Шейшембиде бош убактыңыз барбы?',
        focus: 'hätte (höfliche Frage)',
      },
    ],
    mistakes: [
      {
        wrong: 'An deiner Stelle ich würde mehr schlafen.',
        right: 'An deiner Stelle würde ich mehr schlafen.',
        note: l(
          'После вводной части («An deiner Stelle») глагол würde стоит на первом месте, перед ich.',
          'Киришүү бөлүгүнөн («An deiner Stelle») кийин würde этиши биринчи орунда, ich сөзүнүн алдында турат.',
        ),
      },
      {
        wrong: 'Ich würde zum Arzt gehe.',
        right: 'Ich würde zum Arzt gehen.',
        note: l(
          'После würde нужен инфинитив (gehen) в конце предложения, а не спрягаемая форма.',
          'würde этишинен кийин сүйлөмдүн аягында инфинитив (gehen) керек, жакка жараша өзгөргөн форма эмес.',
        ),
      },
      {
        wrong: 'Du sollst vielleicht mehr schlafen.',
        right: 'Du solltest vielleicht mehr schlafen.',
        note: l(
          'Для мягкого совета нужен Konjunktiv II: solltest. Форма sollst звучит как указание.',
          'Жумшак кеңеш үчүн Konjunktiv II керек: solltest. sollst формасы көрсөтмө сыяктуу угулат.',
        ),
      },
      {
        wrong: 'Du könntest zu spazieren gehen.',
        right: 'Du könntest spazieren gehen.',
        note: l(
          'После könnte (как после других модальных глаголов) частица zu не ставится.',
          'könnte этишинен кийин (башка модаль этиштер сыяктуу) zu бөлүкчөсү коюлбайт.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Könnten Sie das bitte noch einmal sagen?',
        ru: 'Не могли бы вы повторить ещё раз?',
        ky: 'Муну дагы бир жолу айтып берсеңиз болобу?',
        focus: 'könnte (höfliche Bitte)',
      },
      {
        de: 'Du solltest nicht so viel arbeiten.',
        ru: 'Тебе не стоило бы так много работать.',
        ky: 'Сен ушунчалык көп иштебешиң керек болмок.',
        focus: 'solltest',
      },
      {
        de: 'Wir könnten am Wochenende zusammen wandern gehen.',
        ru: 'Мы могли бы в выходные вместе сходить в поход.',
        ky: 'Биз дем алыш күндөрү чогуу жөө жүрүшкө чыга алмакпыз.',
        focus: 'könnten (Vorschlag)',
      },
    ],
    dialogue: [
      {
        speaker: 'Lena',
        text: 'Ich schlafe schlecht und bin immer müde.',
        ru: 'Я плохо сплю и всё время устала.',
        ky: 'Мен жаман уктайм жана дайыма чарчап жүрөм.',
      },
      {
        speaker: 'Tom',
        text: 'An deiner Stelle würde ich abends kein Handy mehr benutzen.',
        ru: 'На твоём месте я бы вечером больше не пользовался телефоном.',
        ky: 'Сенин ордуңда мен кечинде телефонду колдонбой коймокмун.',
      },
      {
        speaker: 'Lena',
        text: 'Meinst du? Das ist schwer für mich.',
        ru: 'Думаешь? Мне это трудно.',
        ky: 'Ушундай дейсиңби? Мага бул кыйын.',
      },
      {
        speaker: 'Tom',
        text: 'Du könntest es eine Woche probieren. Es wäre gut, früher ins Bett zu gehen.',
        ru: 'Ты могла бы попробовать неделю. Было бы хорошо раньше ложиться спать.',
        ky: 'Сен бир жума аракет кыла алмаксың. Эртерээк жатканың жакшы болмок.',
      },
      {
        speaker: 'Lena',
        text: 'Okay, das probiere ich. Und bei starken Beschwerden gehe ich zum Arzt.',
        ru: 'Хорошо, попробую. А если будут сильные недомогания, пойду к врачу.',
        ky: 'Макул, аракет кылам. Ал эми катуу ыңгайсыздык болсо, дарыгерге барам.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Ваш друг плохо спит и много работает. Дайте ему три совета: «An deiner Stelle würde ich …», «Du solltest …», «Du könntest …».',
        'Досуңуз жаман уктайт жана көп иштейт. Ага үч кеңеш бериңиз: «An deiner Stelle würde ich …», «Du solltest …», «Du könntest …».',
      ),
      sample:
        'An deiner Stelle würde ich früher ins Bett gehen. Du solltest weniger Kaffee trinken. Du könntest abends spazieren gehen.',
      keywords: ['würde', 'solltest', 'könntest'],
    },
    source: UNIT_25_SOURCE,
  },
  {
    id: 'b1-reflexive-dativ',
    category: 'verbs',
    level: 'B1',
    unit: 25,
    visual: 'conjugation',
    title: l(
      'Reflexive Verben mit Dativ (mir die Hände waschen) — mir / dir вместо mich / dich',
      'Dativ менен өздүк этиштер (mir die Hände waschen) — mich / dich ордуна mir / dir',
    ),
    summary: l(
      'Если в предложении уже есть дополнение в Akkusativ (часть тела, вещь), возвратное местоимение ставится в Dativ: «Ich wasche mir die Hände» («я мою себе руки»). Dativ отличается от Akkusativ только у ich и du: mir / dir (вместо mich / dich); дальше формы те же: er/sie/es sich, wir uns, ihr euch, sie sich. То же — в нескольких выражениях со смыслом «для себя»: sich etwas merken, sich etwas überlegen. В этом юните вы учите закрытый список из 10 выражений: sich die Hände waschen, sich die Zähne putzen, sich wehtun, sich etwas merken, sich etwas überlegen, sich etwas vorstellen, sich Zeit nehmen, sich etwas wünschen, sich den Arm brechen, sich etwas kaufen.',
      'Сүйлөмдө Akkusativ толуктоочу (дене мүчөсү, буюм) бар болсо, sich сыяктуу ат атооч Dativде коюлат: «Ich wasche mir die Hände» («мен өзүмө колумду жуудум»). Dativ Akkusativден ich жана du боюнча гана айырмаланат: mir / dir (mich / dich ордуна); андан ары формалар бирдей: er/sie/es sich, wir uns, ihr euch, sie sich. «Өзү үчүн» маанисиндеги бир нече туюндурмада да ушундай: sich etwas merken, sich etwas überlegen. Бул бөлүмдө 10 туюндурмадан турган жабык тизмени үйрөнөсүз: sich die Hände waschen, sich die Zähne putzen, sich wehtun, sich etwas merken, sich etwas überlegen, sich etwas vorstellen, sich Zeit nehmen, sich etwas wünschen, sich den Arm brechen, sich etwas kaufen.',
    ),
    discover: l(
      'Сравните: «Ich wasche mich» и «Ich wasche mir die Hände». Что в предложении появилось после глагола? Как изменилось местоимение: mich → …?',
      '«Ich wasche mich» жана «Ich wasche mir die Hände» сүйлөмдөрүн салыштырыңыз. Этиштен кийин сүйлөмдө эмне пайда болду? Ат атооч кандай өзгөрдү: mich → …?',
    ),
    why: l(
      'В A2 вы использовали только «Ich wasche mich», «Ich fühle mich». Но когда речь идёт о здоровье и ежедневных привычках, нужны фразы «Ich putze mir die Zähne», «Ich habe mir wehgetan», «Ich nehme mir Zeit für Sport». Это очень частые выражения — и в поликлинике, и в разговоре с друзьями.',
      'A2 деңгээлинде сиз «Ich wasche mich», «Ich fühle mich» гана колдондуңуз. Бирок ден соолук жана күнүмдүк адаттар жөнүндө сөз болгондо «Ich putze mir die Zähne», «Ich habe mir wehgetan», «Ich nehme mir Zeit für Sport» керек. Булар абдан көп колдонулган туюндурмалар — поликлиникада да, достор менен сүйлөшүүдө да.',
    ),
    when: [
      l(
        'Шаг 1 — есть ли Akkusativ-дополнение? «Ich wasche mich» (Akkusativ: я мою себя) — но «Ich wasche mir die Hände» (die Hände — Akkusativ, а «себе» — Dativ). Часть тела почти всегда идёт с Dativ: не «meine Hände», а «mir die Hände».',
        '1-кадам — Akkusativ толуктоочу барбы? «Ich wasche mich» (Akkusativ: өзүмдү жууйм) — бирок «Ich wasche mir die Hände» (die Hände — Akkusativ, ал эми «өзүмө» — Dativ). Дене мүчөсү дээрлик дайыма Dativ менен келет: «meine Hände» эмес, «mir die Hände».',
      ),
      l(
        'Шаг 2 — формы Dativ: ich → mir, du → dir, er/sie/es → sich, wir → uns, ihr → euch, sie/Sie → sich. «Putzt du dir die Zähne?», «Er hat sich den Arm gebrochen», «Wir nehmen uns Zeit».',
        '2-кадам — Dativ формалары: ich → mir, du → dir, er/sie/es → sich, wir → uns, ihr → euch, sie/Sie → sich. «Putzt du dir die Zähne?», «Er hat sich den Arm gebrochen», «Wir nehmen uns Zeit».',
      ),
      l(
        'Шаг 3 — «для себя»: sich etwas merken («Ich merke mir den Termin»), sich etwas überlegen («Ich überlege mir das»), sich etwas vorstellen («Das kann ich mir gut vorstellen»), sich etwas wünschen, sich etwas kaufen, sich Zeit nehmen.',
        '3-кадам — «өзү үчүн»: sich etwas merken («Ich merke mir den Termin»), sich etwas überlegen («Ich überlege mir das»), sich etwas vorstellen («Das kann ich mir gut vorstellen»), sich etwas wünschen, sich etwas kaufen, sich Zeit nehmen.',
      ),
      l(
        'Это закрытый список: вы не обязаны использовать другие глаголы с Dativ-местоимением. Если Akkusativ-дополнения нет — по-прежнему mich / dich: «Ich ruhe mich aus», «Ich fühle mich gut».',
        'Бул жабык тизме: Dativ ат атоочу бар башка этиштерди колдонууга милдеттүү эмессиз. Akkusativ толуктоочу жок болсо — мурдагыдай mich / dich: «Ich ruhe mich aus», «Ich fühle mich gut».',
      ),
    ],
    examples: [
      {
        de: 'Ich wasche mir vor dem Essen die Hände.',
        ru: 'Я мою руки перед едой.',
        ky: 'Мен тамактанардан мурун колумду жуучумун.',
        focus: 'mir (ich) + die Hände (Akkusativ)',
      },
      {
        de: 'Putzt du dir jeden Abend die Zähne?',
        ru: 'Ты чистишь зубы каждый вечер?',
        ky: 'Сен күн сайын кечинде тишиңди тазалайсыңбы?',
        focus: 'dir (du)',
      },
      {
        de: 'Er hat sich beim Sport den Arm gebrochen.',
        ru: 'Он сломал руку во время спорта.',
        ky: 'Ал спорт учурунда колун сындырып алды.',
        focus: 'sich (er, Dativ) + den Arm (Akkusativ)',
      },
      {
        de: 'Ich merke mir den Termin: Dienstag um zehn.',
        ru: 'Я запоминаю время приёма: вторник, десять часов.',
        ky: 'Мен кабыл алуу убактысын эстеп калам: шейшемби, саат он.',
        focus: 'sich etwas merken',
      },
      {
        de: 'Wir nehmen uns am Sonntag viel Zeit.',
        ru: 'В воскресенье мы выделим много времени.',
        ky: 'Жекшембиде биз көп убакыт бөлөбүз.',
        focus: 'uns (wir) · sich Zeit nehmen',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich wasche mich die Hände.',
        right: 'Ich wasche mir die Hände.',
        note: l(
          'Akkusativ-дополнение уже есть (die Hände), поэтому возвратное местоимение — Dativ: mir, а не mich.',
          'Akkusativ толуктоочу бар (die Hände), ошондуктан sich сыяктуу ат атооч — Dativ: mir, mich эмес.',
        ),
      },
      {
        wrong: 'Hast du dich wehgetan?',
        right: 'Hast du dir wehgetan?',
        note: l(
          'Выражение «sich wehtun» требует Dativ: dir (в Perfekt — dir wehgetan).',
          '«sich wehtun» туюндурмасы Dativди талап кылат: dir (Perfektте — dir wehgetan).',
        ),
      },
      {
        wrong: 'Ich merke mich den Termin.',
        right: 'Ich merke mir den Termin.',
        note: l(
          'Sich etwas merken: «себе» — Dativ (mir), а «den Termin» — Akkusativ.',
          'Sich etwas merken: «өзүнө» — Dativ (mir), ал эми «den Termin» — Akkusativ.',
        ),
      },
      {
        wrong: 'Sie nimmt sich Zeit für Sport und ruht sich dir aus.',
        right: 'Sie nimmt sich Zeit für Sport und ruht sich aus.',
        note: l(
          'У sich ausruhen нет Akkusativ-дополнения — остаётся Akkusativ-местоимение sich; Dativ-формы dir / mir здесь не нужны.',
          'sich ausruhen этишинде Akkusativ толуктоочу жок — Akkusativ ат атооч sich калат; бул жерде dir / mir Dativ формалары керек эмес.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Wasch dir bitte die Hände, bevor wir essen.',
        ru: 'Помой, пожалуйста, руки, прежде чем мы будем есть.',
        ky: 'Тамактанардан мурун, сураныч, колуңду жу.',
        focus: 'dir (Imperativ ↻ A2)',
      },
      {
        de: 'Das überlege ich mir bis morgen.',
        ru: 'Я подумаю об этом до завтра.',
        ky: 'Муну мен эртеңге чейин ойлонуп көрөм.',
        focus: 'mir · sich etwas überlegen',
      },
      {
        de: 'Das kann ich mir gut vorstellen.',
        ru: 'Это я могу хорошо себе представить.',
        ky: 'Муну мен жакшы элестете алам.',
        focus: 'mir · sich etwas vorstellen',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Roth',
        text: 'Was ist passiert, Herr Kaya?',
        ru: 'Что случилось, господин Кайя?',
        ky: 'Эмне болду, Кайя мырза?',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Ich habe mir beim Sport wehgetan, am Knie.',
        ru: 'Я ушибся во время спорта, в колене.',
        ky: 'Спорт учурунда тиземе зыян келтирип алдым.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Nehmen Sie sich bitte ein paar Tage Zeit und ruhen Sie sich aus.',
        ru: 'Пожалуйста, выделите себе несколько дней и отдохните.',
        ky: 'Сураныч, өзүңүзгө бир нече күн убакыт бөлүп, эс алыңыз.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Gut, das merke ich mir. Soll ich mir ein Medikament kaufen?',
        ru: 'Хорошо, я это запомню. Мне купить себе лекарство?',
        ky: 'Жакшы, муну эстеп калам. Өзүмө дары сатып алсамбы?',
      },
      {
        speaker: 'Frau Roth',
        text: 'Fragen Sie bitte in der Apotheke. Wenn es nicht besser wird, kommen Sie wieder.',
        ru: 'Спросите, пожалуйста, в аптеке. Если лучше не станет, приходите снова.',
        ky: 'Сураныч, дарыканадан сураңыз. Жакшырбаса, кайра келиңиз.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что вы делаете каждый день для своего здоровья. Используйте выражения из списка: «Ich putze mir …», «Ich nehme mir Zeit für …», «Ich wasche mir …».',
        'Ден соолугуңуз үчүн күн сайын эмне кыла турганыңызды айтып бериңиз. Тизмедеги туюндурмаларды колдонуңуз: «Ich putze mir …», «Ich nehme mir Zeit für …», «Ich wasche mir …».',
      ),
      sample: 'Ich putze mir jeden Abend die Zähne. Ich nehme mir Zeit für einen Spaziergang. Ich wasche mir oft die Hände.',
      keywords: ['mir', 'zeit', 'zähne'],
    },
    source: UNIT_25_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_25_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'An deiner Stelle würde ich früher ins Bett gehen.',
    ru: 'На твоём месте я бы раньше ложился спать.',
    ky: 'Сенин ордуңда мен эртерээк жатмакмын.',
    word: 'würde',
    conceptId: 'b1-konjunktiv2-ratschlaege',
    reason: l(
      'Würde + инфинитив даёт мягкий совет. Würde стоит на втором месте (после вводной части — перед ich), а инфинитив gehen — в самом конце.',
      'würde + инфинитив жумшак кеңеш берет. würde экинчи орунда турат (киришүү бөлүгүнөн кийин — ich сөзүнүн алдында), ал эми инфинитив gehen — эң аягында.',
    ),
    more: [
      {
        de: 'Ich würde zuerst mit dem Hausarzt sprechen.',
        ru: 'Я бы сначала поговорил с семейным врачом.',
        ky: 'Мен адегенде үй-бүлөлүк дарыгер менен сүйлөшмөкмүн.',
      },
      {
        de: 'Wir würden gern früher anfangen.',
        ru: 'Мы бы с удовольствием начали раньше.',
        ky: 'Биз эртерээк баштагыбыз келмек.',
      },
    ],
  },
  {
    sentence: 'Du solltest mehr Wasser trinken.',
    ru: 'Тебе стоило бы пить больше воды.',
    ky: 'Сен көбүрөөк суу ичишиң керек болмок.',
    word: 'solltest',
    conceptId: 'b1-konjunktiv2-ratschlaege',
    reason: l(
      'Solltest — Konjunktiv II: мягкий совет. «Du sollst …» из A2 звучит как указание. Инфинитив trinken стоит в конце, без zu.',
      'solltest — Konjunktiv II: жумшак кеңеш. A2 деңгээлиндеги «Du sollst …» көрсөтмө сыяктуу угулат. trinken инфинитиви аягында турат, zu жок.',
    ),
    more: [
      {
        de: 'Du solltest nicht so viel arbeiten.',
        ru: 'Тебе не стоило бы так много работать.',
        ky: 'Сен ушунчалык көп иштебешиң керек болмок.',
      },
      {
        de: 'Du könntest abends einen Spaziergang machen.',
        ru: 'Ты мог бы вечером погулять.',
        ky: 'Сен кечинде сейилдеп келишиң мүмкүн.',
      },
    ],
  },
  {
    sentence: 'Ich wasche mir vor dem Essen die Hände.',
    ru: 'Я мою руки перед едой.',
    ky: 'Мен тамактанардан мурун колумду жуучумун.',
    word: 'mir',
    conceptId: 'b1-reflexive-dativ',
    reason: l(
      'В предложении есть Akkusativ-дополнение (die Hände), поэтому «себе» — в Dativ: mir (ich), а не mich.',
      'Сүйлөмдө Akkusativ толуктоочу бар (die Hände), ошондуктан «өзүмө» — Dativде: mir (ich), mich эмес.',
    ),
    more: [
      {
        de: 'Putzt du dir jeden Abend die Zähne?',
        ru: 'Ты чистишь зубы каждый вечер?',
        ky: 'Сен күн сайын кечинде тишиңди тазалайсыңбы?',
      },
      {
        de: 'Das überlege ich mir bis morgen.',
        ru: 'Я подумаю об этом до завтра.',
        ky: 'Муну мен эртеңге чейин ойлонуп көрөм.',
      },
    ],
  },
  {
    sentence: 'Er hat sich beim Sport den Arm gebrochen.',
    ru: 'Он сломал руку во время спорта.',
    ky: 'Ал спорт учурунда колун сындырып алды.',
    word: 'sich',
    conceptId: 'b1-reflexive-dativ',
    reason: l(
      'У er/sie/es форма Dativ и Akkusativ одинаковая — sich. Но здесь это Dativ, потому что Akkusativ-дополнение — «den Arm».',
      'er/sie/es үчүн Dativ жана Akkusativ формалары бирдей — sich. Бирок бул жерде Dativ, анткени Akkusativ толуктоочу — «den Arm».',
    ),
    more: [
      {
        de: 'Wir nehmen uns am Sonntag viel Zeit.',
        ru: 'В воскресенье мы выделим много времени.',
        ky: 'Жекшембиде биз көп убакыт бөлөбүз.',
      },
      {
        de: 'Sie wünscht sich mehr Ruhe.',
        ru: 'Она желает себе больше покоя.',
        ky: 'Ал өзүнө көбүрөөк тынчтык каалайт.',
      },
    ],
  },
]
