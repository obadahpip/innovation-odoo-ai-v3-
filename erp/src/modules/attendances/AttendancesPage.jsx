/**
 * AttendancesPage.jsx — Attendances
 * Odoo 19.0 model: hr.attendance
 * Route base: /erp/attendances
 * Sub-nav: ['Attendances', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {}

const COLUMNS = [
  {key:'employee_id',label:'Employee',width:'22%',render:(v) => <PartnerCell id={v}/>},
  {key:'check_in',label:'Check In',width:'20%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'check_out',label:'Check Out',width:'20%',render:(v) => v ? new Date(v).toLocaleString() : '—'},
  {key:'worked_hours',label:'Worked Hours',width:'14%'},
  {key:'overtime_hours',label:'Overtime',width:'12%'},
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
export function AttendancesPage() {
  return (
    <GenericList
      model="hr.attendance"
      title="Attendances"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/attendances/new"
      formPath="/erp/attendances/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🕐"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function AttendancesForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="hr.attendance" id={id}
      defaults={DEFAULTS}
      title="Attendance"
      backPath="/erp/attendances" backLabel="Attendances"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Employee'><input className='o-input' value={record?.employee_id||''} onChange={e=>setField('employee_id',e.target.value)}/></FieldRow>
          <FieldRow label='Check In'><input type='datetime-local' className='o-input' value={(record?.check_in||'').slice(0,16)} onChange={e=>setField('check_in',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Check Out'><input type='datetime-local' className='o-input' value={(record?.check_out||'').slice(0,16)} onChange={e=>setField('check_out',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default AttendancesPage
