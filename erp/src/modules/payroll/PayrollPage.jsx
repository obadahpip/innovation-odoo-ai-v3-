/**
 * PayrollPage.jsx — Payslips
 * Odoo 19.0 model: hr.payslip
 * Route base: /erp/payroll
 * Sub-nav: ['Payslips', 'Payslip Batches', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'verify':{label:'Waiting',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'done':{label:'Done',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'cancel':{label:'Rejected',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Reference',width:'20%'},
  {key:'employee_id',label:'Employee',width:'20%',render:(v) => <PartnerCell id={v}/>},
  {key:'date_from',label:'From',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'date_to',label:'To',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'net_wage',label:'Net Wage',width:'13%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'verify',label:'Waiting'},
  {value:'done',label:'Done'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function PayrollPage() {
  return (
    <GenericList
      model="hr.payslip"
      title="Payslips"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/payroll/new"
      formPath="/erp/payroll/:id"
      searchFields={['name','subject','title']}
      emptyIcon="💵"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function PayrollForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="hr.payslip" id={id}
      defaults={DEFAULTS}
      title="Payslip"
      backPath="/erp/payroll" backLabel="Payslips"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Employee'><input className='o-input' value={record?.employee_id||''} onChange={e=>setField('employee_id',e.target.value)}/></FieldRow>
          <FieldRow label='Contract'><input className='o-input' value={record?.contract_id||''} onChange={e=>setField('contract_id',e.target.value)}/></FieldRow>
          <FieldRow label='Date From'><input type='date' className='o-input' value={(record?.date_from||'').slice(0,10)} onChange={e=>setField('date_from',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Date To'><input type='date' className='o-input' value={(record?.date_to||'').slice(0,10)} onChange={e=>setField('date_to',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Salary Structure'><input className='o-input' value={record?.struct_id||''} onChange={e=>setField('struct_id',e.target.value)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default PayrollPage
