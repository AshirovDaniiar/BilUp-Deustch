import type { Derived } from './derived-01'

/** Units 321 and 323 — ENRICHED lessons (see derived-01.ts). */
export const DERIVED_02: Derived[] = [
  {
    from: 'b1-konjunktiv2-wuensche-irreal',
    spec: {
      n: 21,
      slug: 'konjunktiv-2-wuensche-irreale-situationen',
      topic: 'Konjunktiv II: Wünsche und irreale Situationen',
      title: ['Konjunktiv II — желания и нереальные ситуации', 'Konjunktiv II — каалоолор жана чындыкка жатпаган кырдаалдар'],
      ex: [
        ['Ich wäre froh, wenn ich einen ruhigeren Job hätte.', 'Я был бы рад, если бы у меня была более спокойная работа.', 'Тынчыраак жумушум болсо, мен кубанмакмын.', 'wäre … wenn … hätte'],
        ['Wenn ich Zeit hätte, würde ich öfter reisen.', 'Если бы у меня было время, я бы чаще путешествовал.', 'Убактым болсо, мен көбүрөөк саякаттамакмын.', 'wenn + hätte → würde'],
        ['Wenn er nicht so müde wäre, könnte er mitkommen.', 'Если бы он не был таким уставшим, он мог бы пойти с нами.', 'Ал мынчалык чарчабаган болсо, биз менен кошо бара алмак.', 'wäre / könnte'],
      ],
      tasks: [
        ['f', 'Wenn ich reich ___, würde ich um die Welt reisen.', 'Если бы я был богат, я бы объехал мир.', 'Мен бай болсом, дүйнөнү кыдырмакмын.', 'wäre', ['bin', 'war'], ['Нереальное условие: Konjunktiv II от sein — wäre.', 'Чындыкка жатпаган шарт: sein этишинин Konjunktiv IIси — wäre.']],
        ['f', 'Ich wünschte, ich ___ mehr Zeit.', 'Мне бы хотелось иметь больше времени.', 'Убактым көбүрөөк болсо экен.', 'hätte', ['habe', 'hatte'], ['Желание: Konjunktiv II от haben — hätte.', 'Каалоо: haben этишинин Konjunktiv IIси — hätte.']],
        ['c', 'Welcher Satz drückt einen Wunsch aus?', 'Какое предложение выражает желание?', 'Кайсы сүйлөм каалоону билдирет?', 'Ich wünschte, ich könnte fliegen.', ['Ich kann fliegen.', 'Ich konnte fliegen.'], ['«Ich wünschte, ich könnte …» — желание, которое нереально.', '«Ich wünschte, ich könnte …» — чындыкка жатпаган каалоо.']],
        ['o', 'Wenn ich mehr Zeit hätte, würde ich reisen.', 'Если бы у меня было больше времени, я бы путешествовал.', 'Убактым көбүрөөк болсо, мен саякаттамакмын.', ['Придаточное с wenn первое — главное начинается с würde ich.', 'wenn менен кошумча биринчи — башкысы würde ichтен башталат.']],
      ],
    },
  },
  {
    from: 'b1-wiedergeben-indikativ',
    spec: {
      n: 23,
      slug: 'indirekte-rede-grundlagen',
      topic: 'Indirekte Rede: Grundlagen',
      title: ['Indirekte Rede — передать чужие слова (dass, ob, W-Fragen)', 'Indirekte Rede — башка бирөөнүн сөзүн жеткирүү (dass, ob, W-суроолор)'],
      ex: [
        ['Der Lehrer sagt, dass der Test morgen stattfindet.', 'Учитель говорит, что тест состоится завтра.', 'Мугалим тест эртең болот деп айтат.', 'sagt, dass …'],
        ['Sie hat gefragt, wann der Zug abfährt.', 'Она спросила, когда отправляется поезд.', 'Ал поезд качан жөнөөрүн сурады.', 'W-Frage → wann (глагол в конце)'],
        ['Laut Wetterbericht wird es morgen regnen.', 'По прогнозу погоды завтра будет дождь.', 'Аба ырайы божомолу боюнча эртең жамгыр жаайт.', 'laut + Dativ'],
      ],
      tasks: [
        ['f', 'Sie fragte, ___ ich Zeit habe.', 'Она спросила, есть ли у меня время.', 'Ал менин убактым бар-жогун сурады.', 'ob', ['dass', 'wenn'], ['Вопрос «да/нет» без вопросительного слова → ob.', '«Ооба/жок» суроосу суроо сөзүсүз → ob.']],
        ['f', 'Er sagt, dass das Konzert um acht ___.', 'Он говорит, что концерт начинается в восемь.', 'Ал концерт саат сегизде башталат деп айтат.', 'beginnt', ['beginnen', 'begonnen'], ['В придаточном с dass глагол стоит в конце: beginnt.', 'dass менен кошумча бөлүктө этиш аягында: beginnt.']],
        ['c', 'Welcher Satz ist richtig?', 'Какое предложение правильное?', 'Кайсы сүйлөм туура?', 'Lena sagt, dass sie müde ist.', ['Lena sagt, dass ich müde bin.', 'Lena sagt, dass sie ist müde.'], ['Местоимение меняется (ich → sie), глагол — в конце.', 'Ат атооч өзгөрөт (ich → sie), этиш — аягында.']],
        ['c', 'Was steht nach „fragen“, wenn die direkte Frage kein Fragewort hat?', 'Что стоит после «fragen», если в прямом вопросе нет вопросительного слова?', 'Түз суроодо суроо сөзү жок болсо, «fragen»дан кийин эмне турат?', 'ob', ['dass', 'wann'], ['Вопрос «да/нет» → ob; вопрос с вопросительным словом сохраняет его.', '«Ооба/жок» суроосу → ob; суроо сөзү бар суроо аны сактайт.']],
        ['o', 'Er fragte, wann das Update kommt.', 'Он спросил, когда придёт обновление.', 'Ал жаңыртуу качан келерин сурады.', ['Вопросительное слово wann сохраняется, глагол kommt — в конце.', 'wann суроо сөзү сакталат, kommt этиши — аягында.']],
      ],
    },
  },
]
