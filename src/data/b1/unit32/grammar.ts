import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_32_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 32 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md). Unit 32 is a CONSOLIDATION unit: both concepts have the role `revision`, neither is a new
 * grammar system, and nothing in them is taught for the first time except the explicit rule table of the Mittelfeld (decision D-9: partly new to the learner as a SYSTEM; fallback: a
 * plain revision list without a concept):
 *  1. `b1-nebensaetze-integration` (L, productive revision): the overview of the subordinate clauses of B1 — weil, dass, wenn / als, ob, obwohl, damit, sodass, nachdem, falls, the relative
 *     clause and the infinitive clause with zu / um … zu — by function (Grund, Folge, Ziel, Bedingung, Zeit, Gegensatz, Inhalt, nähere Bestimmung), with the verb at the end, the comma, the
 *     position of the clause and the typical confusions (als / wenn, weil / denn, dass / damit, obwohl / trotzdem, ob / dass, the relative pronoun).
 *  2. `b1-satzbau-mittelfeld` (M, productive revision, decision D-9): the order rules the learner has used since Unit 21 as a SYSTEM — the Satzklammer (finite verb in position 2, the rest of
 *     the verb group at the end), pronoun before noun and Akkusativ pronoun before Dativ pronoun, Dativ noun before Akkusativ noun, and TeKaMoLo (Temporal – Kausal – Modal – Lokal).
 * Each concept cites the unit in which the learner met the material. NOT taught: any new connector, any new tense or voice, the receptive constructions of the course (Passiv Perfekt, Konjunktiv II
 * der Vergangenheit, Genitiv attributes, `ohne … zu`), anything of B2. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a
 * native speaker. It describes the grammar idea and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_32_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-nebensaetze-integration',
    category: 'conjunctions',
    level: 'B1',
    unit: 32,
    visual: 'verbpos',
    title: l(
      'Nebensätze im Überblick (weil, dass, wenn/als, ob, obwohl, damit, nachdem, falls, Relativsatz, um … zu) — повторение по функциям',
      'Nebensätze im Überblick (weil, dass, wenn/als, ob, obwohl, damit, nachdem, falls, Relativsatz, um … zu) — функциялары боюнча кайталоо',
    ),
    summary: l(
      'За курс вы выучили много придаточных предложений. У всех одно правило: союз (или относительное местоимение), подлежащее, остальное, и спрягаемый глагол в самом конце; придаточное отделяется запятой. Если оно стоит перед главным предложением, главное начинается с глагола: «Weil ich krank bin, bleibe ich zu Hause». Удобнее всего запоминать их по функциям: причина — weil; следствие — sodass, so … dass; цель — damit, um … zu; условие — wenn, falls; время — wenn, als, nachdem, bevor, während, sobald; уступка — obwohl; содержание — dass, ob; описание — Relativsatz (der, dem, mit dem …).',
      'Курс боюнча сиз көптөгөн кошумча бөлүктөрдү үйрөндүңүз. Баарында бир эреже: байламта (же байланыш сөзү), ээ, калганы жана жакка жараша өзгөргөн этиш эң аягында; кошумча бөлүк үтүр менен бөлүнөт. Ал башкы бөлүктүн алдында турса, башкы бөлүк этиштен башталат: «Weil ich krank bin, bleibe ich zu Hause». Аларды функциялары боюнча эстеп калуу ыңгайлуу: себеп — weil; натыйжа — sodass, so … dass; максат — damit, um … zu; шарт — wenn, falls; убакыт — wenn, als, nachdem, bevor, während, sobald; макул болбостук — obwohl; мазмун — dass, ob; сүрөттөө — байланыш сөзү менен кошумча бөлүк (der, dem, mit dem …).',
    ),
    discover: l(
      'Посмотрите на три пары: «Ich bleibe zu Hause, weil ich krank bin» / «Weil ich krank bin, bleibe ich zu Hause»; «Ich lerne, um zu bestehen» / «Ich lerne, damit meine Eltern stolz sind»; «Er sagt, dass er kommt» / «Ich weiß nicht, ob er kommt». Где стоит спрягаемый глагол в каждой части с союзом? Что меняется в главной части, когда придаточное стоит первым?',
      'Үч жуптун бирине карап көрүңүз: «Ich bleibe zu Hause, weil ich krank bin» / «Weil ich krank bin, bleibe ich zu Hause»; «Ich lerne, um zu bestehen» / «Ich lerne, damit meine Eltern stolz sind»; «Er sagt, dass er kommt» / «Ich weiß nicht, ob er kommt». Байламтасы бар ар бир бөлүктө жакка жараша өзгөргөн этиш кайда турат? Кошумча бөлүк биринчи турганда башкы бөлүктө эмне өзгөрөт?',
    ),
    why: l(
      'На B1 вы строите длинные предложения: выражаете причину, цель, условие и точку зрения. Если глагол стоит не там, предложение сразу звучит неправильно, а слушатель теряет нить. Эта карта собирает всё в одно место: она показывает, в каком юните вы встречали каждый тип, и какие пары чаще всего путают. Новых конструкций здесь нет — вы учитесь видеть систему.',
      'B1 деңгээлинде сиз узун сүйлөмдөрдү түзөсүз: себепти, максатты, шартты жана көз карашты билдиресиз. Этиш өз ордунда турбаса, сүйлөм дароо туура эмес угулат, ал эми угуучу ойдун жиберин жоготот. Бул карта баарын бир жерге чогултат: ар бир түрдү кайсы бөлүмдө жолуктурганыңызды жана эң көп кайсы жуптар аралашып кетерин көрсөтөт. Бул жерде жаңы конструкциялар жок — сиз системаны көрүүнү үйрөнөсүз.',
    ),
    when: [
      l(
        'Шаг 1 — правило порядка слов: союз + подлежащее + остальное + спрягаемый глагол в конце. «…, weil ich keine Zeit habe», «…, dass das Formular ausgefüllt ist». При сложных формах глагола в конце стоит спрягаемая часть: «…, weil ich es vergessen habe», «…, damit alle mitmachen können». Придаточное перед главным: после запятой сразу глагол — «Wenn ich Zeit habe, rufe ich an».',
        '1-кадам — сөз иретинин эрежеси: байламта + ээ + калганы + жакка жараша өзгөргөн этиш аягында. «…, weil ich keine Zeit habe», «…, dass das Formular ausgefüllt ist». Этиштин татаал формаларында аягында жакка жараша өзгөргөн бөлүк турат: «…, weil ich es vergessen habe», «…, damit alle mitmachen können». Кошумча бөлүк башкынын алдында турса: үтүрдөн кийин дароо этиш — «Wenn ich Zeit habe, rufe ich an».',
      ),
      l(
        'Шаг 2 — по функциям: причина — weil (юнит A2; denn — главное предложение); следствие — sodass, so … dass (юнит 30); цель — damit (другое подлежащее), um … zu (то же, юнит 23 и 30); условие — wenn, falls (юнит 28); время — wenn (повторяется), als (один раз в прошлом), nachdem (юниты 21 и 29), bevor, während, seitdem, bis, sobald, solange; уступка — obwohl (юнит 22; trotzdem — главное предложение).',
        '2-кадам — функциялары боюнча: себеп — weil (A2; denn — башкы бөлүк); натыйжа — sodass, so … dass (30-бөлүм); максат — damit (ээ башка), um … zu (ээ бирдей, 23 жана 30-бөлүмдөр); шарт — wenn, falls (28-бөлүм); убакыт — wenn (кайталанат), als (өткөндө бир жолу), nachdem (21 жана 29-бөлүмдөр), bevor, während, seitdem, bis, sobald, solange; макул болбостук — obwohl (22-бөлүм; trotzdem — башкы бөлүк).',
      ),
      l(
        'Шаг 3 — содержание и описание: dass («Ich glaube, dass …»), ob («Ich weiß nicht, ob …» — когда в вопросе нет вопросительного слова); Relativsatz (юниты 23 и 29): род и число — от слова перед запятой, падеж — от глагола или предлога: «die Frau, die kommt», «der Mann, dem ich helfe», «die Stadt, in der ich lebe». Инфинитивная конструкция: «Ich habe vor, nach Berlin zu fahren», «um … zu» — цель при одном лице.',
        '3-кадам — мазмун жана сүрөттөө: dass («Ich glaube, dass …»), ob («Ich weiß nicht, ob …» — суроодо суроо сөзү жок болгондо); байланыш сөзү менен кошумча бөлүк (23 жана 29-бөлүмдөр): жынысы жана саны үтүрдүн алдындагы сөздөн, жалгоосу этиштен же предлогдон: «die Frau, die kommt», «der Mann, dem ich helfe», «die Stadt, in der ich lebe». Инфинитив конструкциясы: «Ich habe vor, nach Berlin zu fahren», «um … zu» — бир адам аракет кылганда максат.',
      ),
      l(
        'Шаг 4 — частые путаницы: weil или denn («denn» — как und, порядок слов обычный); als или wenn (als — один раз в прошлом, wenn — повторяется или будущее); dass или damit (damit — цель); ob или dass (ob — «ли»); obwohl или trotzdem (obwohl + глагол в конце, trotzdem + глагол сразу после него); der / dem / den в Relativsatz (проверьте падеж).',
        '4-кадам — көп аралашуучу жерлер: weil же denn («denn» — und сыяктуу, сөздөрдүн иреттери адаттагыдай); als же wenn (als — өткөндө бир жолу, wenn — кайталанат же келечек); dass же damit (damit — максат); ob же dass (ob — «же»); obwohl же trotzdem (obwohl + этиш аягында, trotzdem + этиш андан дароо кийин); байланыш сөзү менен кошумча бөлүктөгү der / dem / den (жалгоосун текшериңиз).',
      ),
    ],
    examples: [
      {
        de: 'Ich lerne jeden Tag, damit ich die Prüfung bestehe.',
        ru: 'Я учусь каждый день, чтобы сдать экзамен.',
        ky: 'Мен экзаменден өтүш үчүн күн сайын окуйм.',
        focus: 'Ziel: damit, Verb am Ende',
      },
      {
        de: 'Als ich in Dresden war, habe ich viel gesehen.',
        ru: 'Когда я был в Дрездене, я многое увидел.',
        ky: 'Мен Дрезденде болгондо көп нерсе көрдүм.',
        focus: 'Zeit: als (einmal in der Vergangenheit)',
      },
      {
        de: 'Obwohl es regnet, kommen viele Nachbarn zum Fest.',
        ru: 'Хотя идёт дождь, на праздник приходит много соседей.',
        ky: 'Жамгыр жаап жатса да, майрамга көптөгөн кошуналар келет.',
        focus: 'Gegensatz: obwohl; Hauptsatz beginnt mit dem Verb',
      },
      {
        de: 'Ich weiß nicht, ob der Antrag schon geprüft ist.',
        ru: 'Я не знаю, проверено ли уже заявление.',
        ky: 'Арыз буга чейин текшерилгенин билбейм.',
        focus: 'Inhalt: ob (Entscheidungsfrage)',
      },
      {
        de: 'Das ist die Kollegin, mit der ich oft zusammenarbeite.',
        ru: 'Это коллега, с которой я часто работаю вместе.',
        ky: 'Бул мен көп иштешкен кесиптеш.',
        focus: 'Relativsatz mit Präposition',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich komme nicht, weil ich bin krank.',
        right: 'Ich komme nicht, weil ich krank bin.',
        note: l(
          'После weil спрягаемый глагол стоит в самом конце: «weil ich krank bin».',
          'weil дан кийин жакка жараша өзгөргөн этиш эң аягында турат: «weil ich krank bin».',
        ),
      },
      {
        wrong: 'Wenn ich 2019 in Berlin war, habe ich viel gesehen.',
        right: 'Als ich 2019 in Berlin war, habe ich viel gesehen.',
        note: l(
          'Один раз в прошлом — als. Wenn — для повторяющегося действия или будущего.',
          'Өткөндө бир жолу — als. Wenn — кайталанган аракет же келечек үчүн.',
        ),
      },
      {
        wrong: 'Ich lerne, damit ich bestehe die Prüfung.',
        right: 'Ich lerne, damit ich die Prüfung bestehe.',
        note: l(
          'В придаточном с damit глагол (bestehe) — в самом конце.',
          'damit менен кошумча бөлүктө этиш (bestehe) эң аягында.',
        ),
      },
      {
        wrong: 'Obwohl es regnet, aber wir gehen zum Fest.',
        right: 'Obwohl es regnet, gehen wir zum Fest.',
        note: l(
          'После придаточного с obwohl слово «aber» не нужно, а главная часть начинается с глагола.',
          'obwohl менен кошумча бөлүктөн кийин «aber» керек эмес, ал эми башкы бөлүк этиштен башталат.',
        ),
      },
      {
        wrong: 'Ich weiß nicht, dass er kommt.',
        right: 'Ich weiß nicht, ob er kommt.',
        note: l(
          'Если в основе — вопрос «да или нет», нужен ob. Dass вводит утверждение.',
          'Негизинде «ооба же жок» суроосу болсо, ob керек. Dass билдирүүнү киргизет.',
        ),
      },
      {
        wrong: 'Das ist der Mann, den ich mit gesprochen habe.',
        right: 'Das ist der Mann, mit dem ich gesprochen habe.',
        note: l(
          'Предлог стоит перед относительным местоимением, а падеж определяет предлог: mit + Dativ → dem.',
          'Предлог байланыш сөзүнүн алдында турат, ал эми жалгоосун предлог аныктайт: mit + Dativ → dem.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Wenn ich Zeit habe, schreibe ich in mein Lerntagebuch.',
        ru: 'Когда у меня есть время, я пишу в свой дневник обучения.',
        ky: 'Убактым болгондо мен окуу күндөлүгүмө жазам.',
        focus: 'Bedingung / Wiederholung: wenn',
      },
      {
        de: 'Nachdem ich den Kurs beendet hatte, habe ich eine Bilanz gezogen.',
        ru: 'Закончив курс, я подвёл итоги.',
        ky: 'Курсту бүтүргөндөн кийин мен жыйынтык чыгардым.',
        focus: 'nachdem + Plusquamperfekt',
      },
      {
        de: 'Ich habe viel gelernt, sodass ich jetzt freier spreche.',
        ru: 'Я многому научился, так что теперь говорю свободнее.',
        ky: 'Мен көп нерсе үйрөндүм, ошондуктан азыр эркинирээк сүйлөйм.',
        focus: 'Folge: sodass',
      },
    ],
    dialogue: [
      {
        speaker: 'Mira',
        text: 'Weißt du, ob die Probeprüfung heute oder morgen ist?',
        ru: 'Ты не знаешь, пробная проверка сегодня или завтра?',
        ky: 'Сен сынактык текшерүү бүгүн же эртең экенин билбейсиңби?',
      },
      {
        speaker: 'Ben',
        text: 'Sie ist morgen, weil heute der Raum besetzt ist.',
        ru: 'Она завтра, потому что сегодня помещение занято.',
        ky: 'Ал эртең, анткени бүгүн бөлмө бош эмес.',
      },
      {
        speaker: 'Mira',
        text: 'Gut. Obwohl ich nervös bin, freue ich mich darauf.',
        ru: 'Хорошо. Хотя я нервничаю, я этому рада.',
        ky: 'Жакшы. Тынчсызданып жатсам да, буга кубанам.',
      },
      {
        speaker: 'Ben',
        text: 'Ich lerne heute noch, damit ich morgen ruhig bin.',
        ru: 'Я ещё сегодня поучусь, чтобы завтра быть спокойным.',
        ky: 'Эртең тынч болушум үчүн мен бүгүн дагы бир аз окуйм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите три предложения о вашем обучении: одно с weil (причина), одно с damit или um … zu (цель) и одно с obwohl (уступка).',
        'Окуу жөнүндө үч сүйлөм айтыңыз: бири weil менен (себеп), бири damit же um … zu менен (максат) жана бири obwohl менен (макул болбостук).',
      ),
      sample: 'Ich lerne gern Deutsch, weil ich hier arbeite. Ich übe jeden Tag, damit ich besser spreche. Obwohl ich manchmal müde bin, mache ich weiter.',
      keywords: ['weil', 'damit', 'obwohl', 'ich'],
    },
    source: UNIT_32_SOURCE,
  },
  {
    id: 'b1-satzbau-mittelfeld',
    category: 'wordorder',
    level: 'B1',
    unit: 32,
    visual: 'verbpos',
    title: l(
      'Mittelfeld: Satzklammer, Pronomen, Dativ vor Akkusativ, TeKaMoLo — порядок слов в середине предложения',
      'Mittelfeld: Satzklammer, Pronomen, Dativ vor Akkusativ, TeKaMoLo — сүйлөмдүн ортосундагы сөз иреттери',
    ),
    summary: l(
      'Спрягаемый глагол стоит на втором месте, а остальные части глагола — в самом конце: между ними Mittelfeld («середина»), и именно там нужны правила. 1) Satzklammer: «Ich habe es ihm gestern gegeben», «Er muss das Formular heute ausfüllen», «Der Antrag wird morgen geprüft». 2) Местоимение стоит раньше существительного, а Akkusativ-местоимение — раньше Dativ-местоимения: «Ich gebe es ihm»; с двумя существительными обычно Dativ стоит перед Akkusativ: «Ich schicke dem Amt das Formular». 3) TeKaMoLo: сначала время (Temporal), потом причина (Kausal), способ (Modal), место (Lokal): «Wir fahren morgen deshalb mit dem Zug nach Leipzig». Эти правила вы уже использовали с 21-го юнита; здесь они собраны как система.',
      'Жакка жараша өзгөргөн этиш экинчи орунда турат, ал эми этиштин калган бөлүктөрү — эң аягында: алардын ортосунда Mittelfeld («орто»), эрежелер так ошол жерде керек. 1) Satzklammer: «Ich habe es ihm gestern gegeben», «Er muss das Formular heute ausfüllen», «Der Antrag wird morgen geprüft». 2) Ат атооч зат атоочтун алдында турат, ал эми Akkusativдеги ат атооч Dativдеги ат атоочтун алдында: «Ich gebe es ihm»; эки зат атооч болсо, адатта Dativ Akkusativдин алдында турат: «Ich schicke dem Amt das Formular». 3) TeKaMoLo: адегенде убакыт (Temporal), андан кийин себеп (Kausal), ыкма (Modal), жер (Lokal): «Wir fahren morgen deshalb mit dem Zug nach Leipzig». Бул эрежелерди сиз 21-бөлүмдөн бери колдонуп келатасыз; бул жерде алар система катары чогултулду.',
    ),
    discover: l(
      'Сравните: «Ich habe gestern dem Lehrer das Formular gegeben» и «Ich habe es ihm gestern gegeben». Что поменялось, когда вместо существительных появились местоимения? А теперь: «Wir fahren mit dem Zug morgen nach Leipzig» — звучит ли это так же естественно, как «Wir fahren morgen mit dem Zug nach Leipzig»?',
      '«Ich habe gestern dem Lehrer das Formular gegeben» жана «Ich habe es ihm gestern gegeben» сүйлөмдөрүн салыштырыңыз. Зат атоочтордун ордуна ат атоочтор келгенде эмне өзгөрдү? Эми: «Wir fahren mit dem Zug morgen nach Leipzig» — бул «Wir fahren morgen mit dem Zug nach Leipzig» сыяктуу эле табигый угулабы?',
    ),
    why: l(
      'Правильный порядок слов — это то, что делает предложение «немецким» и понятным: он помогает и в разговоре, и в письме, и в заданиях на составление предложений. Большинство ошибок B1 — не в формах слов, а в том, куда их поставили. Правила короткие, и их можно проверить за несколько секунд.',
      'Сөз иретинин туура болушу — сүйлөмдү «немисче» жана түшүнүктүү кылган нерсе: ал сүйлөшүүдө да, жазууда да, сүйлөм түзүү тапшырмаларында да жардам берет. B1 деңгээлиндеги каталардын көбү сөздөрдүн формасында эмес, аларды кайда койгондо. Эрежелер кыска жана аларды бир нече секундда текшерүүгө болот.',
    ),
    when: [
      l(
        'Шаг 1 — Satzklammer: спрягаемый глагол на втором месте, остальное — в конце. Perfekt: «Ich habe das Formular gestern ausgefüllt». Модальный глагол: «Ich muss heute noch lernen». Разделяемый глагол: «Der Kurs fängt morgen an». Passiv: «Das Formular wird heute eingereicht». Всё остальное — между двумя частями (в Mittelfeld).',
        '1-кадам — Satzklammer: жакка жараша өзгөргөн этиш экинчи орунда, калганы — аягында. Perfekt: «Ich habe das Formular gestern ausgefüllt». Модалдык этиш: «Ich muss heute noch lernen». Бөлүнүүчү этиш: «Der Kurs fängt morgen an». Passiv: «Das Formular wird heute eingereicht». Калган нерселер — эки бөлүктүн ортосунда (Mittelfeldде).',
      ),
      l(
        'Шаг 2 — местоимения: местоимение перед существительным («Ich gebe es dem Lehrer» — «Ich gebe dem Lehrer das Buch»); два местоимения: Akkusativ перед Dativ («Ich gebe es ihm»); два существительных: обычно Dativ перед Akkusativ («Ich zeige dem Gast die Stadt»).',
        '2-кадам — ат атоочтор: ат атооч зат атоочтун алдында («Ich gebe es dem Lehrer» — «Ich gebe dem Lehrer das Buch»); эки ат атооч: Akkusativ Dativдин алдында («Ich gebe es ihm»); эки зат атооч: адатта Dativ Akkusativдин алдында («Ich zeige dem Gast die Stadt»).',
      ),
      l(
        'Шаг 3 — TeKaMoLo: Temporal (когда?) — Kausal (почему?) — Modal (как?) — Lokal (где / куда?). «Er ist gestern aus Neugier zu Fuß in die Stadt gegangen». Если не уверены, начните с времени, закончите местом: «Ich fahre morgen mit dem Bus in die Stadt».',
        '3-кадам — TeKaMoLo: Temporal (качан?) — Kausal (эмне үчүн?) — Modal (кандайча?) — Lokal (кайда / кайда карай?). «Er ist gestern aus Neugier zu Fuß in die Stadt gegangen». Ишенбесеңиз, убакыттан баштап, жер менен аяктаңыз: «Ich fahre morgen mit dem Bus in die Stadt».',
      ),
      l(
        'Шаг 4 — проверка в три секунды: 1) где спрягаемый глагол (второе место)? 2) где вторая часть глагола (в конце)? 3) стоят ли местоимения раньше существительных, а время — раньше места? В придаточном те же правила, но спрягаемый глагол — в самом конце: «…, weil ich es ihm gestern gegeben habe». Помните: порядок внутри Mittelfeld иногда допускает варианты; в заданиях на порядок слов выбирайте самый обычный.',
        '4-кадам — үч секундада текшерүү: 1) жакка жараша өзгөргөн этиш кайда (экинчи орун)? 2) этиштин экинчи бөлүгү кайда (аягында)? 3) ат атоочтор зат атоочтордун алдында, убакыт жердин алдында турабы? Кошумча бөлүктө ушул эле эрежелер, бирок жакка жараша өзгөргөн этиш эң аягында: «…, weil ich es ihm gestern gegeben habe». Унутпаңыз: Mittelfeld ичиндеги иреттер кээде варианттарга жол берет; сөз иретине тапшырмаларда эң кадимкисин тандаңыз.',
      ),
    ],
    examples: [
      {
        de: 'Ich habe es ihm gestern gegeben.',
        ru: 'Я отдал это ему вчера.',
        ky: 'Мен муну ага кечээ бердим.',
        focus: 'Akkusativ-Pronomen vor Dativ-Pronomen, Satzklammer',
      },
      {
        de: 'Ich schicke dem Amt morgen das Formular.',
        ru: 'Я отправляю ведомству бланк завтра.',
        ky: 'Мен мекемеге бланкты эртең жөнөтөм.',
        focus: 'Dativ vor Akkusativ (Nomen)',
      },
      {
        de: 'Wir fahren morgen deshalb mit dem Zug nach Leipzig.',
        ru: 'Мы едем завтра поэтому на поезде в Лейпциг.',
        ky: 'Биз эртең ошондуктан поезд менен Лейпцигге барабыз.',
        focus: 'TeKaMoLo',
      },
      {
        de: 'Er muss das Formular heute noch ausfüllen.',
        ru: 'Ему нужно сегодня ещё заполнить бланк.',
        ky: 'Ал бүгүн дагы бланкты толтурушу керек.',
        focus: 'Satzklammer mit Modalverb',
      },
      {
        de: 'Der Antrag wird morgen von der Behörde geprüft.',
        ru: 'Заявление будет проверено завтра ведомством.',
        ky: 'Арыз эртең мекеме тарабынан текшерилет.',
        focus: 'Satzklammer im Passiv',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich habe gegeben es ihm gestern.',
        right: 'Ich habe es ihm gestern gegeben.',
        note: l(
          'Partizip II — в самом конце (Satzklammer); местоимения идут сразу после haben.',
          'Partizip II — эң аягында (Satzklammer); ат атоочтор haben дан кийин дароо келет.',
        ),
      },
      {
        wrong: 'Ich gebe ihm es.',
        right: 'Ich gebe es ihm.',
        note: l(
          'Из двух местоимений Akkusativ (es) стоит раньше Dativ (ihm).',
          'Эки ат атоочтун Akkusativи (es) Dativден (ihm) мурун турат.',
        ),
      },
      {
        wrong: 'Wir fahren nach Leipzig mit dem Zug morgen.',
        right: 'Wir fahren morgen mit dem Zug nach Leipzig.',
        note: l(
          'Порядок TeKaMoLo: время (morgen) — способ (mit dem Zug) — место (nach Leipzig).',
          'TeKaMoLo иреттери: убакыт (morgen) — ыкма (mit dem Zug) — жер (nach Leipzig).',
        ),
      },
      {
        wrong: 'Er muss ausfüllen das Formular.',
        right: 'Er muss das Formular ausfüllen.',
        note: l(
          'Инфинитив после модального глагола стоит в самом конце, а дополнение — перед ним.',
          'Модалдык этиштен кийинки инфинитив эң аягында турат, ал эми толуктоочу андан мурун.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich schicke ihm die Bestätigung morgen per E-Mail.',
        ru: 'Я пошлю ему подтверждение завтра по электронной почте.',
        ky: 'Мен ага ырастоону эртең электрондук почта аркылуу жиберем.',
        focus: 'Pronomen vor Nomen, TeKaMoLo',
      },
      {
        de: 'Könnten Sie mir das bitte noch einmal erklären?',
        ru: 'Не могли бы вы мне это ещё раз объяснить?',
        ky: 'Муну мага дагы бир жолу түшүндүрүп бере аласызбы?',
        focus: 'Dativ-Pronomen vor Akkusativ-Pronomen im Mittelfeld',
      },
      {
        de: 'Wir haben uns gestern lange im Park getroffen.',
        ru: 'Мы вчера долго встречались в парке.',
        ky: 'Биз кечээ паркта узакка жолуктук.',
        focus: 'Satzklammer, Temporal vor Lokal',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Weiß',
        text: 'Haben Sie dem Büro das Formular schon geschickt?',
        ru: 'Вы уже отправили бланк в бюро?',
        ky: 'Сиз бланкты бюрого буга чейин эле жибердиңизби?',
      },
      {
        speaker: 'Ben',
        text: 'Ja, ich habe es ihm gestern per E-Mail geschickt.',
        ru: 'Да, я отправил его им вчера по электронной почте.',
        ky: 'Ооба, мен аны ага кечээ электрондук почта аркылуу жибердим.',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Und wann können Sie mir die Antwort zeigen?',
        ru: 'А когда вы можете показать мне ответ?',
        ky: 'Ал эми жоопту мага качан көрсөтө аласыз?',
      },
      {
        speaker: 'Ben',
        text: 'Ich zeige sie Ihnen morgen im Kurs.',
        ru: 'Я покажу его вам завтра на курсе.',
        ky: 'Мен аны сизге эртең курста көрсөтөм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, что вы вчера или завтра делаете с документом или подарком: используйте местоимения («es», «ihm») и порядок «когда — как — куда».',
        'Кечээ же эртең документ же белек менен эмне кылганыңызды же кыла турганыңызды айтыңыз: ат атоочторду («es», «ihm») жана «качан — кандайча — кайда» иретин колдонуңуз.',
      ),
      sample: 'Ich habe es ihm gestern gegeben. Morgen fahre ich mit dem Zug nach Leipzig. Ich schicke dem Amt das Formular heute noch.',
      keywords: ['es', 'ihm', 'morgen', 'mit dem zug'],
    },
    source: UNIT_32_SOURCE,
  },
]

export const UNIT_32_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Obwohl es regnet, kommen viele Nachbarn zum Fest.',
    ru: 'Хотя идёт дождь, на праздник приходит много соседей.',
    ky: 'Жамгыр жаап жатса да, майрамга көптөгөн кошуналар келет.',
    word: 'kommen',
    conceptId: 'b1-nebensaetze-integration',
    reason: l(
      'Придаточное с obwohl стоит первым и заканчивается глаголом (regnet). Поэтому главное предложение начинается с глагола (kommen), а подлежащее идёт после него. Слово «aber» здесь не нужно.',
      'obwohl менен кошумча бөлүк биринчи турат жана этиш менен бүтөт (regnet). Ошондуктан башкы бөлүк этиштен башталат (kommen), ал эми ээ андан кийин келет. «aber» сөзү бул жерде керек эмес.',
    ),
    more: [
      {
        de: 'Weil ich krank bin, bleibe ich zu Hause.',
        ru: 'Так как я болен, я остаюсь дома.',
        ky: 'Мен ооруп калгандыктан, үйдө калам.',
      },
      {
        de: 'Wenn ich Zeit habe, rufe ich an.',
        ru: 'Когда у меня есть время, я звоню.',
        ky: 'Убактым болсо, мен чалам.',
      },
    ],
  },
  {
    sentence: 'Ich weiß nicht, ob der Antrag schon geprüft ist.',
    ru: 'Я не знаю, проверено ли уже заявление.',
    ky: 'Арыз буга чейин текшерилгенин билбейм.',
    word: 'ob',
    conceptId: 'b1-nebensaetze-integration',
    reason: l(
      'Ob вводит косвенный вопрос «да или нет»; dass вводит утверждение. Спрягаемый глагол (ist) — в самом конце, а перед ним — форма geprüft (Zustandspassiv).',
      'Ob «ооба же жок» деген кыйыр суроону киргизет; dass билдирүүнү киргизет. Жакка жараша өзгөргөн этиш (ist) эң аягында, анын алдында — geprüft формасы (Zustandspassiv).',
    ),
    more: [
      {
        de: 'Er sagt, dass er morgen kommt.',
        ru: 'Он говорит, что придёт завтра.',
        ky: 'Ал эртең келерин айтат.',
      },
      {
        de: 'Das ist die Stadt, in der ich lebe.',
        ru: 'Это город, в котором я живу.',
        ky: 'Бул мен жашаган шаар.',
      },
    ],
  },
  {
    sentence: 'Ich habe es ihm gestern gegeben.',
    ru: 'Я отдал это ему вчера.',
    ky: 'Мен муну ага кечээ бердим.',
    word: 'es ihm',
    conceptId: 'b1-satzbau-mittelfeld',
    reason: l(
      'Спрягаемая часть (habe) — на втором месте, Partizip II (gegeben) — в самом конце: это Satzklammer. Между ними Mittelfeld: два местоимения идут первыми (Akkusativ es перед Dativ ihm), потом время (gestern).',
      'Жакка жараша өзгөргөн бөлүк (habe) — экинчи орунда, Partizip II (gegeben) — эң аягында: бул Satzklammer. Алардын ортосунда Mittelfeld: эки ат атооч биринчи турат (Akkusativ es Dativ ihm дин алдында), андан кийин убакыт (gestern).',
    ),
    more: [
      {
        de: 'Ich schicke dem Amt morgen das Formular.',
        ru: 'Я отправляю ведомству бланк завтра.',
        ky: 'Мен мекемеге бланкты эртең жөнөтөм.',
      },
      {
        de: 'Er muss das Formular heute noch ausfüllen.',
        ru: 'Ему нужно сегодня ещё заполнить бланк.',
        ky: 'Ал бүгүн дагы бланкты толтурушу керек.',
      },
    ],
  },
  {
    sentence: 'Wir fahren morgen deshalb mit dem Zug nach Leipzig.',
    ru: 'Мы едем завтра поэтому на поезде в Лейпциг.',
    ky: 'Биз эртең ошондуктан поезд менен Лейпцигге барабыз.',
    word: 'morgen deshalb mit dem Zug nach Leipzig',
    conceptId: 'b1-satzbau-mittelfeld',
    reason: l(
      'Это порядок TeKaMoLo: Temporal (morgen) — Kausal (deshalb) — Modal (mit dem Zug) — Lokal (nach Leipzig). Если не уверены, идите от времени к месту.',
      'Бул TeKaMoLo иреттери: Temporal (morgen) — Kausal (deshalb) — Modal (mit dem Zug) — Lokal (nach Leipzig). Ишенбесеңиз, убакыттан жерге карай жүрүңүз.',
    ),
    more: [
      {
        de: 'Ich fahre morgen mit dem Bus in die Stadt.',
        ru: 'Завтра я еду на автобусе в город.',
        ky: 'Эртең мен автобус менен шаарга барам.',
      },
      {
        de: 'Wir haben uns gestern lange im Park getroffen.',
        ru: 'Мы вчера долго встречались в парке.',
        ky: 'Биз кечээ паркта узакка жолуктук.',
      },
    ],
  },
]
