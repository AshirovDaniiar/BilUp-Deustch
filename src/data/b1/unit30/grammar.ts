import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_30_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 30 grammar — the three APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-nomen-verb-verbindungen` (M, limited-productive; decision D-8, fallback receptive only): a CLOSED list of 20 noun-verb expressions (eine Entscheidung treffen,
 *     Kontakt aufnehmen, Verantwortung übernehmen, einen Beitrag leisten, zur Verfügung stehen, …). The cap of the curriculum is 20; the list is declared in the metadata.
 *  2. `b1-konsekutiv-final` (M, productive): `sodass` and `so … dass` (result), `damit` (purpose, another subject) versus `um … zu` (purpose, the same subject, Unit 23), and
 *     the difference between `weil` (cause) and `sodass` (result). `sodass` was receptive in Unit 28 and becomes productive here.
 *  3. `b1-textkohaesion` (L, limited-productive): a CLOSED list of text-structuring words: erstens, zweitens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel — they
 *     occupy position 1 of the sentence, the finite verb follows (position 2). NOT taught: other connectors (allerdings, jedoch, somit, folglich, demnach, hingegen), the double
 *     connectors of Unit 22 are only revised.
 * All associations, neighbourhoods, projects and people are fictional; a community question is shown with more than one fair view and no opinion is stated as a fact.
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes the grammar idea
 * and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_30_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-nomen-verb-verbindungen',
    category: 'verbs',
    level: 'B1',
    unit: 30,
    visual: 'none',
    title: l(
      'Nomen-Verb-Verbindungen (eine Entscheidung treffen, Kontakt aufnehmen) — устойчивые пары «существительное + глагол»',
      'Nomen-Verb-Verbindungen (eine Entscheidung treffen, Kontakt aufnehmen) — «зат атооч + этиш» туруктуу жуптары',
    ),
    summary: l(
      'Во многих выражениях немецкий использует пару «существительное + глагол», которую нужно учить целиком: «eine Entscheidung treffen» (принять решение), «Kontakt aufnehmen» (связаться), «Verantwortung übernehmen» (взять ответственность). Смысл несёт существительное, а глагол почти ничего не добавляет, и его нельзя заменить: нельзя сказать «eine Entscheidung machen». Глагол спрягается как обычно, а существительное остаётся рядом с ним. В этом юните вы учите закрытый список из 20 таких пар; другие выражения вам пока нужно только узнавать.',
      'Көптөгөн туюндурмаларда немис тили «зат атооч + этиш» жубун колдонот, аны бүтүндөй үйрөнүү керек: «eine Entscheidung treffen» (чечим кабыл алуу), «Kontakt aufnehmen» (байланышуу), «Verantwortung übernehmen» (жоопкерчиликти алуу). Маанини зат атооч берет, ал эми этиш дээрлик эч нерсе кошпойт жана аны алмаштырууга болбойт: «eine Entscheidung machen» деп айтууга болбойт. Этиш адаттагыдай жакка жараша өзгөрөт, ал эми зат атооч анын жанында калат. Бул бөлүмдө мындай 20 жуптун жабык тизмесин үйрөнөсүз; башка туюндурмаларды азырынча таанууга гана керек.',
    ),
    discover: l(
      'Сравните: «Wir entscheiden das heute» и «Wir treffen heute eine Entscheidung». Что значит одно и то же? Какое слово в паре несёт смысл — существительное или глагол? Что произойдёт, если сказать «eine Entscheidung machen»?',
      '«Wir entscheiden das heute» жана «Wir treffen heute eine Entscheidung» сүйлөмдөрүн салыштырыңыз. Кайсысы бирдей маанини билдирет? Жуптун кайсы сөзү маани берет — зат атоочпу же этишпи? «eine Entscheidung machen» десе эмне болот?',
    ),
    why: l(
      'В собраниях жильцов, в письмах в объединения и в объявлениях такие пары встречаются постоянно: «Wir stellen den Raum zur Verfügung», «Er übernimmt die Verantwortung», «Bitte nehmen Sie Kontakt mit uns auf». Если знать пару целиком, текст звучит естественно и вы понимаете чужую речь. Список ограничен намеренно: 20 пар вы можете использовать уверенно.',
      'Турак жайдын тургундарынын чогулуштарында, бирикмелерге каттарда жана жарыяларда мындай жуптар дайыма кездешет: «Wir stellen den Raum zur Verfügung», «Er übernimmt die Verantwortung», «Bitte nehmen Sie Kontakt mit uns auf». Жупту бүтүндөй билсеңиз, текст табигый угулат жана башкалардын сүйлөгөнүн түшүнөсүз. Тизме атайылап чектелген: 20 жупту ишенимдүү колдоно аласыз.',
    ),
    when: [
      l(
        'Шаг 1 — учите пару целиком: «eine Entscheidung treffen», а не «treffen» и «Entscheidung» отдельно. Первая половина списка: eine Entscheidung treffen (принять решение), Kontakt aufnehmen (связаться), in Kontakt bleiben (оставаться на связи), Verantwortung übernehmen (взять ответственность), einen Beitrag leisten (внести вклад), Hilfe leisten (оказать помощь), Rücksicht nehmen (считаться с другими), zur Verfügung stehen (быть в распоряжении), zur Verfügung stellen (предоставить), in Frage kommen (подходить).',
        '1-кадам — жупту бүтүндөй үйрөнүңүз: «eine Entscheidung treffen», «treffen» жана «Entscheidung» өзүнчө эмес. Тизменин биринчи жарымы: eine Entscheidung treffen (чечим кабыл алуу), Kontakt aufnehmen (байланышуу), in Kontakt bleiben (байланышта калуу), Verantwortung übernehmen (жоопкерчиликти алуу), einen Beitrag leisten (салым кошуу), Hilfe leisten (жардам көрсөтүү), Rücksicht nehmen (башкаларды эске алуу), zur Verfügung stehen (даяр болуу), zur Verfügung stellen (берүү), in Frage kommen (ылайыктуу болуу).',
      ),
      l(
        'Шаг 2 — вторая половина списка: eine Rolle spielen (играть роль), Interesse zeigen (проявлять интерес), Bescheid geben (сообщить), Stellung nehmen (высказать позицию), zur Sprache kommen (быть затронутым в разговоре), Unterstützung finden (найти поддержку), einen Vorschlag machen (внести предложение), in Anspruch nehmen (воспользоваться), Erfahrungen sammeln (набираться опыта), eine Frage stellen (задать вопрос).',
        '2-кадам — тизменин экинчи жарымы: eine Rolle spielen (роль ойноо), Interesse zeigen (кызыгуу көрсөтүү), Bescheid geben (билдирүү), Stellung nehmen (позиция билдирүү), zur Sprache kommen (сөз болуу), Unterstützung finden (колдоо табуу), einen Vorschlag machen (сунуш киргизүү), in Anspruch nehmen (пайдалануу), Erfahrungen sammeln (тажрыйба топтоо), eine Frage stellen (суроо берүү).',
      ),
      l(
        'Шаг 3 — глагол спрягается, существительное остаётся: «Ich treffe eine Entscheidung», «Wir leisten einen Beitrag». У разделяемых глаголов приставка уходит в конец: «Ich nehme Kontakt auf», «Bitte nehmen Sie Kontakt auf». Артикль и падеж запоминайте вместе с парой: einen Beitrag (Akkusativ), zur Verfügung (Dativ).',
        '3-кадам — этиш жакка жараша өзгөрөт, зат атооч калат: «Ich treffe eine Entscheidung», «Wir leisten einen Beitrag». Бөлүнүүчү этиштерде приставка аягына өтөт: «Ich nehme Kontakt auf», «Bitte nehmen Sie Kontakt auf». Артикль менен жалгоону жуп менен кошо эстеп калыңыз: einen Beitrag (Akkusativ), zur Verfügung (Dativ).',
      ),
      l(
        'Шаг 4 — не заменяйте глагол «по смыслу»: «eine Entscheidung machen» и «Verantwortung nehmen» неверны. Если вы не уверены, скажите проще: «Wir entscheiden», «Ich helfe». Пары, которых нет в списке юнита, вы пока только узнаёте в текстах.',
        '4-кадам — этишти «маанисине жараша» алмаштырбаңыз: «eine Entscheidung machen» жана «Verantwortung nehmen» туура эмес. Ишенбесеңиз, жөнөкөйүрөөк айтыңыз: «Wir entscheiden», «Ich helfe». Бөлүмдүн тизмесинде жок жуптарды тексттерден гана таанып жүрөсүз.',
      ),
    ],
    examples: [
      {
        de: 'Wir müssen heute eine Entscheidung treffen.',
        ru: 'Нам нужно принять решение сегодня.',
        ky: 'Биз бүгүн чечим кабыл алышыбыз керек.',
        focus: 'eine Entscheidung treffen',
      },
      {
        de: 'Ich nehme morgen mit dem Verein Kontakt auf.',
        ru: 'Завтра я свяжусь с объединением.',
        ky: 'Эртең мен бирикме менен байланышам.',
        focus: 'Kontakt aufnehmen (trennbar)',
      },
      {
        de: 'Die Nachbarin übernimmt die Verantwortung für den Garten.',
        ru: 'Соседка берёт на себя ответственность за сад.',
        ky: 'Кошуна бакка жоопкерчиликти өзүнө алат.',
        focus: 'Verantwortung übernehmen',
      },
      {
        de: 'Der Raum steht allen Gruppen zur Verfügung.',
        ru: 'Помещение в распоряжении всех групп.',
        ky: 'Бөлмө бардык топтордун карамагында.',
        focus: 'zur Verfügung stehen',
      },
      {
        de: 'Jeder kann einen kleinen Beitrag leisten.',
        ru: 'Каждый может внести небольшой вклад.',
        ky: 'Ар ким кичинекей салым кошо алат.',
        focus: 'einen Beitrag leisten',
      },
    ],
    mistakes: [
      {
        wrong: 'Wir machen heute eine Entscheidung.',
        right: 'Wir treffen heute eine Entscheidung.',
        note: l(
          'Пара устойчива: «eine Entscheidung treffen». Глагол machen здесь не подходит.',
          'Жуп туруктуу: «eine Entscheidung treffen». machen этиши бул жерге туура келбейт.',
        ),
      },
      {
        wrong: 'Ich aufnehme morgen Kontakt.',
        right: 'Ich nehme morgen Kontakt auf.',
        note: l(
          'Aufnehmen — разделяемый глагол: nehme на втором месте, приставка auf в самом конце.',
          'aufnehmen — бөлүнүүчү этиш: nehme экинчи орунда, auf приставкасы эң аягында.',
        ),
      },
      {
        wrong: 'Er leistet ein Beitrag für den Verein.',
        right: 'Er leistet einen Beitrag für den Verein.',
        note: l(
          'Beitrag — мужской род и Akkusativ: einen Beitrag.',
          'Beitrag — эркек род жана Akkusativ: einen Beitrag.',
        ),
      },
      {
        wrong: 'Wir stellen den Raum zu Verfügung.',
        right: 'Wir stellen den Raum zur Verfügung.',
        note: l(
          'Выражение — «zur Verfügung» (zu + der): запоминайте его вместе с глаголом stellen / stehen.',
          'Туюндурма — «zur Verfügung» (zu + der): аны stellen / stehen этиши менен кошо эстеп калыңыз.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Bitte geben Sie uns bis Freitag Bescheid.',
        ru: 'Пожалуйста, сообщите нам до пятницы.',
        ky: 'Жума күнүнө чейин бизге билдирип коюңуз.',
        focus: 'Bescheid geben',
      },
      {
        de: 'Viele Jugendliche zeigen Interesse an dem Projekt.',
        ru: 'Многие подростки проявляют интерес к проекту.',
        ky: 'Көптөгөн өспүрүмдөр долбоорго кызыгуу көрсөтүшөт.',
        focus: 'Interesse zeigen',
      },
      {
        de: 'Im Verein kann man viele Erfahrungen sammeln.',
        ru: 'В объединении можно набраться много опыта.',
        ky: 'Бирикмеде көп тажрыйба топтоого болот.',
        focus: 'Erfahrungen sammeln',
      },
    ],
    dialogue: [
      {
        speaker: 'Vorsitzende',
        text: 'Wir müssen jetzt eine Entscheidung treffen. Wer übernimmt die Verantwortung für das Fest?',
        ru: 'Теперь нам нужно принять решение. Кто берёт ответственность за праздник?',
        ky: 'Эми бизге чечим кабыл алуу керек. Майрамга ким жоопкерчиликти алат?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Ich kann einen Beitrag leisten. Ich stelle meinen Garten zur Verfügung.',
        ru: 'Я могу внести вклад. Я предоставляю свой сад.',
        ky: 'Мен салым кошо алам. Мен өз бакчамды берем.',
      },
      {
        speaker: 'Frau Lindner',
        text: 'Gut. Ich nehme mit der Stadt Kontakt auf und frage nach der Erlaubnis.',
        ru: 'Хорошо. Я свяжусь с городом и спрошу о разрешении.',
        ky: 'Жакшы. Мен шаар менен байланышып, уруксат жөнүндө сурайм.',
      },
      {
        speaker: 'Vorsitzende',
        text: 'Danke. Bitte geben Sie mir bis Montag Bescheid.',
        ru: 'Спасибо. Пожалуйста, сообщите мне до понедельника.',
        ky: 'Рахмат. Дүйшөмбүгө чейин мага билдирип коюңуз.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, что вы готовы сделать для проекта в вашем районе. Используйте по крайней мере две пары: например «Verantwortung übernehmen», «zur Verfügung stellen», «einen Beitrag leisten».',
        'Райондогу долбоор үчүн эмне кылууга даяр экениңизди айтыңыз. Жок дегенде эки жупту колдонуңуз: мисалы «Verantwortung übernehmen», «zur Verfügung stellen», «einen Beitrag leisten».',
      ),
      sample: 'Ich übernehme die Verantwortung für den Garten. Ich stelle am Samstag meine Zeit zur Verfügung. So leiste ich einen kleinen Beitrag.',
      keywords: ['verantwortung', 'zur verfügung', 'beitrag', 'übernehme'],
    },
    source: UNIT_30_SOURCE,
  },
  {
    id: 'b1-konsekutiv-final',
    category: 'conjunctions',
    level: 'B1',
    unit: 30,
    visual: 'verbpos',
    title: l(
      'sodass, so … dass, damit und um … zu — следствие и цель',
      'sodass, so … dass, damit жана um … zu — натыйжа жана максат',
    ),
    summary: l(
      'Следствие: «sodass» («так что») присоединяет результат: «Viele Nachbarn helfen, sodass das Fest ein Erfolg wird». «So … dass» показывает степень: «Es war so laut, dass wir nichts verstanden haben». Цель: «damit» вводит цель с другим подлежащим («Wir sammeln Spenden, damit die Kinder einen Spielplatz haben»), а «um … zu» — с тем же подлежащим («Ich helfe im Verein, um neue Leute kennenzulernen»). В придаточных предложениях глагол стоит в самом конце. Weil отвечает на вопрос «почему?» (причина), sodass — на вопрос «и что из этого?» (следствие).',
      'Натыйжа: «sodass» («ошондуктан») натыйжаны улайт: «Viele Nachbarn helfen, sodass das Fest ein Erfolg wird». «So … dass» даражаны көрсөтөт: «Es war so laut, dass wir nichts verstanden haben». Максат: «damit» максатты башка ээ менен киргизет («Wir sammeln Spenden, damit die Kinder einen Spielplatz haben»), ал эми «um … zu» — ошол эле ээ менен («Ich helfe im Verein, um neue Leute kennenzulernen»). Кошумча бөлүктөрдө этиш эң аягында турат. Weil «эмне үчүн?» (себеп) деген суроого жооп берет, sodass — «анда эмне болду?» (натыйжа) деген суроого.',
    ),
    discover: l(
      'Сравните: «Wir sammeln Spenden, damit die Kinder einen Spielplatz haben» и «Ich helfe, um neue Leute kennenzulernen». Одинаковое ли подлежащее в обеих частях? Что стоит перед инфинитивом? А теперь: «Es regnet, weil …» и «Es regnet, sodass …» — какая часть причина, какая следствие?',
      '«Wir sammeln Spenden, damit die Kinder einen Spielplatz haben» жана «Ich helfe, um neue Leute kennenzulernen» сүйлөмдөрүн салыштырыңыз. Эки бөлүктө ээ бирдейби? Инфинитивдин алдында эмне турат? Эми: «Es regnet, weil …» жана «Es regnet, sodass …» — кайсы бөлүк себеп, кайсысы натыйжа?',
    ),
    why: l(
      'Когда вы объясняете цель проекта или его результат, вам нужны оба средства: «Wir gründen den Verein, um zu helfen» и «Wir gründen ihn, damit alle mitmachen können». Так звучат предложения, письма в газету и короткие выступления. Правило «одинаковое подлежащее — um … zu, другое — damit» помогает не ошибаться.',
      'Долбоордун максатын же натыйжасын түшүндүргөндө эки каражат тең керек: «Wir gründen den Verein, um zu helfen» жана «Wir gründen ihn, damit alle mitmachen können». Сунуштар, гезитке каттар жана кыска чыгуулар ушундай угулат. «Ээ бирдей — um … zu, башка — damit» эрежеси ката кетирбөөгө жардам берет.',
    ),
    when: [
      l(
        'Шаг 1 — sodass (следствие): главная часть, запятая, sodass + придаточная часть с глаголом в конце. «Der Verein hilft, sodass viele Familien schneller eine Wohnung finden». Пишется слитно.',
        '1-кадам — sodass (натыйжа): башкы бөлүк, үтүр, sodass + этиши аягындагы кошумча бөлүк. «Der Verein hilft, sodass viele Familien schneller eine Wohnung finden». Чогуу жазылат.',
      ),
      l(
        'Шаг 2 — so … dass (степень): «so» стоит перед прилагательным или наречием, «dass» вводит придаточную часть: «so laut, dass …», «so viele Leute, dass …». Это не то же самое, что sodass: после «so» слово «dass» отдельно.',
        '2-кадам — so … dass (даража): «so» сын атоочтун же сөз айкашынын алдында турат, «dass» кошумча бөлүктү киргизет: «so laut, dass …», «so viele Leute, dass …». Бул sodass менен бирдей эмес: «so» дан кийин «dass» өзүнчө жазылат.',
      ),
      l(
        'Шаг 3 — цель: тот же человек действует в обеих частях → «um … zu» + инфинитив («Ich helfe, um Leute kennenzulernen»). Другое подлежащее → «damit» + придаточная часть с глаголом в конце («Wir sammeln Spenden, damit die Kinder … haben»). Нельзя: «um die Kinder … zu haben».',
        '3-кадам — максат: эки бөлүктө тең бир эле адам аракет кылса → «um … zu» + инфинитив («Ich helfe, um Leute kennenzulernen»). Башка ээ болсо → «damit» + этиши аягындагы кошумча бөлүк («Wir sammeln Spenden, damit die Kinder … haben»). Мындай болбойт: «um die Kinder … zu haben».',
      ),
      l(
        'Шаг 4 — weil или sodass? «Weil» называет причину и может стоять и после, и перед главной частью: «Ich helfe, weil mir das wichtig ist». «Sodass» называет только следствие и стоит после главной части: «Ich helfe, sodass es schneller geht». Порядок слов в придаточной части одинаковый: глагол в конце.',
        '4-кадам — weil же sodass? «Weil» себепти атайт жана башкы бөлүктөн кийин да, мурун да турушу мүмкүн: «Ich helfe, weil mir das wichtig ist». «Sodass» натыйжаны гана атайт жана башкы бөлүктөн кийин турат: «Ich helfe, sodass es schneller geht». Кошумча бөлүктөгү сөздөрдүн ирети бирдей: этиш аягында.',
      ),
    ],
    examples: [
      {
        de: 'Der Verein hilft Familien, sodass sie schneller eine Wohnung finden.',
        ru: 'Объединение помогает семьям, так что они быстрее находят жильё.',
        ky: 'Бирикме үй-бүлөлөргө жардам берет, ошондуктан алар турак жайды тезирээк табышат.',
        focus: 'sodass: Folge, Verb am Ende',
      },
      {
        de: 'Es war so laut, dass wir nichts verstanden haben.',
        ru: 'Было так шумно, что мы ничего не поняли.',
        ky: 'Ушунчалык ызы-чуу болгондуктан, биз эч нерсе түшүнгөн жокпуз.',
        focus: 'so … dass: Grad und Folge',
      },
      {
        de: 'Wir sammeln Spenden, damit die Kinder einen sicheren Spielplatz haben.',
        ru: 'Мы собираем пожертвования, чтобы у детей была безопасная площадка.',
        ky: 'Биз балдардын коопсуз оюн аянтчасы болушу үчүн кайрымдуулук акча чогултуп жатабыз.',
        focus: 'damit: anderes Subjekt',
      },
      {
        de: 'Ich helfe im Verein, um neue Leute kennenzulernen.',
        ru: 'Я помогаю в объединении, чтобы знакомиться с новыми людьми.',
        ky: 'Мен жаңы адамдар менен таанышуу үчүн бирикмеде жардам берем.',
        focus: 'um … zu: dasselbe Subjekt',
      },
      {
        de: 'Viele Nachbarn helfen mit, sodass das Fest ein großer Erfolg wird.',
        ru: 'Многие соседи помогают, так что праздник становится большим успехом.',
        ky: 'Көптөгөн кошуналар жардам берет, ошондуктан майрам чоң ийгилик болот.',
        focus: 'sodass: Ergebnis',
      },
    ],
    mistakes: [
      {
        wrong: 'Wir sammeln Spenden, um die Kinder einen Spielplatz haben.',
        right: 'Wir sammeln Spenden, damit die Kinder einen Spielplatz haben.',
        note: l(
          'Подлежащее другое (die Kinder), поэтому нужен damit с глаголом в конце, а не um … zu.',
          'Ээ башка (die Kinder), ошондуктан um … zu эмес, этиши аягында damit керек.',
        ),
      },
      {
        wrong: 'Es war so laut, sodass wir nichts verstanden haben.',
        right: 'Es war so laut, dass wir nichts verstanden haben.',
        note: l(
          'После «so» + прилагательное нужно «dass» отдельно. Sodass слитно не сочетается с «so».',
          '«so» + сын атоочтон кийин «dass» өзүнчө керек. Sodass «so» менен айкашпайт.',
        ),
      },
      {
        wrong: 'Wir sammeln Spenden, damit die Kinder haben einen Spielplatz.',
        right: 'Wir sammeln Spenden, damit die Kinder einen Spielplatz haben.',
        note: l(
          'В придаточной части с damit спрягаемый глагол (haben) стоит в самом конце.',
          'damit менен кошумча бөлүктө жакка жараша өзгөргөн этиш (haben) эң аягында турат.',
        ),
      },
      {
        wrong: 'Ich lerne Deutsch, um ich besser zu verstehen.',
        right: 'Ich lerne Deutsch, um besser zu verstehen.',
        note: l(
          'После um … zu подлежащее не повторяется: um + инфинитив с zu.',
          'um … zu дан кийин ээ кайталанбайт: um + zu менен инфинитив.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich schreibe diesen Brief, damit alle Nachbarn Bescheid wissen.',
        ru: 'Я пишу это письмо, чтобы все соседи были в курсе.',
        ky: 'Мен бул катты бардык кошуналар кабардар болушу үчүн жазып жатам.',
        focus: 'damit',
      },
      {
        de: 'Wir treffen uns am Samstag, um den Garten sauber zu machen.',
        ru: 'Мы встречаемся в субботу, чтобы убрать сад.',
        ky: 'Биз бакты тазалоо үчүн ишембиде жолугабыз.',
        focus: 'um … zu',
      },
      {
        de: 'Es kamen so viele Leute, dass wir mehr Stühle brauchten.',
        ru: 'Пришло так много людей, что нам понадобилось больше стульев.',
        ky: 'Ушунчалык көп адам келди, ошондуктан бизге көбүрөөк отургуч керек болду.',
        focus: 'so … dass',
      },
    ],
    dialogue: [
      {
        speaker: 'Mira',
        text: 'Warum machst du bei der Nachbarschaftshilfe mit?',
        ru: 'Почему ты участвуешь в помощи соседей?',
        ky: 'Сен эмне үчүн кошуналардын жардамына катышасың?',
      },
      {
        speaker: 'Ben',
        text: 'Ich möchte etwas Sinnvolles tun, um ein bisschen zurückzugeben.',
        ru: 'Я хочу сделать что-то полезное, чтобы немного отдать назад.',
        ky: 'Мен бир аз кайтарып берүү үчүн пайдалуу иш кылгым келет.',
      },
      {
        speaker: 'Mira',
        text: 'Und die anderen? Machen alle freiwillig mit?',
        ru: 'А другие? Все участвуют добровольно?',
        ky: 'Ал эми башкалар? Баары ыктыярдуу катышабы?',
      },
      {
        speaker: 'Ben',
        text: 'Ja. Der Verein ist so beliebt, dass wir schon vierzig Mitglieder haben. Wir sammeln auch Spenden, damit wir Material kaufen können.',
        ru: 'Да. Объединение настолько популярно, что у нас уже сорок членов. Мы ещё собираем пожертвования, чтобы мы могли купить материалы.',
        ky: 'Ооба. Бирикме ушунчалык популярдуу болгондуктан, бизде мүчө саны кырк болуп калды. Биз материал сатып алышыбыз үчүн кайрымдуулук акча да чогултабыз.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Объясните, зачем вы помогаете в проекте. Скажите одну цель с «um … zu» (вы сами), одну цель с «damit» (другие люди) и одно следствие с «sodass».',
        'Долбоордо эмне үчүн жардам берип жатканыңызды түшүндүрүңүз. «um … zu» менен бир максатты (өзүңүз), «damit» менен бир максатты (башка адамдар) жана «sodass» менен бир натыйжаны айтыңыз.',
      ),
      sample: 'Ich helfe im Verein, um neue Leute kennenzulernen. Wir sammeln Spenden, damit die Kinder einen Spielplatz haben. Viele machen mit, sodass das Fest ein Erfolg wird.',
      keywords: ['um', 'damit', 'sodass', 'zu'],
    },
    source: UNIT_30_SOURCE,
  },
  {
    id: 'b1-textkohaesion',
    category: 'conjunctions',
    level: 'B1',
    unit: 30,
    visual: 'verbpos',
    title: l(
      'erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel — как связать текст',
      'erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel — текстти кантип байланыштыруу',
    ),
    summary: l(
      'Короткое выступление или письмо становится понятным, когда его части связаны словами-опорами. В этом юните вы учите закрытый список: «erstens, zweitens» (перечисление), «außerdem» и «darüber hinaus» (добавление), «dennoch» (уступка: «всё же»), «daher» (следствие: «поэтому») и «zum Beispiel» (пример). Они стоят на первом месте в предложении, а спрягаемый глагол — сразу после них: «Außerdem hilft der Verein», «Daher gründen wir eine Gruppe». Структура короткого текста: вступление — два пункта — заключение.',
      'Кыска чыгуу же кат бөлүктөрү таяныч сөздөр менен байланышса түшүнүктүү болот. Бул бөлүмдө жабык тизмени үйрөнөсүз: «erstens, zweitens» (санамалоо), «außerdem» жана «darüber hinaus» (кошумча), «dennoch» (баары бир: «ошентсе да»), «daher» (натыйжа: «ошондуктан») жана «zum Beispiel» (мисал). Алар сүйлөмдө биринчи орунда турат, ал эми жакка жараша өзгөргөн этиш алардан дароо кийин келет: «Außerdem hilft der Verein», «Daher gründen wir eine Gruppe». Кыска тексттин түзүлүшү: киришүү — эки пункт — жыйынтык.',
    ),
    discover: l(
      'Сравните два текста: «Der Garten ist schön. Er ist groß. Er ist ruhig» и «Erstens ist der Garten schön. Außerdem ist er groß. Daher kommen viele Nachbarn». Какой понятнее? Где стоит глагол после слова-опоры?',
      'Эки текстти салыштырыңыз: «Der Garten ist schön. Er ist groß. Er ist ruhig» жана «Erstens ist der Garten schön. Außerdem ist er groß. Daher kommen viele Nachbarn». Кайсынысы түшүнүктүүрөөк? Таяныч сөздөн кийин этиш кайда турат?',
    ),
    why: l(
      'В письме в газету, на собрании или в коротком докладе слушатель должен быстро видеть, как построена мысль: сначала первый довод, потом ещё один, потом вывод. Слова «erstens», «außerdem», «daher» делают это за вас. Для B1 достаточно небольшого набора, который вы используете уверенно.',
      'Гезитке катта, чогулушта же кыска докладда угуучу ойдун кантип курулганын тез көрүшү керек: адегенде биринчи далил, андан кийин дагы бири, анан жыйынтык. «erstens», «außerdem», «daher» сөздөрү муну сиздин ордуңузга кылат. B1 үчүн ишенимдүү колдоно турган кичинекей топтом жетиштүү.',
    ),
    when: [
      l(
        'Шаг 1 — перечисление: «Erstens …, zweitens …». «Erstens ist der Platz zentral. Zweitens ist er für alle Generationen offen.» После слова-опоры сразу глагол (ist).',
        '1-кадам — санамалоо: «Erstens …, zweitens …». «Erstens ist der Platz zentral. Zweitens ist er für alle Generationen offen.» Таяныч сөздөн кийин дароо этиш (ist).',
      ),
      l(
        'Шаг 2 — добавить довод: «außerdem» или «darüber hinaus» («кроме того»). «Außerdem kostet das Projekt wenig. Darüber hinaus gibt es viele Freiwillige.» Порядок слов: слово-опора, глагол, подлежащее.',
        '2-кадам — далил кошуу: «außerdem» же «darüber hinaus» («мындан тышкары»). «Außerdem kostet das Projekt wenig. Darüber hinaus gibt es viele Freiwillige.» Сөздөрдүн ирети: таяныч сөз, этиш, ээ.',
      ),
      l(
        'Шаг 3 — вывод и уступка: «daher» («поэтому») ведёт к выводу, «dennoch» («всё же») показывает, что довод есть, но результат другой: «Es gibt Kritik. Dennoch machen viele mit.» Сравните с юнитом 22: daher = deshalb, dennoch = trotzdem.',
        '3-кадам — жыйынтык жана баары бир: «daher» («ошондуктан») жыйынтыкка алып барат, «dennoch» («ошентсе да») далил бар экенин, бирок натыйжа башка экенин көрсөтөт: «Es gibt Kritik. Dennoch machen viele mit.» 22-бөлүм менен салыштырыңыз: daher = deshalb, dennoch = trotzdem.',
      ),
      l(
        'Шаг 4 — пример и структура: «zum Beispiel» вводит пример: «Zum Beispiel können Nachbarn zusammen kochen.» Короткий текст: вступление («Ich möchte über … sprechen»), два пункта (erstens, außerdem), заключение («Daher bitte ich Sie mitzumachen»).',
        '4-кадам — мисал жана түзүлүш: «zum Beispiel» мисал киргизет: «Zum Beispiel können Nachbarn zusammen kochen.» Кыска текст: киришүү («Ich möchte über … sprechen»), эки пункт (erstens, außerdem), жыйынтык («Daher bitte ich Sie mitzumachen»).',
      ),
    ],
    examples: [
      {
        de: 'Erstens liegt der Platz mitten im Stadtteil.',
        ru: 'Во-первых, площадь находится в центре района.',
        ky: 'Биринчиден, аянт райондун дал ортосунда жайгашкан.',
        focus: 'erstens: Position 1, dann das Verb',
      },
      {
        de: 'Außerdem kostet das Projekt nicht viel.',
        ru: 'Кроме того, проект стоит недорого.',
        ky: 'Мындан тышкары, долбоор көп турбайт.',
        focus: 'außerdem: Verb vor dem Subjekt',
      },
      {
        de: 'Darüber hinaus gibt es viele Freiwillige.',
        ru: 'Помимо этого, есть много добровольцев.',
        ky: 'Мындан сырткары, ыктыярчылар көп.',
        focus: 'darüber hinaus',
      },
      {
        de: 'Es gibt auch Kritik. Dennoch machen viele Nachbarn mit.',
        ru: 'Есть и критика. Всё же многие соседи участвуют.',
        ky: 'Сын да бар. Ошентсе да көптөгөн кошуналар катышат.',
        focus: 'dennoch: Gegensatz',
      },
      {
        de: 'Zum Beispiel können alle zusammen kochen.',
        ru: 'Например, все могут вместе готовить.',
        ky: 'Мисалы, баары чогуу тамак жасай алат.',
        focus: 'zum Beispiel',
      },
    ],
    mistakes: [
      {
        wrong: 'Außerdem der Verein hilft vielen Familien.',
        right: 'Außerdem hilft der Verein vielen Familien.',
        note: l(
          'После слова-опоры на первом месте сразу идёт глагол (hilft), потом подлежащее.',
          'Таяныч сөз биринчи орунда болгондо, этиш дароо келет (hilft), андан кийин ээ.',
        ),
      },
      {
        wrong: 'Daher wir gründen eine Gruppe.',
        right: 'Daher gründen wir eine Gruppe.',
        note: l(
          'Daher стоит на первом месте, глагол — на втором: «Daher gründen wir».',
          'Daher биринчи орунда, этиш экинчи орунда: «Daher gründen wir».',
        ),
      },
      {
        wrong: 'Dennoch, machen viele mit weil.',
        right: 'Dennoch machen viele mit.',
        note: l(
          'Dennoch — слово-опора: без запятой, глагол сразу после него; weil здесь не нужен.',
          'Dennoch — таяныч сөз: үтүрсүз, этиш андан дароо кийин; weil бул жерде керек эмес.',
        ),
      },
      {
        wrong: 'Zum Beispiel wir können zusammen kochen.',
        right: 'Zum Beispiel können wir zusammen kochen.',
        note: l(
          'После «zum Beispiel» на первом месте глагол (können), потом подлежащее (wir).',
          '«zum Beispiel» дан кийин этиш (können) биринчи орунда, андан кийин ээ (wir).',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich möchte kurz über unser Projekt sprechen. Erstens geht es um den Garten.',
        ru: 'Я хочу коротко рассказать о нашем проекте. Во-первых, речь идёт о саде.',
        ky: 'Мен биздин долбоор жөнүндө кыскача айткым келет. Биринчиден, сөз бак жөнүндө.',
        focus: 'Einleitung + erstens',
      },
      {
        de: 'Der Garten ist nicht teuer. Daher können viele mitmachen.',
        ru: 'Сад недорогой. Поэтому многие могут участвовать.',
        ky: 'Бак кымбат эмес. Ошондуктан көптөгөн адамдар катыша алат.',
        focus: 'daher',
      },
      {
        de: 'Zum Schluss möchte ich sagen: Jeder ist willkommen.',
        ru: 'В заключение я хочу сказать: каждый желанный гость.',
        ky: 'Жыйынтыктап айтарым: ар бири кош келиңиз.',
        focus: 'Schluss',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Lindner',
        text: 'Warum sollen wir den Hof zum Treffpunkt machen?',
        ru: 'Почему мы должны сделать двор местом встреч?',
        ky: 'Эмне үчүн биз короону жолугушуу жайы кылышыбыз керек?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Erstens ist er zentral. Außerdem ist er ruhig. Zum Beispiel können dort Familien grillen.',
        ru: 'Во-первых, он расположен в центре. Кроме того, там тихо. Например, там семьи могут жарить мясо.',
        ky: 'Биринчиден, ал борбордо жайгашкан. Мындан тышкары, ал жерде тынч. Мисалы, ал жерде үй-бүлөлөр шашлык жасай алат.',
      },
      {
        speaker: 'Frau Lindner',
        text: 'Aber der Lärm kann ein Problem sein.',
        ru: 'Но шум может быть проблемой.',
        ky: 'Бирок ызы-чуу көйгөй болушу мүмкүн.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Das stimmt. Dennoch finde ich die Idee gut. Daher schlage ich feste Zeiten vor.',
        ru: 'Это верно. Всё же я считаю идею хорошей. Поэтому я предлагаю установить время.',
        ky: 'Бул чын. Ошентсе да мен идеяны жакшы деп эсептейм. Ошондуктан белгилүү убакыт сунуштайм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите в 4–5 предложениях, почему стоит поддержать проект: вступление, «erstens», «außerdem» и заключение с «daher».',
        '4–5 сүйлөм менен долбоорду эмне үчүн колдоо керектигин айтыңыз: киришүү, «erstens», «außerdem» жана «daher» менен жыйынтык.',
      ),
      sample: 'Ich möchte kurz über den Garten sprechen. Erstens ist er für alle offen. Außerdem kostet er wenig. Daher bitte ich Sie mitzumachen.',
      keywords: ['erstens', 'außerdem', 'daher', 'garten'],
    },
    source: UNIT_30_SOURCE,
  },
]

export const UNIT_30_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Wir müssen heute eine Entscheidung treffen.',
    ru: 'Нам нужно принять решение сегодня.',
    ky: 'Биз бүгүн чечим кабыл алышыбыз керек.',
    word: 'treffen',
    conceptId: 'b1-nomen-verb-verbindungen',
    reason: l(
      '«Eine Entscheidung treffen» — устойчивая пара: смысл несёт существительное, а глагол treffen нельзя заменить на machen. Учите пару целиком, с артиклем.',
      '«Eine Entscheidung treffen» — туруктуу жуп: маанини зат атооч берет, ал эми treffen этишин machen менен алмаштырууга болбойт. Жупту бүтүндөй, артикль менен үйрөнүңүз.',
    ),
    more: [
      {
        de: 'Ich nehme morgen Kontakt auf.',
        ru: 'Завтра я свяжусь.',
        ky: 'Эртең мен байланышам.',
      },
      {
        de: 'Der Raum steht allen zur Verfügung.',
        ru: 'Помещение в распоряжении всех.',
        ky: 'Бөлмө баарынын карамагында.',
      },
    ],
  },
  {
    sentence: 'Wir sammeln Spenden, damit die Kinder einen Spielplatz haben.',
    ru: 'Мы собираем пожертвования, чтобы у детей была площадка.',
    ky: 'Биз балдардын оюн аянтчасы болушу үчүн кайрымдуулук акча чогултуп жатабыз.',
    word: 'damit',
    conceptId: 'b1-konsekutiv-final',
    reason: l(
      'Damit вводит цель, когда подлежащее другое (wir — die Kinder). Если бы действовал один и тот же человек, было бы «um … zu». Глагол haben — в самом конце.',
      'Damit максатты башка ээ болгондо киргизет (wir — die Kinder). Бир эле адам аракет кылса, «um … zu» болмок. haben этиши эң аягында.',
    ),
    more: [
      {
        de: 'Ich helfe im Verein, um neue Leute kennenzulernen.',
        ru: 'Я помогаю в объединении, чтобы знакомиться с новыми людьми.',
        ky: 'Мен жаңы адамдар менен таанышуу үчүн бирикмеде жардам берем.',
      },
      {
        de: 'Es war so laut, dass wir nichts verstanden haben.',
        ru: 'Было так шумно, что мы ничего не поняли.',
        ky: 'Ушунчалык ызы-чуу болгондуктан, биз эч нерсе түшүнгөн жокпуз.',
      },
    ],
  },
  {
    sentence: 'Viele Nachbarn helfen mit, sodass das Fest ein großer Erfolg wird.',
    ru: 'Многие соседи помогают, так что праздник становится большим успехом.',
    ky: 'Көптөгөн кошуналар жардам берет, ошондуктан майрам чоң ийгилик болот.',
    word: 'sodass',
    conceptId: 'b1-konsekutiv-final',
    reason: l(
      'Sodass называет следствие: сначала действие (помощь соседей), потом результат (успех праздника). Глагол wird — в самом конце. Weil называл бы причину, а не результат.',
      'Sodass натыйжаны атайт: адегенде аракет (кошуналардын жардамы), андан кийин жыйынтык (майрамдын ийгилиги). wird этиши эң аягында. Weil себепти атайт болчу, жыйынтыкты эмес.',
    ),
    more: [
      {
        de: 'Der Verein hilft Familien, sodass sie schneller eine Wohnung finden.',
        ru: 'Объединение помогает семьям, так что они быстрее находят жильё.',
        ky: 'Бирикме үй-бүлөлөргө жардам берет, ошондуктан алар турак жайды тезирээк табышат.',
      },
      {
        de: 'Ich helfe, weil mir die Gemeinschaft wichtig ist.',
        ru: 'Я помогаю, потому что мне важно сообщество.',
        ky: 'Мен жамаат мен үчүн маанилүү болгондуктан жардам берем.',
      },
    ],
  },
  {
    sentence: 'Es gibt auch Kritik. Dennoch machen viele Nachbarn mit.',
    ru: 'Есть и критика. Всё же многие соседи участвуют.',
    ky: 'Сын да бар. Ошентсе да көптөгөн кошуналар катышат.',
    word: 'Dennoch',
    conceptId: 'b1-textkohaesion',
    reason: l(
      'Dennoch показывает контраст: критика есть, но многие всё равно участвуют. Оно стоит на первом месте, глагол (machen) сразу после него, потом подлежащее. Похоже на trotzdem из юнита 22.',
      'Dennoch карама-каршылыкты көрсөтөт: сын бар, бирок көпчүлүк баары бир катышат. Ал биринчи орунда турат, этиш (machen) андан дароо кийин, андан кийин ээ. 22-бөлүмдөгү trotzdem сыяктуу.',
    ),
    more: [
      {
        de: 'Erstens ist der Platz zentral. Außerdem ist er ruhig.',
        ru: 'Во-первых, площадь в центре. Кроме того, там тихо.',
        ky: 'Биринчиден, аянт борбордо. Мындан тышкары, ал жерде тынч.',
      },
      {
        de: 'Daher gründen wir eine Gruppe.',
        ru: 'Поэтому мы основываем группу.',
        ky: 'Ошондуктан биз топ түзөбүз.',
      },
    ],
  },
]
