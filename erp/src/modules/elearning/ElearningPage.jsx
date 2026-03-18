/**
 * ElearningPage.jsx — eLearning Courses
 * Odoo 19.0 model: slide.channel
 * Route base: /erp/elearning
 * Sub-nav: ['Courses', 'Contents', 'Members', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'published':{label:'Published',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'unpublished':{label:'Unpublished',color:'var(--text3)',bg:'var(--surface3)'},
}

const COLUMNS = [
  {key:'name',label:'Course',width:'28%'},
  {key:'total_slides',label:'Contents',width:'12%'},
  {key:'members_count',label:'Members',width:'12%'},
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
export function ElearningPage() {
  return (
    <GenericList
      model="slide.channel"
      title="eLearning Courses"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/elearning/new"
      formPath="/erp/elearning/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🎓"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function ElearningForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="slide.channel" id={id}
      defaults={DEFAULTS}
      title="eLearning Course"
      backPath="/erp/elearning" backLabel="eLearning Courses"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Course Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Description'><textarea className='o-input' rows={3} value={record?.description||''} onChange={e=>setField('description',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default ElearningPage
