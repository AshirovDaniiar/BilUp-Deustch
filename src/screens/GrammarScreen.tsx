import { useState } from 'react'
import { useApp } from '../app/store'
import { A } from '../app/router'
import { Button, Card, Chip, PageHeader, SectionTitle } from '../components/ui'
import { DEFAULT_LEVEL } from '../data/course'
import { grammarIndex, grammarOf, levelOfUnit, whyNotesForConcept } from '../data/catalog'
import { activeLevel } from '../features/progress/stats'
import type { GrammarCategory } from '../data/types'
import { CaseLab } from '../features/grammar/CaseLab'
import { ExampleList, WhyButton } from '../features/grammar/Highlight'
import { ConceptVisual } from '../features/grammar/Labs'
import type { TKey } from '../i18n'
import { locStrict, tr } from '../utils/text'
import { NotFound } from './NotFound'

const CATS: GrammarCategory[] = ['articles', 'cases', 'verbs', 'tenses', 'wordorder', 'prepositions', 'adjectives', 'pronouns', 'conjunctions', 'passive', 'konjunktiv', 'relative']

export function GrammarScreen() {
  const { state, t, lang } = useApp()
  const [cat, setCat] = useState<GrammarCategory | 'all'>('all')
  const all = grammarOf(activeLevel(state))
  const list = all.filter(g => cat === 'all' || g.category === cat)
  return (
    <div className="stack">
      <PageHeader eyebrow="🧪 Grammar Lab" title={t('grammarLab')} sub={t('grammarLabSub')} />
      <Card className="featured">
        <div className="eyebrow">{t('casesLab')}</div>
        <p className="muted small" style={{ marginBottom: 12 }}>{t('casesLabSub')}</p>
        <CaseLab />
      </Card>

      <SectionTitle>{t('nav_grammar')}</SectionTitle>
      <div className="row catchips">
        <Chip active={cat === 'all'} onClick={() => setCat('all')} tone="blue">{t('all')}</Chip>
        {CATS.map(c => {
          const has = all.some(g => g.category === c)
          return has ? (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{t(`cat_${c}` as TKey)}</Chip>
          ) : (
            <Chip key={c} className="chip--soon">{t(`cat_${c}` as TKey)} · B1+</Chip>
          )
        })}
      </div>
      <div className="grid grid--2">
        {list.map(g => (
          <A key={g.id} to={`/grammar/${g.id}`} className="card card--interactive conceptcard">
            <div className="row row--between">
              <Chip tone="violet">{t(`cat_${g.category}` as TKey)}</Chip>
              {state.completed.includes(`topic:${g.id}`) && <Chip tone="green">✓</Chip>}
            </div>
            <h3 className="h3">{tr(g.title, lang)}</h3>
            <p className="muted small break">{tr(g.summary, lang).slice(0, 110)}{tr(g.summary, lang).length > 110 ? '…' : ''}</p>
          </A>
        ))}
      </div>
    </div>
  )
}

export function GrammarDetail({ id }: { id: string }) {
  const { t, lang } = useApp()
  const c = grammarIndex.get(id)
  if (!c) return <NotFound />
  const why = whyNotesForConcept(id)
  const strictC = levelOfUnit(c.unit) !== 'A1' // authored A2 concept: translations in the learner's own language only
  return (
    <div className="stack">
      <PageHeader back="/grammar" eyebrow={`${t(`cat_${c.category}` as TKey)} · ${levelOfUnit(c.unit) ?? DEFAULT_LEVEL}`} title={tr(c.title, lang)} sub={tr(c.summary, lang)} />
      <Card><ConceptVisual concept={c} /></Card>
      <Card tone="violet">
        <div className="eyebrow">{t('whyLabel')}</div>
        <p className="break">{tr(c.why, lang)}</p>
        {why.map(w => (
          <div key={w.sentence} className="whybox">
            <div className="de break">{w.sentence}</div>
            <div className="muted small">{strictC ? locStrict(w.ru, w.ky, lang) : w.ru}</div>
            <div style={{ marginTop: 8 }}><WhyButton note={w} label={`${t('why')} «${w.word}»`} /></div>
          </div>
        ))}
      </Card>
      <Card><div className="eyebrow">{t('when')}</div><ul className="bullets">{c.when.map(w => <li key={w.ru} className="break">{tr(w, lang)}</li>)}</ul></Card>
      <Card><div className="eyebrow">{t('examples')}</div><ExampleList items={c.examples} strict={strictC} /></Card>
      <Card>
        <div className="eyebrow">{t('mistakes')}</div>
        <ul className="mistakes">{c.mistakes.map(m => <li key={m.wrong}><div className="bad break">✗ {m.wrong}</div><div className="good break">✓ {m.right}</div><div className="muted small break">{tr(m.note, lang)}</div></li>)}</ul>
      </Card>
      <Card><div className="eyebrow">{t('reallife')}</div><ExampleList items={c.reallife} strict={strictC} /></Card>
      <Button to={`/learn/topic/${c.id}`} size="lg" block>{t('openTopic')} →</Button>
    </div>
  )
}
