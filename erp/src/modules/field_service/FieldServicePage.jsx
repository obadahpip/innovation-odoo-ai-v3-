/**
 * FieldServicePage.jsx — Field Service Tasks
 * Odoo 19.0 model: project.task
 * Route base: /erp/field-service
 * Sub-nav: ['My Tasks', 'All Tasks', 'Planning', 'Map', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  '01_in_progress':{label:'In Progress',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  '04_waiting_normal':{label:'Waiting',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  '1_done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  '1_cancelled':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Task',width:'26%'},
  {key:'partner_id',label:'Customer',width:'18%',render:(v) => <PartnerCell id={v}/>},
  {key:'user_ids',label:'Assigned',width:'14%'},
  {key:'date_deadline',label:'Deadline',width:'14%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'stage_id',label:'Stage',width:'12%'},
]

const STAGES = [
  {value:'01_in_progress',label:'In Progress'},
  {value:'1_done',label:'Done'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function FieldServicePage() {
  return (
    <GenericList
      model="project.task"
      title="Field Service Tasks"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/field-service/new"
      formPath="/erp/field-service/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🔧"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function FieldServiceForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="project.task" id={id}
      defaults={DEFAULTS}
      title="Field Service Task"
      backPath="/erp/field-service" backLabel="Field Service Tasks"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Task Title'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Customer'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Assigned To'><input className='o-input' value={record?.user_ids||''} onChange={e=>setField('user_ids',e.target.value)}/></FieldRow>
          <FieldRow label='Deadline'><input type='datetime-local' className='o-input' value={(record?.date_deadline||'').slice(0,16)} onChange={e=>setField('date_deadline',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default FieldServicePage
