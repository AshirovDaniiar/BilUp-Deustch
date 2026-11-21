import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_28_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 28 grammar — the three APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-futur1-vermutungen` (L, limited-productive; decision D-3 open, fallback receptive only): Futur I (werden + Infinitiv) for forecasts (Es wird … geben) and
 *     for conjecture with `wohl` (Er wird wohl krank sein) on a CLOSED list of ten infinitives: sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren,
 *     arbeiten, geben. Plans and intentions stay in the Präsens with a time word (Morgen fahre ich …). NOT taught: Futur II, werden + Partizip II is the Passiv
 *     of Units 24 and 26 and is not Futur.
 *  2. `b1-falls-sobald-solange` (L, productive): the subordinators falls (condition), sobald (as soon as) and solange (as long as) with the verb at the end;
 *     `wenn` is revised (↻ A2). `sodass` is RECEPTIVE only (glossed in one reading, never required; productive in Unit 30).
 *  3. `b1-verben-praepositionen` (M, limited-productive): a CLOSED list of 20 verb + preposition pairs (Akkusativ and Dativ grouped; the six A2 pairs are revised
 *     ↻) and the question words / pronominal adverbs wo(r)- / da(r)- for these verbs. NOT taught: other verb + preposition pairs; relative clauses with a
 *     preposition (Unit 29); `damit` as a conjunction (Unit 30).
 * All schools, courses, people, dates and sums are fictional. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not
 * been reviewed by a native speaker. It describes the grammar idea and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_28_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-futur1-vermutungen',
    category: 'tenses',
    level: 'B1',
    unit: 28,
    visual: 'timeline',
    title: l(
      'Futur I: прогноз и предположение с wohl (Es wird regnen. Er wird wohl krank sein.)',
      'Futur I: болжол жана wohl менен божомол (Es wird regnen. Er wird wohl krank sein.)',
    ),
    summary: l(
      'Futur I строится из формы werden (ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie werden) и инфинитива в самом конце: «Die Prüfung wird schwer sein». Его используют для прогноза («In zehn Jahren werden viele Menschen online studieren») и для предположения о настоящем со словом wohl («Er wird wohl noch im Kurs sein» — «он, наверное, ещё на курсе»). Для планов и намерений в немецком обычно хватает Präsens с указанием времени: «Morgen fahre ich nach Berlin». В этом юните Futur I — закрытый список из десяти инфинитивов: sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren, arbeiten, geben.',
      'Futur I werden этишинин формасынан (ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie werden) жана эң аягындагы инфинитивден турат: «Die Prüfung wird schwer sein». Ал болжол үчүн («In zehn Jahren werden viele Menschen online studieren») жана wohl сөзү менен азыркы чак жөнүндө божомол үчүн колдонулат («Er wird wohl noch im Kurs sein» — «ал, балким, дагы курста болуш керек»). Пландар жана ниеттер үчүн немис тилинде көбүнчө убакыт көрсөтүлгөн Präsens жетет: «Morgen fahre ich nach Berlin». Бул бөлүмдө Futur I — он инфинитивден турган жабык тизме: sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren, arbeiten, geben.',
    ),
    discover: l(
      'Сравните: «Morgen regnet es» и «Morgen wird es regnen». А теперь: «Er ist krank» и «Er wird wohl krank sein». Что добавляет wohl? Где стоит инфинитив?',
      '«Morgen regnet es» жана «Morgen wird es regnen» сүйлөмдөрүн салыштырыңыз. Эми: «Er ist krank» жана «Er wird wohl krank sein». wohl эмне кошот? Инфинитив кайда турат?',
    ),
    why: l(
      'Когда вы говорите о будущем учёбы и профессии или объясняете, почему кого-то нет на занятии, вам нужны прогнозы и осторожные предположения: «Das wird nicht leicht sein», «Sie wird wohl keine Zeit haben». Так вы звучите увереннее и не выдаёте догадку за факт.',
      'Окуунун жана кесиптин келечеги жөнүндө сүйлөгөндө же кимдир бирөө сабакта эмне үчүн жок экенин түшүндүргөндө болжолдор жана этияттуу божомолдор керек: «Das wird nicht leicht sein», «Sie wird wohl keine Zeit haben». Ошентип сиз ишенимдүү угуласыз жана божомолду факт катары бербейсиз.',
    ),
    when: [
      l(
        'Шаг 1 — форма: werden на втором месте + инфинитив в конце: «Ich werde die Prüfung wohl bestehen», «Wir werden viel lernen». Множественное число — werden: «Die Teilnehmer werden kommen».',
        '1-кадам — формасы: werden экинчи орунда + аягында инфинитив: «Ich werde die Prüfung wohl bestehen», «Wir werden viel lernen». Көптүк сан — werden: «Die Teilnehmer werden kommen».',
      ),
      l(
        'Шаг 2 — прогноз: что, вероятно, будет: «Nächstes Jahr wird es mehr Studienplätze geben», «In zehn Jahren werden viele online studieren».',
        '2-кадам — болжол: эмне болору мүмкүн: «Nächstes Jahr wird es mehr Studienplätze geben», «In zehn Jahren werden viele online studieren».',
      ),
      l(
        'Шаг 3 — предположение с wohl: о настоящем, «наверное»: «Er wird wohl krank sein», «Sie wird wohl keine Zeit haben». Wohl стоит после wird и подлежащего.',
        '3-кадам — wohl менен божомол: азыркы чак жөнүндө, «балким»: «Er wird wohl krank sein», «Sie wird wohl keine Zeit haben». wohl wird жана ээден кийин турат.',
      ),
      l(
        'Шаг 4 — различие: werden + инфинитив = Futur («Er wird kommen»); werden + Partizip II = Passiv («Der Brief wird geschickt», юниты 24 и 26). Для планов лучше Präsens: «Nächste Woche beginnt der Kurs». Futur II в этом юните нет.',
        '4-кадам — айырма: werden + инфинитив = Futur («Er wird kommen»); werden + Partizip II = Passiv («Der Brief wird geschickt», 24 жана 26-бөлүмдөр). Пландар үчүн Präsens жакшыраак: «Nächste Woche beginnt der Kurs». Бул бөлүмдө Futur II жок.',
      ),
    ],
    examples: [
      {
        de: 'Die Prüfung wird schwer sein.',
        ru: 'Экзамен будет трудным.',
        ky: 'Экзамен оор болот.',
        focus: 'Prognose: wird + sein',
      },
      {
        de: 'In zehn Jahren werden viele Menschen online studieren.',
        ru: 'Через десять лет многие люди будут учиться онлайн.',
        ky: 'Он жылдан кийин көптөгөн адамдар онлайн окушат.',
        focus: 'Prognose: werden + studieren (Plural)',
      },
      {
        de: 'Ich glaube, du wirst die Prüfung bestehen.',
        ru: 'Я думаю, ты сдашь экзамен.',
        ky: 'Менимче, сен экзаменден өтөсүң.',
        focus: 'wirst + bestehen',
      },
      {
        de: 'Er wird wohl noch im Kurs sein.',
        ru: 'Он, наверное, ещё на курсе.',
        ky: 'Ал, балким, дагы курста болуш керек.',
        focus: 'Vermutung mit wohl',
      },
      {
        de: 'Sie wird wohl keine Zeit haben.',
        ru: 'У неё, наверное, нет времени.',
        ky: 'Анын, балким, убактысы жок.',
        focus: 'Vermutung mit wohl: wird wohl + haben',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich werde morgen gehen zur Schule.',
        right: 'Ich werde morgen zur Schule gehen.',
        note: l(
          'Инфинитив при werden стоит в самом конце предложения.',
          'werden менен келген инфинитив сүйлөмдүн эң аягында турат.',
        ),
      },
      {
        wrong: 'Er wird wohl krank ist.',
        right: 'Er wird wohl krank sein.',
        note: l(
          'После werden нужен инфинитив (sein), а не спрягаемая форма (ist).',
          'werden этишинен кийин инфинитив (sein) керек, жакка жараша өзгөргөн форма (ist) эмес.',
        ),
      },
      {
        wrong: 'Die Prüfung wird schwer.',
        right: 'Die Prüfung wird schwer sein.',
        note: l(
          'Для Futur I нужен инфинитив в конце: «wird schwer sein». «Wird schwer» без sein — неполно.',
          'Futur I үчүн аягында инфинитив керек: «wird schwer sein». sein болбой «wird schwer» — толук эмес.',
        ),
      },
      {
        wrong: 'Die Teilnehmer wird die Prüfung bestehen.',
        right: 'Die Teilnehmer werden die Prüfung bestehen.',
        note: l(
          'Подлежащее «die Teilnehmer» — множественное число, поэтому werden, а не wird.',
          'Ээси «die Teilnehmer» — көптүк сан, ошондуктан wird эмес, werden.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Nächstes Jahr wird es mehr Studienplätze geben.',
        ru: 'В следующем году мест для учёбы будет больше.',
        ky: 'Келерки жылы окуу орундары көбөйөт.',
        focus: 'wird … geben',
      },
      {
        de: 'Wir werden viel lernen, aber wir werden es schaffen.',
        ru: 'Мы будем много учиться, но справимся.',
        ky: 'Биз көп окуйбуз, бирок аны жеңебиз.',
        focus: 'werden + schaffen',
      },
      {
        de: 'Mein Bruder wird wohl auch kommen.',
        ru: 'Мой брат, наверное, тоже придёт.',
        ky: 'Менин иним, балким, келет.',
        focus: 'wird wohl + kommen',
      },
    ],
    dialogue: [
      {
        speaker: 'Berater',
        text: 'Möchten Sie Medizin studieren? Das wird nicht leicht sein.',
        ru: 'Вы хотите учиться на медика? Это будет нелегко.',
        ky: 'Сиз медицинага окугуңуз келеби? Бул оңой болбойт.',
      },
      {
        speaker: 'Studentin',
        text: 'Ich weiß. Aber ich glaube, ich werde es schaffen.',
        ru: 'Я знаю. Но я думаю, что справлюсь.',
        ky: 'Билем. Бирок менимче, мен аны жеңем.',
      },
      {
        speaker: 'Berater',
        text: 'Wo ist denn Ihr Freund heute? Er wird wohl noch arbeiten.',
        ru: 'А где сегодня ваш друг? Он, наверное, ещё работает.',
        ky: 'Ал эми сиздин досуңуз бүгүн кайда? Ал, балким, дагы иштеп жатат.',
      },
      {
        speaker: 'Studentin',
        text: 'Ja, er wird wohl bis spät arbeiten. Er kommt später.',
        ru: 'Да, он, наверное, работает допоздна. Он придёт позже.',
        ky: 'Ооба, ал, балким, кечке чейин иштейт. Ал кийинчерээк келет.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, как, по-вашему, будет выглядеть учёба в будущем, и что вы предполагаете о друге, который сегодня не пришёл. Используйте «werden + Infinitiv» и «wird wohl».',
        'Келечекте окуу кандай болоорун жана бүгүн келбеген дос жөнүндө эмне божомолдойсуз — айтыңыз. «werden + Infinitiv» жана «wird wohl» колдонуңуз.',
      ),
      sample: 'In zehn Jahren werden viele Menschen online lernen. Mein Freund wird wohl krank sein. Ich werde die Prüfung wohl bestehen.',
      keywords: ['werden', 'wird', 'wohl', 'bestehen'],
    },
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-falls-sobald-solange',
    category: 'conjunctions',
    level: 'B1',
    unit: 28,
    visual: 'verbpos',
    title: l(
      'falls, sobald, solange — условие, «как только», «пока»',
      'falls, sobald, solange — шарт, «болору менен», «качан… бою»',
    ),
    summary: l(
      'Три союза вводят придаточное предложение с глаголом в конце. Falls — условие, возможный случай («Falls ich die Prüfung nicht bestehe, wiederhole ich sie»); он близок к wenn, но подчёркивает: это может и не случиться. Sobald — «как только», действие следует сразу за другим («Sobald ich fertig bin, rufe ich an»). Solange — «пока», пока длится одно и то же состояние («Solange ich studiere, wohne ich bei meinen Eltern»). Если придаточное стоит первым, то в главной части глагол идёт сразу после запятой: «Falls es regnet, bleiben wir zu Hause». Wenn вы знаете из A2 (юнит 14).',
      'Үч байланыштыргыч этиши аягында турган кошумча бөлүктү киргизет. Falls — шарт, мүмкүн болгон учур («Falls ich die Prüfung nicht bestehe, wiederhole ich sie»); ал wenn сөзүнө жакын, бирок бул болбой да калышы мүмкүн экенин баса белгилейт. Sobald — «болору менен», бир иш экинчисинен дароо кийин («Sobald ich fertig bin, rufe ich an»). Solange — «… бою», бир эле абал созулуп турганда («Solange ich studiere, wohne ich bei meinen Eltern»). Кошумча бөлүк биринчи турса, башкы бөлүктө этиш үтүрдөн дароо кийин келет: «Falls es regnet, bleiben wir zu Hause». wenn сөзүн сиз A2 деңгээлинен билесиз (14-бөлүм).',
    ),
    discover: l(
      'Сравните: «Wenn ich Zeit habe, lerne ich» и «Falls ich Zeit habe, lerne ich». А теперь «Sobald ich Zeit habe, lerne ich» и «Solange ich Zeit habe, lerne ich». Чем различаются значения? Где стоят глаголы?',
      '«Wenn ich Zeit habe, lerne ich» жана «Falls ich Zeit habe, lerne ich» сүйлөмдөрүн салыштырыңыз. Эми «Sobald ich Zeit habe, lerne ich» жана «Solange ich Zeit habe, lerne ich». Маанилери кандай айырмаланат? Этиштер кайда турат?',
    ),
    why: l(
      'Планируя учёбу и будущее, вы постоянно говорите об условиях и сроках: «Falls ich ein Stipendium bekomme, studiere ich im Ausland», «Sobald ich das Abitur habe, bewerbe ich mich», «Solange ich lerne, arbeite ich nur halbtags». Эти слова делают планы точными.',
      'Окууну жана келечекти пландаганда сиз дайыма шарттар жана мөөнөттөр жөнүндө сүйлөйсүз: «Falls ich ein Stipendium bekomme, studiere ich im Ausland», «Sobald ich das Abitur habe, bewerbe ich mich», «Solange ich lerne, arbeite ich nur halbtags». Бул сөздөр пландарды так кылат.',
    ),
    when: [
      l(
        'Шаг 1 — falls = «если вдруг»: «Falls du Fragen hast, schreib mir». В придаточном глагол стоит в конце. Для обычных, повторяющихся условий оставайтесь с wenn.',
        '1-кадам — falls = «эгер кокус»: «Falls du Fragen hast, schreib mir». Кошумча бөлүктө этиш аягында турат. Адаттагы, кайталануучу шарттар үчүн wenn колдонуңуз.',
      ),
      l(
        'Шаг 2 — sobald = «как только»: «Ich bewerbe mich, sobald ich die Bescheinigung habe». Действие в главной части происходит сразу после действия в придаточной.',
        '2-кадам — sobald = «болору менен»: «Ich bewerbe mich, sobald ich die Bescheinigung habe». Башкы бөлүктөгү аракет кошумча бөлүктөгү аракеттен дароо кийин болот.',
      ),
      l(
        'Шаг 3 — solange = «пока»: «Solange ich studiere, wohne ich bei meinen Eltern». Оба действия длятся одновременно, пока длится состояние.',
        '3-кадам — solange = «… бою»: «Solange ich studiere, wohne ich bei meinen Eltern». Эки аракет тең абал созулуп турганда бир убакта уланат.',
      ),
      l(
        'Только для понимания: «sodass» («так что») вы встретите в тексте («Der Kurs ist online, sodass man überall lernen kann»); использовать его самим пока не нужно, это будет в юните 30. Здесь — только falls, sobald, solange (и wenn из A2).',
        'Түшүнүү үчүн гана: «sodass» («ошондуктан») тексттен көрөсүз («Der Kurs ist online, sodass man überall lernen kann»); аны өзүңүз колдонуу азырынча керек эмес, бул 30-бөлүмдө болот. Бул жерде — falls, sobald, solange гана (жана A2 деңгээлиндеги wenn).',
      ),
    ],
    examples: [
      {
        de: 'Falls ich die Prüfung nicht bestehe, wiederhole ich sie im Herbst.',
        ru: 'Если я вдруг не сдам экзамен, я пересдам его осенью.',
        ky: 'Экзаменден өтпөй калсам, аны күзүндө кайра тапшырам.',
        focus: 'Falls … bestehe, wiederhole ich',
      },
      {
        de: 'Sobald ich das Abitur habe, bewerbe ich mich um einen Studienplatz.',
        ru: 'Как только у меня будет аттестат, я подам заявку на место в вузе.',
        ky: 'Abitur алышым менен мен окуу ордуна өтүнүч берем.',
        focus: 'Sobald … habe, bewerbe ich mich',
      },
      {
        de: 'Solange ich studiere, wohne ich bei meinen Eltern.',
        ru: 'Пока я учусь, я живу у родителей.',
        ky: 'Мен окуп жатканда ата-энемдин үйүндө жашайм.',
        focus: 'Solange … studiere, wohne ich',
      },
      {
        de: 'Ich rufe dich an, sobald der Kurs vorbei ist.',
        ru: 'Я позвоню тебе, как только закончится курс.',
        ky: 'Курс бүтөр замат мен сага чалам.',
        focus: 'Hauptsatz zuerst: …, sobald … ist',
      },
      {
        de: 'Falls es morgen regnet, bleiben wir zu Hause.',
        ru: 'Если завтра пойдёт дождь, мы останемся дома.',
        ky: 'Эгер эртең жамгыр жааса, биз үйдө калабыз.',
        focus: 'Falls … regnet, bleiben wir',
      },
    ],
    mistakes: [
      {
        wrong: 'Falls ich Zeit habe, ich gehe zum Kurs.',
        right: 'Falls ich Zeit habe, gehe ich zum Kurs.',
        note: l(
          'После придаточного с falls в главной части глагол стоит на первом месте: …, gehe ich …',
          'falls менен кошумча бөлүктөн кийин башкы бөлүктө этиш биринчи орунда турат: …, gehe ich …',
        ),
      },
      {
        wrong: 'Ich rufe dich an, sobald ich bin fertig.',
        right: 'Ich rufe dich an, sobald ich fertig bin.',
        note: l(
          'В придаточном предложении с sobald глагол уходит в самый конец: …, sobald ich fertig bin.',
          'sobald менен кошумча бөлүктө этиш эң аягына өтөт: …, sobald ich fertig bin.',
        ),
      },
      {
        wrong: 'Solange ich studiere, ich arbeite nur halbtags.',
        right: 'Solange ich studiere, arbeite ich nur halbtags.',
        note: l(
          'После придаточной части глагол главной части ставится на первое место: …, arbeite ich …',
          'Кошумча бөлүктөн кийин башкы бөлүктүн этиши биринчи орунда коюлат: …, arbeite ich …',
        ),
      },
      {
        wrong: 'Falls habe ich Zeit, komme ich zum Elternabend.',
        right: 'Falls ich Zeit habe, komme ich zum Elternabend.',
        note: l(
          'Подлежащее ich стоит сразу после falls, а спрягаемый глагол — в конце придаточной части.',
          'ich ээси falls сөзүнөн кийин дароо турат, ал эми жакка жараша өзгөргөн этиш кошумча бөлүктүн аягында.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Falls ein Platz frei wird, rufen wir Sie an.',
        ru: 'Если освободится место, мы вам позвоним.',
        ky: 'Эгер орун бошоп калса, биз сизге чалабыз.',
        focus: 'Falls … frei wird',
      },
      {
        de: 'Sobald die Anmeldung beginnt, schreibe ich mich ein.',
        ru: 'Как только начнётся запись, я запишусь.',
        ky: 'Жазылуу башталары менен мен жазылам.',
        focus: 'Sobald … beginnt',
      },
      {
        de: 'Solange der Kurs läuft, lerne ich jeden Abend.',
        ru: 'Пока идёт курс, я занимаюсь каждый вечер.',
        ky: 'Курс жүрүп жатканда мен күн сайын кечинде окуйм.',
        focus: 'Solange … läuft',
      },
    ],
    dialogue: [
      {
        speaker: 'Berater',
        text: 'Wann möchten Sie mit dem Studium anfangen?',
        ru: 'Когда вы хотите начать учёбу?',
        ky: 'Окууну качан баштагыңыз келет?',
      },
      {
        speaker: 'Student',
        text: 'Sobald ich die Bescheinigung habe, schreibe ich mich ein.',
        ru: 'Как только у меня будет справка, я запишусь.',
        ky: 'Далилдеме алышым менен мен жазылам.',
      },
      {
        speaker: 'Berater',
        text: 'Und falls Sie kein Stipendium bekommen?',
        ru: 'А если вы вдруг не получите стипендию?',
        ky: 'Ал эми эгер стипендия албай калсаңыз?',
      },
      {
        speaker: 'Student',
        text: 'Dann arbeite ich nebenbei, solange ich studiere.',
        ru: 'Тогда я буду подрабатывать, пока учусь.',
        ky: 'Анда мен окуп жатканда кошумча иштейм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своём плане учёбы: что вы сделаете, как только…, что — если вдруг…, и как будете жить, пока… Используйте sobald, falls, solange.',
        'Окуу планыңыз жөнүндө айтып бериңиз: … болору менен эмне кыласыз, эгер кокус … болсо эмне кыласыз жана … бою кандай жашайсыз. sobald, falls, solange колдонуңуз.',
      ),
      sample: 'Sobald ich mein Abitur habe, bewerbe ich mich. Falls ich ein Stipendium bekomme, studiere ich im Ausland. Solange ich studiere, arbeite ich nur wenig.',
      keywords: ['sobald', 'falls', 'solange'],
    },
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-verben-praepositionen',
    category: 'prepositions',
    level: 'B1',
    unit: 28,
    visual: 'prepositions',
    title: l(
      'Verben mit Präposition (sich vorbereiten auf, teilnehmen an …) и Worauf? / Darauf',
      'Предлогу бар этиштер (sich vorbereiten auf, teilnehmen an …) жана Worauf? / Darauf',
    ),
    summary: l(
      'Многие глаголы всегда идут с одним определённым предлогом, и этот предлог определяет падеж: «Ich bereite mich auf die Prüfung vor» (auf + Akkusativ), «Er nimmt an einem Kurs teil» (an + Dativ). Их надо учить как пару. В этом юните — закрытый список из 20 пар. Akkusativ: warten auf, sich freuen auf, denken an, sich interessieren für, sprechen über, sich freuen über (из A2) и sich bewerben um, sich ärgern über, sich kümmern um, sich entscheiden für, sich vorbereiten auf, hoffen auf, achten auf, sich erinnern an. Dativ: teilnehmen an, träumen von, abhängen von, sich beschäftigen mit, anfangen mit, aufhören mit. Для вещей вопрос строится с wo(r)-, ответ — с da(r)-: «Worauf wartest du?» — «Darauf warte ich schon lange». Перед гласной добавляется -r-: worauf, darauf; woran, daran.',
      'Көптөгөн этиштер дайыма бир аныкталган предлог менен жүрөт, ал предлог жалгоону аныктайт: «Ich bereite mich auf die Prüfung vor» (auf + Akkusativ), «Er nimmt an einem Kurs teil» (an + Dativ). Аларды жуп катары үйрөнүү керек. Бул бөлүмдө 20 жуптан турган жабык тизме бар. Akkusativ: warten auf, sich freuen auf, denken an, sich interessieren für, sprechen über, sich freuen über (A2 деңгээлинен) жана sich bewerben um, sich ärgern über, sich kümmern um, sich entscheiden für, sich vorbereiten auf, hoffen auf, achten auf, sich erinnern an. Dativ: teilnehmen an, träumen von, abhängen von, sich beschäftigen mit, anfangen mit, aufhören mit. Буюмдар үчүн суроо wo(r)- менен, жооп da(r)- менен түзүлөт: «Worauf wartest du?» — «Darauf warte ich schon lange». Үндүү тыбыштан мурун -r- кошулат: worauf, darauf; woran, daran.',
    ),
    discover: l(
      'Сравните: «Ich warte auf den Brief» и «Worauf wartest du?» — «Darauf warte ich». Какое слово заменило «auf den Brief»? Что добавилось, когда предлог начинается с гласной?',
      '«Ich warte auf den Brief» жана «Worauf wartest du?» — «Darauf warte ich» сүйлөмдөрүн салыштырыңыз. «auf den Brief» ордуна кайсы сөз келди? Предлог үндүү тыбыштан башталганда эмне кошулду?',
    ),
    why: l(
      'Без правильного предлога фраза звучит неверно: «Ich interessiere mich für Medizin», а не «an Medizin». На B1 вы обсуждаете учёбу, планы и школьные дела, и именно эти пары встречаются постоянно: «Ich bewerbe mich um einen Platz», «Worüber ärgerst du dich?».',
      'Туура предлогсуз сүйлөм туура эмес угулат: «Ich interessiere mich für Medizin», «an Medizin» эмес. B1 деңгээлинде сиз окууну, пландарды жана мектеп иштерин талкуулайсыз, дал ушул жуптар дайыма кездешет: «Ich bewerbe mich um einen Platz», «Worüber ärgerst du dich?».',
    ),
    when: [
      l(
        'Шаг 1 — учите пару целиком: глагол + предлог (+ падеж). «sich vorbereiten auf + Akk», «teilnehmen an + Dat». Возвратное местоимение — как в A2: «Ich freue mich auf den Kurs».',
        '1-кадам — жупту бүтүндөй үйрөнүңүз: этиш + предлог (+ жалгоо). «sich vorbereiten auf + Akk», «teilnehmen an + Dat». Кайтарым ат атооч A2 сыяктуу: «Ich freue mich auf den Kurs».',
      ),
      l(
        'Шаг 2 — падеж: смотрите в список. После auf, an, für, über, um в этих парах — Akkusativ («sich kümmern um die Anmeldung»). После an (при teilnehmen), von, mit — Dativ («an einem Kurs», «von einem Auslandsjahr», «mit dem Studium»).',
        '2-кадам — жалгоо: тизмеден караңыз. Бул жуптарда auf, an, für, über, um предлогдорунан кийин — Akkusativ («sich kümmern um die Anmeldung»). an (teilnehmen менен), von, mit предлогдорунан кийин — Dativ («an einem Kurs», «von einem Auslandsjahr», «mit dem Studium»).',
      ),
      l(
        'Шаг 3 — вопрос и ответ для вещей: wo(r) + предлог — вопрос, da(r) + предлог — ответ. «Wofür interessierst du dich?» — «Dafür interessiere ich mich», «Woran denkst du?» — «Daran denke ich oft». Для людей: «Auf wen wartest du?» — «Auf meine Lehrerin».',
        '3-кадам — буюмдар үчүн суроо жана жооп: wo(r) + предлог — суроо, da(r) + предлог — жооп. «Wofür interessierst du dich?» — «Dafür interessiere ich mich», «Woran denkst du?» — «Daran denke ich oft». Адамдар үчүн: «Auf wen wartest du?» — «Auf meine Lehrerin».',
      ),
      l(
        'Предлог mit образует womit (вопрос). Другие пары глагол + предлог выходят за рамки этого юнита; не нужно учить их все сразу. «Darum kümmere ich mich» (um → darum) — тоже такой случай.',
        'mit предлогу womit (суроо) түзөт. Башка этиш + предлог жуптары бул бөлүмдүн чегинен чыгат; баарын бирдей үйрөнүүнүн кереги жок. «Darum kümmere ich mich» (um → darum) — бул да ушундай учур.',
      ),
    ],
    examples: [
      {
        de: 'Ich bereite mich auf die Prüfung vor.',
        ru: 'Я готовлюсь к экзамену.',
        ky: 'Мен экзаменге даярданып жатам.',
        focus: 'sich vorbereiten auf + Akkusativ',
      },
      {
        de: 'Sie interessiert sich für Medizin.',
        ru: 'Она интересуется медициной.',
        ky: 'Ал медицинага кызыгат.',
        focus: 'sich interessieren für + Akkusativ (↻ A2)',
      },
      {
        de: 'Er nimmt an einem Sprachkurs teil.',
        ru: 'Он участвует в языковом курсе.',
        ky: 'Ал тил курсуна катышат.',
        focus: 'teilnehmen an + Dativ',
      },
      {
        de: 'Wir träumen von einem Auslandsjahr.',
        ru: 'Мы мечтаем о годе за границей.',
        ky: 'Биз чет өлкөдө бир жыл жөнүндө кыялданабыз.',
        focus: 'träumen von + Dativ',
      },
      {
        de: 'Worauf wartest du? – Darauf warte ich schon lange.',
        ru: 'Чего ты ждёшь? — Этого я жду уже давно.',
        ky: 'Сен эмнени күтүп жатасың? — Муну мен көптөн бери күтүп жатам.',
        focus: 'wo(r)- / da(r)-: worauf – darauf',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich interessiere mich an Medizin.',
        right: 'Ich interessiere mich für Medizin.',
        note: l(
          'Пара sich interessieren — für, а не an.',
          'sich interessieren жубу — für, an эмес.',
        ),
      },
      {
        wrong: 'Er nimmt an einen Kurs teil.',
        right: 'Er nimmt an einem Kurs teil.',
        note: l(
          'После an в паре teilnehmen стоит Dativ: an einem Kurs.',
          'teilnehmen жубунда an предлогунан кийин Dativ турат: an einem Kurs.',
        ),
      },
      {
        wrong: 'Wofür wartest du?',
        right: 'Worauf wartest du?',
        note: l(
          'Глагол warten идёт с auf, поэтому вопрос — worauf, а не wofür.',
          'warten этиши auf менен жүрөт, ошондуктан суроо — worauf, wofür эмес.',
        ),
      },
      {
        wrong: 'Ich hoffe darüber, dass der Brief kommt.',
        right: 'Ich hoffe darauf, dass der Brief kommt.',
        note: l(
          'Hoffen идёт с auf, поэтому da(r)-форма — darauf. Darüber подходит к парам с über (sich ärgern über).',
          'hoffen auf менен жүрөт, ошондуктан da(r)- формасы — darauf. darüber über менен жуптарга туура келет (sich ärgern über).',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich kümmere mich um die Anmeldung für den Kurs.',
        ru: 'Я занимаюсь записью на курс.',
        ky: 'Мен курска жазылууну иштеп жатам.',
        focus: 'sich kümmern um + Akkusativ',
      },
      {
        de: 'Achten Sie bitte auf die Anmeldefrist.',
        ru: 'Пожалуйста, обратите внимание на срок записи.',
        ky: 'Сураныч, жазылуу мөөнөтүнө көңүл буруңуз.',
        focus: 'achten auf + Akkusativ',
      },
      {
        de: 'Wovon träumst du? – Davon, im Ausland zu studieren.',
        ru: 'О чём ты мечтаешь? — О том, чтобы учиться за границей.',
        ky: 'Сен эмне жөнүндө кыялданасың? — Чет өлкөдө окуу жөнүндө.',
        focus: 'wovon – davon (+ zu-Infinitiv)',
      },
    ],
    dialogue: [
      {
        speaker: 'Lena',
        text: 'Worauf bereitest du dich gerade vor?',
        ru: 'К чему ты сейчас готовишься?',
        ky: 'Сен азыр эмнеге даярданып жатасың?',
      },
      {
        speaker: 'Tom',
        text: 'Auf die Prüfung im Juni. Dafür lerne ich jeden Abend.',
        ru: 'К экзамену в июне. Для этого я занимаюсь каждый вечер.',
        ky: 'Июндагы экзаменге. Ушул үчүн мен күн сайын кечинде окуйм.',
      },
      {
        speaker: 'Lena',
        text: 'Und woran denkst du danach?',
        ru: 'А о чём ты думаешь потом?',
        ky: 'Ал эми андан кийин эмне жөнүндө ойлонуп жатасың?',
      },
      {
        speaker: 'Tom',
        text: 'Daran denke ich noch nicht. Zuerst nehme ich an einem Sprachkurs teil.',
        ru: 'Об этом я пока не думаю. Сначала я участвую в языковом курсе.',
        ky: 'Бул жөнүндө мен азырынча ойлонбойм. Адегенде мен тил курсуна катышам.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своих учебных планах, используя пары глагол + предлог: «Ich bereite mich auf … vor», «Ich nehme an … teil», «Ich träume von …». Задайте один вопрос с wo(r)- и ответьте с da(r)-.',
        'Окуу пландарыңыз жөнүндө этиш + предлог жуптарын колдонуп айтып бериңиз: «Ich bereite mich auf … vor», «Ich nehme an … teil», «Ich träume von …». wo(r)- менен бир суроо бериңиз жана da(r)- менен жооп бериңиз.',
      ),
      sample: 'Ich bereite mich auf die Prüfung vor. Ich nehme an einem Kurs teil. Ich träume von einem Auslandsjahr. Worauf wartest du? Darauf warte ich schon lange.',
      keywords: ['bereite', 'nehme', 'träume', 'worauf'],
    },
    source: UNIT_28_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_28_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Er wird wohl noch im Kurs sein.',
    ru: 'Он, наверное, ещё на курсе.',
    ky: 'Ал, балким, дагы курста болуш керек.',
    word: 'wird',
    conceptId: 'b1-futur1-vermutungen',
    reason: l(
      'Wird + инфинитив (sein) — Futur I; вместе со словом wohl оно выражает предположение о настоящем («наверное»). Инфинитив стоит в самом конце.',
      'wird + инфинитив (sein) — Futur I; wohl сөзү менен бирге азыркы чак жөнүндө божомолду билдирет («балким»). Инфинитив эң аягында турат.',
    ),
    more: [
      {
        de: 'Sie wird wohl keine Zeit haben.',
        ru: 'У неё, наверное, нет времени.',
        ky: 'Анын, балким, убактысы жок.',
      },
      {
        de: 'Die Prüfung wird schwer sein.',
        ru: 'Экзамен будет трудным.',
        ky: 'Экзамен оор болот.',
      },
    ],
  },
  {
    sentence: 'Sobald ich das Abitur habe, bewerbe ich mich um einen Studienplatz.',
    ru: 'Как только у меня будет аттестат, я подам заявку на место в вузе.',
    ky: 'Abitur алышым менен мен окуу ордуна өтүнүч берем.',
    word: 'Sobald',
    conceptId: 'b1-falls-sobald-solange',
    reason: l(
      'Sobald = «как только»: второе действие следует сразу за первым. В придаточном глагол habe стоит в конце, в главной части глагол bewerbe идёт сразу после запятой.',
      'Sobald = «болору менен»: экинчи аракет биринчиден дароо кийин болот. Кошумча бөлүктө habe этиши аягында, башкы бөлүктө bewerbe этиши үтүрдөн дароо кийин турат.',
    ),
    more: [
      {
        de: 'Falls ich die Prüfung nicht bestehe, wiederhole ich sie.',
        ru: 'Если я не сдам экзамен, я пересдам его.',
        ky: 'Экзаменден өтпөй калсам, аны кайра тапшырам.',
      },
      {
        de: 'Solange ich studiere, wohne ich bei meinen Eltern.',
        ru: 'Пока я учусь, я живу у родителей.',
        ky: 'Мен окуп жатканда ата-энемдин үйүндө жашайм.',
      },
    ],
  },
  {
    sentence: 'Ich bereite mich auf die Prüfung vor.',
    ru: 'Я готовлюсь к экзамену.',
    ky: 'Мен экзаменге даярданып жатам.',
    word: 'auf',
    conceptId: 'b1-verben-praepositionen',
    reason: l(
      'Sich vorbereiten всегда идёт с auf, и после auf в этой паре стоит Akkusativ: auf die Prüfung. Отделяемая приставка vor- уходит в конец.',
      'sich vorbereiten дайыма auf менен жүрөт жана бул жупта auf сөзүнөн кийин Akkusativ турат: auf die Prüfung. Ажыраган vor- приставкасы аягына өтөт.',
    ),
    more: [
      {
        de: 'Er nimmt an einem Sprachkurs teil.',
        ru: 'Он участвует в языковом курсе.',
        ky: 'Ал тил курсуна катышат.',
      },
      {
        de: 'Wir träumen von einem Auslandsjahr.',
        ru: 'Мы мечтаем о годе за границей.',
        ky: 'Биз чет өлкөдө бир жыл жөнүндө кыялданабыз.',
      },
    ],
  },
  {
    sentence: 'Worauf wartest du? – Darauf warte ich schon lange.',
    ru: 'Чего ты ждёшь? — Этого я жду уже давно.',
    ky: 'Сен эмнени күтүп жатасың? — Муну мен көптөн бери күтүп жатам.',
    word: 'Darauf',
    conceptId: 'b1-verben-praepositionen',
    reason: l(
      'Warten идёт с auf. Для вещи вопрос — worauf (wo + r + auf), ответ — darauf (da + r + auf); -r- добавляется, потому что auf начинается с гласной.',
      'warten auf менен жүрөт. Буюм үчүн суроо — worauf (wo + r + auf), жооп — darauf (da + r + auf); auf үндүү тыбыштан башталгандыктан -r- кошулат.',
    ),
    more: [
      {
        de: 'Woran denkst du? – Daran denke ich oft.',
        ru: 'О чём ты думаешь? — Об этом я думаю часто.',
        ky: 'Сен эмне жөнүндө ойлонуп жатасың? — Бул жөнүндө мен көп ойлоном.',
      },
      {
        de: 'Wofür interessierst du dich? – Dafür interessiere ich mich sehr.',
        ru: 'Чем ты интересуешься? — Этим я очень интересуюсь.',
        ky: 'Сен эмнеге кызыгасың? — Буга мен абдан кызыгам.',
      },
    ],
  },
]
