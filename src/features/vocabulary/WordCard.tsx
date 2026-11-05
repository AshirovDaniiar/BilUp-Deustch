import { useState } from 'react'
import { useApp, useAttempt } from '../../app/store'
import { Button, Chip } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import type { VocabularyItem } from '../../data/types'
import { caseForms, vocabById } from '../../data/vocabulary'
import { stageOf } from '../../services/srs'
import { normalize } from '../../utils/text'
import { SpeakInput } from '../speaking/SpeakInput'

const stageTone = { new: 'neutral', learning: 'yellow', familiar: 'blue', strong: 'violet', mastered: 'green' } as const

/** Rich vocabulary card: article, forms, meaning in RU/KY, audio, example, relations, actions. */
export function WordCard({ item, onPractice, onOpen }: { item: VocabularyItem; onPractice?: () => void; onOpen?: (id: string) => void }) {
  const { state, actions, t, lang } = useApp()
  const attempt = useAttempt()
  const [heard, setHeard] = useState<{ text: string; ok: boolean } | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const forms = caseForms(item)
  const saved = state.saved.includes(item.id)
  const stage = stageOf(state.mastery[item.id])
  const tone = item.article ? `art--${item.article}` : 'art--none'

  const onHeard = (text: string) => {
    const ok = normalize(text).includes(normalize(item.de))
    setHeard({ text, ok })
    attempt.finish({ activityId: `word-practice:${item.id}`, kind: 'word-practice', items: [{ itemRef: `word:${item.id}`, outcome: ok ? 'correct' : 'incorrect' }], evidence: 'heuristic' })
    attempt.renew()
  }

  return (
    <article className="wordcard">
      <div className="wordcard__head">
        <span className={`artbadge ${tone}`}>{item.article ?? (item.pos === 'verb' ? 'Verb' : item.pos === 'adj' ? 'Adj.' : '•')}</span>
        <div className="grow">
          <h3 className="wordcard__word break">{item.de}</h3>
          {item.plural && <div className="muted small">{t('plural')}: <b className="de">die {item.plural}</b></div>}
        </div>
        <Chip tone={stageTone[stage]}>{t(`stage_${stage}` as 'stage_new')}</Chip>
      </div>

      <div className="wordcard__meaning">
        <div>
          <span className="eyebrow">{t('meaning')}</span>
          <div className="break">{item.ru} <span className="muted">/ {item.ky}</span></div>
        </div>
        <div className="wordcard__audio">
          <SpeakButton text={item.article ? `${item.article} ${item.de}` : item.de} label={item.de} />
        </div>
      </div>

      {forms && (
        <div className="wordcard__forms">
          <span className="eyebrow">{t('grammarForms')}</span>
          <div className="formrow">
            <span><small>Nom.</small><b className="de">{forms.nom}</b></span>
            <span><small>Akk.</small><b className="de">{forms.akk}</b></span>
            <span><small>Dat.</small><b className="de">{forms.dat}</b></span>
          </div>
        </div>
      )}

      <div className="wordcard__example">
        <span className="eyebrow">{t('example')}</span>
        <div className="de break">{item.example} <SpeakButton text={item.example} small /></div>
        <div className="muted small break">{item.exampleRu}</div>
      </div>

      {item.related.length > 0 && (
        <div>
          <span className="eyebrow">{t('related')}</span>
          <div className="row" style={{ marginTop: 6 }}>
            {item.related.map(id => {
              const r = vocabById.get(id)
              return r ? (
                <Chip key={id} tone="blue" onClick={onOpen ? () => onOpen(id) : undefined}>
                  {r.article ? `${r.article} ` : ''}{r.de}
                </Chip>
              ) : null
            })}
          </div>
        </div>
      )}

      <div className="wordcard__actions">
        <SpeakButton text={item.de} label={t('listen')} />
        <Button variant="soft" size="sm" onClick={() => setSpeaking(s => !s)}>🎙️ {t('speak')}</Button>
        <Button variant={saved ? 'violet' : 'soft'} size="sm" onClick={() => actions.toggleSaved(item.id)}>{saved ? `★ ${t('saved')}` : `☆ ${t('save')}`}</Button>
        {onPractice && <Button variant="ghost" size="sm" onClick={onPractice}>{t('practice')}</Button>}
      </div>

      {speaking && (
        <div className="wordcard__speak">
          <p className="muted small">{lang === 'de' ? 'Sprich das Wort:' : 'Скажите слово:'} <b className="de">{item.de}</b></p>
          <SpeakInput onResult={onHeard} />
          {heard && (
            <div className={`feedback ${heard.ok ? 'feedback--ok' : 'feedback--bad'}`}>
              {heard.ok ? '✓' : '✗'} «{heard.text}»
            </div>
          )}
        </div>
      )}
    </article>
  )
}
