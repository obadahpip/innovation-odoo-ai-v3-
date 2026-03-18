/**
 * PlanningPage.jsx — Planning Shifts
 * Odoo 19.0 model: planning.slot
 * Route base: /erp/planning
 * Sub-nav: ['Shifts', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'published':{label:'Published',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
}

const COLUMNS = [
  {key:'resource_id',label:'Employee',width:'20%'},
  {key:'role_id',label:'Role',width:'15%'},
  {key:'start_datetime',label:'Start',width:'17%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'end_datetime',label:'End',width:'17%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'allocated_hours',label:'Hours',width:'10%'},
  {key:'state',label:'Status',width:'10%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'published',label:'Published'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function PlanningPage() {
  return (
    <GenericList
      model="planning.slot"
      title="Planning Shifts"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/planning/new"
      formPath="/erp/planning/:id"
      searchFields={['name','subject','title']}
      emptyIcon="📅"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function PlanningForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="planning.slot" id={id}
      defaults={DEFAULTS}
      title="Planning Shift"
      backPath="/erp/planning" backLabel="Planning Shifts"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Employee'><input className='o-input' value={record?.resource_id||''} onChange={e=>setField('resource_id',e.target.value)}/></FieldRow>
          <FieldRow label='Role'><input className='o-input' value={record?.role_id||''} onChange={e=>setField('role_id',e.target.value)}/></FieldRow>
          <FieldRow label='Start'><input type='datetime-local' className='o-input' value={(record?.start_datetime||'').slice(0,16)} onChange={e=>setField('start_datetime',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='End'><input type='datetime-local' className='o-input' value={(record?.end_datetime||'').slice(0,16)} onChange={e=>setField('end_datetime',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default PlanningPage
