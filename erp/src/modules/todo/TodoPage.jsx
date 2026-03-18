/**
 * TodoPage.jsx — To-Do Tasks
 * Odoo 19.0 model: project.task
 * Route base: /erp/todos
 * Sub-nav: ['My Tasks', 'All Tasks']
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
  {key:'name',label:'Task',width:'32%'},
  {key:'date_deadline',label:'Deadline',width:'16%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'user_ids',label:'Assigned',width:'14%'},
  {key:'tag_ids',label:'Tags',width:'14%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
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
export function TodoPage() {
  return (
    <GenericList
      model="project.task"
      title="To-Do Tasks"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/todos/new"
      formPath="/erp/todos/:id"
      searchFields={['name','subject','title']}
      emptyIcon="✅"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function TodoForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="project.task" id={id}
      defaults={DEFAULTS}
      title="To-Do Task"
      backPath="/erp/todos" backLabel="To-Do Tasks"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Task Title'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Deadline'><input type='datetime-local' className='o-input' value={(record?.date_deadline||'').slice(0,16)} onChange={e=>setField('date_deadline',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Notes'><textarea className='o-input' rows={3} value={record?.description||''} onChange={e=>setField('description',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default TodoPage
