import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_13_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 13 grammar (Stage 7D). Three concepts of the approved Stage 7B plan, each with a deliberately capped scope (see docs/authoring/A2_UNIT13_DESIGN_NOTES.md):
 *  1. `a2-adjektivendungen-indefinit` — the MAIN concept: adjective endings after ein-/kein-/mein-, singular, Nominativ and Akkusativ only.
 *  2. `a2-komparativ-superlativ` — regular -er / am -sten, umlaut, the three irregular series and `teurer`; `als` only (no `so … wie`), predicative use only.
 *  3. `a2-positionsverben` — stehen/stellen, liegen/legen, hängen with Wo? + Dativ and Wohin? + Akkusativ (A1 `wechsel` revisited), present tense only.
 * Not taught here: Dativ endings, endings without an article or after the definite article, plural endings, the attributive comparative
 * (die größere Wohnung), `so … wie`, `sich setzen/legen`, the imperative as a paradigm, dürfen / man (house rules are nominal notices).
 */
export const UNIT_13_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-adjektivendungen-indefinit',
    category: 'adjectives',
    level: 'A2',
    unit: 13,
    visual: 'articles',
    title: l(
      'Окончания прилагательных после ein-, kein-, mein- (Nominativ и Akkusativ)',
      'ein-, kein-, mein- сөздөрүнөн кийинки сын атоочтордун аякталышы (Nominativ жана Akkusativ)',
    ),
    summary: l(
      'Прилагательное перед существительным получает окончание. Оно зависит от рода существительного и от падежа. После ein-, kein- и притяжательных слов (mein, dein …) окончания такие: мужской род, Nominativ — -er (ein großer Balkon); мужской род, Akkusativ — -en (einen großen Balkon); средний род — -es (ein helles Zimmer); женский род — -e (eine moderne Küche). После глагола sein прилагательное не меняется: «Die Wohnung ist hell». В этом юните — только единственное число, только Nominativ и Akkusativ.',
      'Зат атоочтун алдындагы сын атооч аякталыш алат. Ал зат атоочтун жынысына жана Nominativ же Akkusativ формасына жараша өзгөрөт. ein-, kein- жана таандык сөздөрдөн (mein, dein …) кийин аякталыштар мындай: эркек жынс, Nominativ — -er (ein großer Balkon); эркек жынс, Akkusativ — -en (einen großen Balkon); орто жынс — -es (ein helles Zimmer); аял жынс — -e (eine moderne Küche). sein этишинен кийин сын атооч өзгөрбөйт: «Die Wohnung ist hell». Бул бөлүмдө жөн гана жекелик сан жана Nominativ менен Akkusativ каралат.',
    ),
    discover: l(
      'Сравните: «Die Wohnung ist hell» и «Ich suche eine helle Wohnung». Прилагательное одно и то же. Почему во втором предложении у него появилось окончание -e?',
      '«Die Wohnung ist hell» жана «Ich suche eine helle Wohnung» деген сүйлөмдөрдү салыштырыңыз. Сын атооч бир эле. Эмне үчүн экинчи сүйлөмдө ага -e аякталышы кошулду?',
    ),
    why: l(
      'Когда вы ищете квартиру или описываете её, прилагательное почти всегда стоит перед существительным: «ein helles Zimmer», «eine moderne Küche». Без окончания такая фраза звучит неправильно. В русском языке прилагательное тоже согласуется с существительным (светлая комната), поэтому сама идея вам знакома; нужно лишь запомнить немецкие окончания. Начните с подсказки: слово ein / eine / einen уже показывает род и падеж.',
      'Батир издегенде же аны сүрөттөгөндө сын атооч дээрлик ар дайым зат атоочтун алдында турат: «ein helles Zimmer», «eine moderne Küche». Аякталышсыз мындай сөз айкашы туура эмес угулат. Кыргыз тилинде сын атооч өзгөрбөйт, ал эми немис тилинде зат атоочтун алдында аякталыш алат, ошондуктан бул жаңы көндүм. Подсказкадан баштаңыз: ein / eine / einen деген сөз эле жынысты жана формасын көрсөтүп турат.',
    ),
    when: [
      l(
        'Мужской род (der): Nominativ — ein großer Balkon, Akkusativ — einen großen Balkon.',
        'Эркек жынс (der): Nominativ — ein großer Balkon, Akkusativ — einen großen Balkon.',
      ),
      l(
        'Средний род (das): Nominativ и Akkusativ одинаковы — ein helles Zimmer. Ich suche ein helles Zimmer.',
        'Орто жынс (das): Nominativ менен Akkusativ бирдей — ein helles Zimmer. Ich suche ein helles Zimmer.',
      ),
      l(
        'Женский род (die): Nominativ и Akkusativ одинаковы — eine moderne Küche. Ich suche eine moderne Küche.',
        'Аял жынс (die): Nominativ менен Akkusativ бирдей — eine moderne Küche. Ich suche eine moderne Küche.',
      ),
      l(
        'Отрицание kein- и притяжательные слова работают так же, как ein-: keine moderne Küche, meine kleine Wohnung, mein neuer Flur.',
        'Четтөө kein- жана таандык сөздөр ein- сыяктуу эле иштейт: keine moderne Küche, meine kleine Wohnung, mein neuer Flur.',
      ),
      l(
        'После sein окончания нет: Die Küche ist modern. Но перед существительным оно нужно: eine moderne Küche.',
        'sein этишинен кийин аякталыш жок: Die Küche ist modern. Ал эми зат атоочтун алдында ал керек: eine moderne Küche.',
      ),
      l(
        'Прилагательные на -el и -er теряют e: dunkel → eine dunkle Wohnung, teuer → eine teure Wohnung.',
        '-el жана -er менен бүткөн сын атоочтордо e түшүп калат: dunkel → eine dunkle Wohnung, teuer → eine teure Wohnung.',
      ),
    ],
    examples: [
      { de: 'Das ist ein großer Balkon.', ru: 'Это большой балкон.', ky: 'Бул чоң балкон.', focus: 'ein großer Balkon (der, Nominativ)' },
      { de: 'Wir brauchen einen kleinen Tisch.', ru: 'Нам нужен небольшой стол.', ky: 'Бизге кичинекей стол керек.', focus: 'einen kleinen Tisch (der, Akkusativ)' },
      { de: 'Die Wohnung hat ein helles Wohnzimmer.', ru: 'В квартире есть светлая гостиная.', ky: 'Батирде жарык конок бөлмө бар.', focus: 'ein helles Wohnzimmer (das)' },
      { de: 'Ich suche eine moderne Küche.', ru: 'Я ищу современную кухню.', ky: 'Мен заманбап ашкана издеп жатам.', focus: 'eine moderne Küche (die)' },
      { de: 'Das ist eine dunkle Wohnung.', ru: 'Это тёмная квартира.', ky: 'Бул караңгы батир.', focus: 'dunkel → dunkle' },
      { de: 'Das ist keine teure Wohnung.', ru: 'Это недорогая квартира.', ky: 'Бул кымбат эмес батир.', focus: 'teuer → teure' },
    ],
    mistakes: [
      {
        wrong: 'Ich habe einen große Balkon.',
        right: 'Ich habe einen großen Balkon.',
        note: l(
          'После einen (мужской род, Akkusativ) прилагательное получает -en, а не -e.',
          'einen (эркек жынс, Akkusativ) сөзүнөн кийин сын атоочко -e эмес, -en кошулат.',
        ),
      },
      {
        wrong: 'Das ist ein helle Zimmer.',
        right: 'Das ist ein helles Zimmer.',
        note: l(
          'Для слов среднего рода после ein нужно окончание -es: ein helles Zimmer.',
          'Орто жынстагы сөздөрдө ein сөзүнөн кийин -es аякталышы керек: ein helles Zimmer.',
        ),
      },
      {
        wrong: 'Die Wohnung ist helle.',
        right: 'Die Wohnung ist hell.',
        note: l(
          'После sein прилагательное не меняется и окончания не получает.',
          'sein этишинен кийин сын атооч өзгөрбөйт жана аякталыш албайт.',
        ),
      },
      {
        wrong: 'Das ist eine dunkele Wohnung.',
        right: 'Das ist eine dunkle Wohnung.',
        note: l(
          'У прилагательных на -el буква e перед окончанием выпадает: dunkel → dunkle.',
          '-el менен бүткөн сын атоочтордо аякталыштын алдындагы e түшүп калат: dunkel → dunkle.',
        ),
      },
    ],
    reallife: [
      { de: 'Ich suche eine helle Wohnung mit Balkon.', ru: 'Я ищу светлую квартиру с балконом.', ky: 'Мен балконду жарык батир издеп жатам.', focus: 'eine helle Wohnung' },
      { de: 'Haben Sie auch ein möbliertes Zimmer?', ru: 'У вас есть и комната с мебелью?', ky: 'Сизде эмеректүү бөлмө дагы барбы?', focus: 'ein möbliertes Zimmer' },
      { de: 'Das ist ein gemütliches Zimmer!', ru: 'Какая уютная комната!', ky: 'Кандай жайлуу бөлмө!', focus: 'ein gemütliches Zimmer' },
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Ich habe eine neue Wohnung!', ru: 'У меня новая квартира!', ky: 'Менин жаңы батирим бар!' },
      { speaker: 'Max', text: 'Toll! Wie ist die Wohnung?', ru: 'Здорово! Какая она?', ky: 'Сонун! Ал кандай?' },
      { speaker: 'Anna', text: 'Sie hat ein helles Wohnzimmer und einen großen Balkon.', ru: 'В ней светлая гостиная и большой балкон.', ky: 'Анда жарык конок бөлмө жана чоң балкон бар.' },
      { speaker: 'Max', text: 'Das ist eine schöne Wohnung!', ru: 'Это красивая квартира!', ky: 'Бул сонун батир экен!' },
    ],
    speakPrompt: {
      prompt: l(
        'Опишите свою комнату или квартиру двумя-тремя предложениями: что в ней есть и какая она.',
        'Бөлмөңүздү же батириңизди эки-үч сүйлөм менен сүрөттөп бериңиз: анда эмне бар жана ал кандай.',
      ),
      sample: 'Meine Wohnung hat ein helles Wohnzimmer und eine kleine Küche. Ich habe auch einen großen Balkon.',
      keywords: ['helles', 'kleine', 'großen'],
    },
    source: UNIT_13_SOURCE,
  },
  {
    id: 'a2-komparativ-superlativ',
    category: 'adjectives',
    level: 'A2',
    unit: 13,
    visual: 'none',
    title: l('Сравнение: -er … als и am -sten', 'Салыштыруу: -er … als жана am -sten'),
    summary: l(
      'Чтобы сравнить две квартиры, к прилагательному добавляют -er и ставят слово als: «Die Küche ist größer als das Bad». Для «самый, лучше всего» используют am … -sten: «Der Balkon ist am schönsten». У многих коротких прилагательных гласная получает умлаут: groß → größer → am größten, alt → älter → am ältesten. Несколько форм нужно выучить отдельно: gut → besser → am besten, viel → mehr → am meisten, gern → lieber → am liebsten. У teuer выпадает e: teurer. Здесь — только сравнение после sein; форму перед существительным (die größere Wohnung) мы пока не используем.',
      'Эки батирди салыштыруу үчүн сын атоочко -er кошулуп, als сөзү коюлат: «Die Küche ist größer als das Bad». «Эң …» дегенди айтуу үчүн am … -sten колдонулат: «Der Balkon ist am schönsten». Кыска сын атоочтордун көпчүлүгүндө үндүү умлаут алат: groß → größer → am größten, alt → älter → am ältesten. Бир нече форманы өзүнчө жаттоо керек: gut → besser → am besten, viel → mehr → am meisten, gern → lieber → am liebsten. teuer сөзүндө e түшүп калат: teurer. Бул жерде sein этишинен кийинки салыштыруу гана каралат; зат атоочтун алдындагы форма (die größere Wohnung) азырынча колдонулбайт.',
    ),
    discover: l(
      'Сравните: «Die Küche ist klein» и «Das Bad ist kleiner als die Küche». Что добавилось к прилагательному и какое слово стоит после него?',
      '«Die Küche ist klein» жана «Das Bad ist kleiner als die Küche» деген сүйлөмдөрдү салыштырыңыз. Сын атоочко эмне кошулду жана андан кийин кайсы сөз турат?',
    ),
    why: l(
      'При выборе жилья вы всё время сравниваете: цену, размер, расстояние. «Дешевле», «больше», «лучше всего» — самые полезные слова при выборе квартиры. В русском сравнение строится на -ее / -ше и слове «чем»; в немецком почти всегда добавляется -er, а «чем» передаёт слово als (не wie).',
      'Батир тандаганда дайыма салыштырасыз: баасын, көлөмүн, алыс-жакындыгын. «Арзаныраак», «чоңураак», «эң жакшы» — батир тандоодогу эң пайдалуу сөздөр. Кыргыз тилинде салыштырууда -раак мүчөсү колдонулат (чоңураак), ал эми немис тилинде көбүнчө -er кошулат, ал эми «…дан» маанисин als берет (wie эмес).',
    ),
    when: [
      l(
        'Сравнение двух предметов: Komparativ + als. Die Wohnung in der Stadt ist teurer als die Wohnung auf dem Land.',
        'Эки нерсени салыштыруу: Komparativ + als. Die Wohnung in der Stadt ist teurer als die Wohnung auf dem Land.',
      ),
      l(
        'Самый, лучше всего: am + форма на -sten. Das Wohnzimmer ist am gemütlichsten.',
        'Эң, баарынан: am + -sten менен бүткөн форма. Das Wohnzimmer ist am gemütlichsten.',
      ),
      l(
        'Умлаут у коротких прилагательных: groß – größer – am größten; alt – älter – am ältesten.',
        'Кыска сын атоочтордо умлаут: groß – größer – am größten; alt – älter – am ältesten.',
      ),
      l(
        'Особые формы: gut – besser – am besten; viel – mehr – am meisten; gern – lieber – am liebsten. Ich wohne gern in der Stadt, aber ich wohne lieber auf dem Land.',
        'Өзгөчө формалар: gut – besser – am besten; viel – mehr – am meisten; gern – lieber – am liebsten. Ich wohne gern in der Stadt, aber ich wohne lieber auf dem Land.',
      ),
    ],
    examples: [
      { de: 'Die Küche ist größer als das Bad.', ru: 'Кухня больше, чем ванная.', ky: 'Ашкана ванна бөлмөсүнөн чоңураак.', focus: 'größer als' },
      { de: 'Meine Wohnung ist heller als deine Wohnung.', ru: 'Моя квартира светлее твоей.', ky: 'Менин батирим сенин батириңден жарыгыраак.', focus: 'heller als' },
      { de: 'Die Wohnung in der Stadt ist teurer als die Wohnung auf dem Land.', ru: 'Квартира в городе дороже, чем квартира в деревне.', ky: 'Шаардагы батир айылдагы батирден кымбатыраак.', focus: 'teuer → teurer' },
      { de: 'Der Balkon ist am schönsten.', ru: 'Балкон — самое красивое место.', ky: 'Балкон эң сонун жер.', focus: 'am schönsten' },
      { de: 'Das Bett ist gut, aber das Sofa ist besser.', ru: 'Кровать хорошая, но диван лучше.', ky: 'Керебет жакшы, бирок диван андан да жакшы.', focus: 'gut → besser' },
      { de: 'Ich wohne gern in der Stadt, aber ich wohne lieber auf dem Land.', ru: 'Мне нравится жить в городе, но в деревне я люблю жить больше.', ky: 'Мен шаарда жашаганды жакшы көрөм, бирок айылда жашаганды көбүрөөк жакшы көрөм.', focus: 'gern → lieber' },
    ],
    mistakes: [
      {
        wrong: 'Das Bad ist größer wie die Küche.',
        right: 'Das Bad ist größer als die Küche.',
        note: l(
          'После Komparativ «чем» передаёт als, а не wie.',
          'Komparativден кийин «…дан» маанисин als берет, wie эмес.',
        ),
      },
      {
        wrong: 'Die Wohnung ist mehr groß.',
        right: 'Die Wohnung ist größer.',
        note: l(
          'Слова mehr перед прилагательным не ставят: к прилагательному просто добавляют -er (и умлаут, если нужно).',
          'Сын атоочтун алдына mehr сөзү коюлбайт: сын атоочко жөн эле -er кошулат (керек болсо умлаут менен).',
        ),
      },
      {
        wrong: 'Das Sofa ist guter als das Bett.',
        right: 'Das Sofa ist besser als das Bett.',
        note: l(
          'У gut особая форма: gut – besser – am besten. Её нужно выучить наизусть.',
          'gut сөзүнүн өзгөчө формасы бар: gut – besser – am besten. Аны жаттап алуу керек.',
        ),
      },
      {
        wrong: 'Die Wohnung ist teuerer.',
        right: 'Die Wohnung ist teurer.',
        note: l(
          'У прилагательных на -er выпадает e: teuer → teurer.',
          '-er менен бүткөн сын атоочтордо e түшүп калат: teuer → teurer.',
        ),
      },
    ],
    reallife: [
      { de: 'Ist diese Wohnung größer als Ihre alte Wohnung?', ru: 'Эта квартира больше вашей прежней?', ky: 'Бул батир сиздин мурунку батириңизден чоңбу?', focus: 'größer als' },
      { de: 'Welche Wohnung gefällt dir am besten?', ru: 'Какая квартира нравится тебе больше всего?', ky: 'Кайсы батир сага эң жакшы жагат?', focus: 'am besten' },
      { de: 'Das Zimmer ist kleiner, aber es ist günstiger.', ru: 'Комната меньше, но дешевле.', ky: 'Бөлмө кичирээк, бирок арзаныраак.', focus: 'kleiner, günstiger' },
    ],
    dialogue: [
      { speaker: 'Tim', text: 'Welche Wohnung ist besser, A oder B?', ru: 'Какая квартира лучше — A или B?', ky: 'Кайсы батир жакшыраак — A же B?' },
      { speaker: 'Lena', text: 'Wohnung B ist größer als Wohnung A.', ru: 'Квартира B больше, чем квартира A.', ky: 'B батири A батиринен чоңураак.' },
      { speaker: 'Tim', text: 'Aber sie ist auch teurer, oder?', ru: 'Но она и дороже, да?', ky: 'Бирок ал кымбатыраак да го, туурабы?' },
      { speaker: 'Lena', text: 'Ja, aber das Wohnzimmer ist dort am schönsten.', ru: 'Да, но гостиная там самая красивая.', ky: 'Ооба, бирок ал жерде конок бөлмө эң сонун.' },
    ],
    speakPrompt: {
      prompt: l(
        'Сравните две квартиры или две комнаты: какая больше, светлее, дешевле и какая нравится вам больше всего.',
        'Эки батирди же эки бөлмөнү салыштырыңыз: кайсынысы чоңураак, жарыгыраак, арзаныраак жана кайсынысы эң жакшы жагат.',
      ),
      sample: 'Wohnung A ist größer als Wohnung B, aber sie ist teurer. Das Wohnzimmer gefällt mir am besten.',
      keywords: ['größer', 'als', 'teurer', 'am besten'],
    },
    source: UNIT_13_SOURCE,
  },
  {
    id: 'a2-positionsverben',
    category: 'verbs',
    level: 'A2',
    unit: 13,
    visual: 'prepositions',
    title: l(
      'Глаголы положения: stehen / stellen, liegen / legen, hängen',
      'Орунду билгилөөчү этиштер: stehen / stellen, liegen / legen, hängen',
    ),
    summary: l(
      'На вопрос «Wo?» (где?) отвечает глагол положения и Dativ: stehen (стоит), liegen (лежит), hängen (висит): «Das Regal steht an der Wand». На вопрос «Wohin?» (куда?) отвечает глагол действия и Akkusativ: stellen (ставить), legen (класть), hängen (вешать): «Ich stelle das Regal an die Wand». Пары: stehen – stellen (предмет стоит вертикально), liegen – legen (предмет лежит плашмя), hängen – hängen (висеть и вешать; в настоящем времени форма одна). Предлоги те же, что в A1: an, auf, in, neben, über, unter, vor, zwischen, hinter.',
      '«Wo?» (кайда?) деген суроого абалды билдирген этиш жана Dativ жооп берет: stehen (тик турат), liegen (жатат), hängen (илинип турат): «Das Regal steht an der Wand». «Wohin?» (кайда карай?) деген суроого аракетти билдирген этиш жана Akkusativ жооп берет: stellen (тик коюу), legen (жаткырып коюу), hängen (илүү): «Ich stelle das Regal an die Wand». Жуптар: stehen – stellen (нерсе тик турат), liegen – legen (нерсе жатат), hängen – hängen (илинип туруу жана илүү; азыркы чакта форма бир). Предлогдор A1 деңгээлиндегидей: an, auf, in, neben, über, unter, vor, zwischen, hinter.',
    ),
    discover: l(
      'Сравните: «Das Buch liegt auf dem Tisch» и «Ich lege das Buch auf den Tisch». Какое предложение отвечает на вопрос «где?», а какое — на вопрос «куда?» Что происходит с артиклем?',
      '«Das Buch liegt auf dem Tisch» жана «Ich lege das Buch auf den Tisch» деген сүйлөмдөрдү салыштырыңыз. Кайсы сүйлөм «кайда?» деген суроого, кайсынысы «кайда карай?» деген суроого жооп берет? Артикль эмне болот?',
    ),
    why: l(
      'Когда вы расставляете мебель или говорите грузчикам, куда что поставить, вы постоянно используете «где» и «куда». Если выбрать не тот глагол, вас, скорее всего, поймут, но фраза прозвучит неверно. Вы уже знаете из A1 предлоги с Dativ и Akkusativ; здесь к ним добавляются точные глаголы.',
      'Эмерек коюп жатканда же жүк ташуучуларга эмнени кайда коюу керектигин айтканда «кайда» жана «кайда карай» деген суроолор дайыма керек болот. Туура эмес этишти тандасаңыз, сизди түшүнүшү мүмкүн, бирок сүйлөм туура эмес угулат. Dativ жана Akkusativ талап кылган предлогдорду A1 деңгээлинен билесиз; бул жерде аларга так этиштер кошулат.',
    ),
    when: [
      l(
        'Wo? Положение: stehen, liegen, hängen + Dativ. Das Sofa steht an der Wand. Die Zeitung liegt auf dem Tisch. Das Bild hängt über dem Sofa.',
        'Wo? Абал: stehen, liegen, hängen + Dativ. Das Sofa steht an der Wand. Die Zeitung liegt auf dem Tisch. Das Bild hängt über dem Sofa.',
      ),
      l(
        'Wohin? Действие: stellen, legen, hängen + Akkusativ. Ich stelle das Sofa an die Wand. Ich lege die Zeitung auf den Tisch. Ich hänge das Bild über das Sofa.',
        'Wohin? Аракет: stellen, legen, hängen + Akkusativ. Ich stelle das Sofa an die Wand. Ich lege die Zeitung auf den Tisch. Ich hänge das Bild über das Sofa.',
      ),
      l(
        'Выбор глагола зависит от положения предмета: высокий предмет или предмет на ножках — stehen / stellen; предмет плашмя — liegen / legen.',
        'Этишти нерсенин абалы аныктайт: бийик нерсе же буттуу нерсе — stehen / stellen; жатып турган нерсе — liegen / legen.',
      ),
      l(
        'Слитные формы из A1: an das → ans, in das → ins, in dem → im, an dem → am.',
        'A1 деңгээлинен белгилүү кыскарган формалар: an das → ans, in das → ins, in dem → im, an dem → am.',
      ),
    ],
    examples: [
      { de: 'Das Regal steht neben dem Fenster.', ru: 'Полка стоит рядом с окном.', ky: 'Текче терезенин жанында турат.', focus: 'steht + Dativ (Wo?)' },
      { de: 'Ich stelle das Regal neben das Fenster.', ru: 'Я ставлю полку рядом с окном.', ky: 'Мен текчени терезенин жанына тик коём.', focus: 'stelle + Akkusativ (Wohin?)' },
      { de: 'Die Zeitung liegt auf dem Sofa.', ru: 'Газета лежит на диване.', ky: 'Гезит диванда жатат.', focus: 'liegt + Dativ' },
      { de: 'Ich lege die Zeitung auf das Sofa.', ru: 'Я кладу газету на диван.', ky: 'Мен гезитти диванга жаткырып коём.', focus: 'lege + Akkusativ' },
      { de: 'Das Bild hängt an der Wand.', ru: 'Картина висит на стене.', ky: 'Сүрөт дубалда илинип турат.', focus: 'hängt + Dativ' },
      { de: 'Ich hänge das Bild an die Wand.', ru: 'Я вешаю картину на стену.', ky: 'Мен сүрөттү дубалга илем.', focus: 'hänge + Akkusativ' },
    ],
    mistakes: [
      {
        wrong: 'Das Buch legt auf dem Tisch.',
        right: 'Das Buch liegt auf dem Tisch.',
        note: l(
          'Книга ничего не делает — она находится на месте: liegen, а не legen.',
          'Китеп эч нерсе кылбайт — ал бир жерде жатат: legen эмес, liegen.',
        ),
      },
      {
        wrong: 'Ich stehe das Regal an die Wand.',
        right: 'Ich stelle das Regal an die Wand.',
        note: l(
          'Когда вы сами ставите предмет, нужен stellen. Stehen значит «находиться стоя».',
          'Нерсени өзүңүз койгондо stellen керек. Stehen «тик турууну» билдирет.',
        ),
      },
      {
        wrong: 'Das Bild hängt an die Wand.',
        right: 'Das Bild hängt an der Wand.',
        note: l(
          'Вопрос «Wo?» требует Dativ: an der Wand.',
          '«Wo?» деген суроо Dativ талап кылат: an der Wand.',
        ),
      },
      {
        wrong: 'Ich lege das Buch auf dem Tisch.',
        right: 'Ich lege das Buch auf den Tisch.',
        note: l(
          'Вопрос «Wohin?» требует Akkusativ: auf den Tisch.',
          '«Wohin?» деген суроо Akkusativ талап кылат: auf den Tisch.',
        ),
      },
    ],
    reallife: [
      { de: 'Wohin stellen wir das Sofa?', ru: 'Куда мы поставим диван?', ky: 'Диванды кайсы жакка коёбуз?', focus: 'Wohin + stellen' },
      { de: 'Wo liegt der Schlüssel?', ru: 'Где лежит ключ?', ky: 'Ачкыч кайда жатат?', focus: 'Wo + liegen' },
      { de: 'Das Bild hängt im Flur.', ru: 'Картина висит в коридоре.', ky: 'Сүрөт коридордо илинип турат.', focus: 'im Flur' },
    ],
    dialogue: [
      { speaker: 'Max', text: 'Wohin stelle ich das Regal?', ru: 'Куда мне поставить полку?', ky: 'Текчени кайсы жакка коём?' },
      { speaker: 'Anna', text: 'Das Regal kommt an die Wand neben die Tür.', ru: 'Полка встанет к стене рядом с дверью.', ky: 'Текче эшиктин жанындагы дубалга коюлат.' },
      { speaker: 'Max', text: 'Gut. Und wo sind die Bücher?', ru: 'Хорошо. А где книги?', ky: 'Макул. Ал эми китептер кайда?' },
      { speaker: 'Anna', text: 'Die Bücher liegen noch im Flur. Ich lege sie später ins Regal.', ru: 'Книги ещё лежат в коридоре. Позже я положу их на полку.', ky: 'Китептер азырынча коридордо жатат. Мен аларды кийин текчеге жаткырып коём.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что стоит, лежит и висит в вашей комнате.',
        'Бөлмөңүздө эмне турганын, эмне жатканын жана эмне илинип турганын айтып бериңиз.',
      ),
      sample: 'Das Bett steht an der Wand. Das Bild hängt über dem Bett. Die Bücher liegen auf dem Tisch.',
      keywords: ['steht', 'hängt', 'liegen'],
    },
    source: UNIT_13_SOURCE,
  },
]

/** "Why?" notes of Unit 13. */
export const UNIT_13_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Ich suche einen großen Balkon.',
    ru: 'Я ищу большой балкон.',
    ky: 'Мен чоң балкон издеп жатам.',
    word: 'großen',
    conceptId: 'a2-adjektivendungen-indefinit',
    reason: l(
      'Balkon — слово мужского рода (der Balkon). После einen (мужской род, Akkusativ) прилагательное получает окончание -en: einen großen Balkon.',
      'Balkon — эркек жынстагы сөз (der Balkon). einen (эркек жынс, Akkusativ) сөзүнөн кийин сын атоочко -en аякталышы кошулат: einen großen Balkon.',
    ),
    more: [
      { de: 'Das ist ein großer Balkon.', ru: 'Это большой балкон.', ky: 'Бул чоң балкон.' },
      { de: 'Wir brauchen einen kleinen Tisch.', ru: 'Нам нужен небольшой стол.', ky: 'Бизге кичинекей стол керек.' },
    ],
  },
  {
    sentence: 'Die Wohnung hat ein helles Wohnzimmer.',
    ru: 'В квартире есть светлая гостиная.',
    ky: 'Батирде жарык конок бөлмө бар.',
    word: 'helles',
    conceptId: 'a2-adjektivendungen-indefinit',
    reason: l(
      'Wohnzimmer — средний род (das). После ein у слов среднего рода окончание -es; в Nominativ и в Akkusativ оно одинаковое.',
      'Wohnzimmer — орто жынстагы сөз (das). ein сөзүнөн кийин орто жынстагы сөздөрдө -es аякталышы турат; Nominativде да, Akkusativде да ал бирдей.',
    ),
    more: [
      { de: 'Das ist ein gemütliches Zimmer.', ru: 'Это уютная комната.', ky: 'Бул жайлуу бөлмө.' },
      { de: 'Ich suche ein möbliertes Zimmer.', ru: 'Я ищу комнату с мебелью.', ky: 'Мен эмеректүү бөлмө издеп жатам.' },
    ],
  },
  {
    sentence: 'Die Küche ist größer als das Bad.',
    ru: 'Кухня больше, чем ванная.',
    ky: 'Ашкана ванна бөлмөсүнөн чоңураак.',
    word: 'größer',
    conceptId: 'a2-komparativ-superlativ',
    reason: l(
      'Для сравнения к прилагательному добавлено -er, а у groß появился умлаут (groß → größer). После сравнения стоит als: «größer als das Bad».',
      'Салыштыруу үчүн сын атоочко -er кошулган, groß сөзүндө умлаут пайда болгон (groß → größer). Салыштыруудан кийин als турат: «größer als das Bad».',
    ),
    more: [
      { de: 'Meine Wohnung ist heller als deine Wohnung.', ru: 'Моя квартира светлее твоей.', ky: 'Менин батирим сенин батириңден жарыгыраак.' },
      { de: 'Das Bett ist gut, aber das Sofa ist besser.', ru: 'Кровать хорошая, но диван лучше.', ky: 'Керебет жакшы, бирок диван андан да жакшы.' },
    ],
  },
  {
    sentence: 'Das Bild hängt an der Wand.',
    ru: 'Картина висит на стене.',
    ky: 'Сүрөт дубалда илинип турат.',
    word: 'der',
    conceptId: 'a2-positionsverben',
    reason: l(
      'Картина уже висит на своём месте: это вопрос «Wo?». После an в таком случае стоит Dativ: an der Wand (die Wand → der Wand).',
      'Сүрөт өз ордунда илинип турат: бул «Wo?» деген суроо. Мындай учурда an предлогунан кийин Dativ турат: an der Wand (die Wand → der Wand).',
    ),
    more: [
      { de: 'Die Zeitung liegt auf dem Sofa.', ru: 'Газета лежит на диване.', ky: 'Гезит диванда жатат.' },
      { de: 'Das Regal steht neben dem Fenster.', ru: 'Полка стоит рядом с окном.', ky: 'Текче терезенин жанында турат.' },
    ],
  },
  {
    sentence: 'Ich stelle das Regal an die Wand.',
    ru: 'Я ставлю полку к стене.',
    ky: 'Мен текчени дубалга тик коём.',
    word: 'die',
    conceptId: 'a2-positionsverben',
    reason: l(
      'Здесь есть действие и направление: вы ставите полку куда-то (вопрос «Wohin?»). Поэтому глагол stellen и Akkusativ: an die Wand.',
      'Бул жерде аракет жана багыт бар: сиз текчени бир жакка коюп жатасыз («Wohin?» деген суроо). Ошондуктан stellen этиши жана Akkusativ: an die Wand.',
    ),
    more: [
      { de: 'Ich lege die Zeitung auf das Sofa.', ru: 'Я кладу газету на диван.', ky: 'Мен гезитти диванга жаткырып коём.' },
      { de: 'Ich hänge das Bild an die Wand.', ru: 'Я вешаю картину на стену.', ky: 'Мен сүрөттү дубалга илем.' },
    ],
  },
]
