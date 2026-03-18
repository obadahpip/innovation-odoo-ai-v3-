/**
 * KnowledgePage.jsx — Knowledge Articles
 * Odoo 19.0 model: knowledge.article
 * Route base: /erp/knowledge
 * Sub-nav: ['Favorites', 'All Articles']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Private',color:'var(--text3)',bg:'var(--surface3)'},
  'published':{label:'Published',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Article',width:'32%'},
  {key:'parent_id',label:'Parent',width:'18%'},
  {key:'last_edition_date',label:'Last Edited',width:'15%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'is_published',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = null

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function KnowledgePage() {
  return (
    <GenericList
      model="knowledge.article"
      title="Knowledge Articles"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/knowledge/new"
      formPath="/erp/knowledge/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📚"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function KnowledgeForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="knowledge.article" id={id}
      defaults={DEFAULTS}
      title="Knowledge Article"
      backPath="/erp/knowledge" backLabel="Knowledge Articles"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Article Title'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Content'><textarea className='o-input' rows={3} value={record?.body||''} onChange={e=>setField('body',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default KnowledgePage
