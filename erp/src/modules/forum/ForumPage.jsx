/**
 * ForumPage.jsx — Forum
 * Odoo 19.0 model: forum.post
 * Route base: /erp/forum
 * Sub-nav: ['Questions', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'active':{label:'Published',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'close':{label:'Closed',color:'var(--text3)',bg:'var(--surface3)'},
  'offensive':{label:'Offensive',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Question',width:'35%'},
  {key:'forum_id',label:'Forum',width:'18%'},
  {key:'vote_count',label:'Votes',width:'10%'},
  {key:'answer_count',label:'Answers',width:'10%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
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
export function ForumPage() {
  return (
    <GenericList
      model="forum.post"
      title="Forum"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/forum/new"
      formPath="/erp/forum/:id"
      searchFields={['name','subject','title']}
      emptyIcon="💬"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function ForumForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="forum.post" id={id}
      defaults={DEFAULTS}
      title="Forum"
      backPath="/erp/forum" backLabel="Forum"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Question'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Content'><textarea className='o-input' rows={3} value={record?.content||''} onChange={e=>setField('content',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default ForumPage
