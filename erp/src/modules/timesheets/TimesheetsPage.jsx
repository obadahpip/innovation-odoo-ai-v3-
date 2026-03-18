/**
 * TimesheetsPage.jsx — Timesheets
 * Odoo 19.0 model: account.analytic.line
 * Route base: /erp/timesheets
 * Sub-nav: ['All Timesheets', 'My Timesheets', 'Reporting']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'validated':{label:'Validated',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
}

const COLUMNS = [
  {key:'date',label:'Date',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'employee_id',label:'Employee',width:'16%'},
  {key:'project_id',label:'Project',width:'16%'},
  {key:'task_id',label:'Task',width:'16%'},
  {key:'name',label:'Description',width:'18%'},
  {key:'unit_amount',label:'Duration',width:'10%'},
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
export function TimesheetsPage() {
  return (
    <GenericList
      model="account.analytic.line"
      title="Timesheets"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/timesheets/new"
      formPath="/erp/timesheets/:id"
      searchFields={['name','subject','title']}
      emptyIcon="⏱️"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function TimesheetsForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="account.analytic.line" id={id}
      defaults={DEFAULTS}
      title="Timesheet"
      backPath="/erp/timesheets" backLabel="Timesheets"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Employee'><input className='o-input' value={record?.employee_id||''} onChange={e=>setField('employee_id',e.target.value)}/></FieldRow>
          <FieldRow label='Project'><input className='o-input' value={record?.project_id||''} onChange={e=>setField('project_id',e.target.value)}/></FieldRow>
          <FieldRow label='Task'><input className='o-input' value={record?.task_id||''} onChange={e=>setField('task_id',e.target.value)}/></FieldRow>
          <FieldRow label='Date'><input type='date' className='o-input' value={(record?.date||'').slice(0,10)} onChange={e=>setField('date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Description'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Duration (hrs)'><input type='number' className='o-input' value={record?.unit_amount||0} onChange={e=>setField('unit_amount',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default TimesheetsPage
