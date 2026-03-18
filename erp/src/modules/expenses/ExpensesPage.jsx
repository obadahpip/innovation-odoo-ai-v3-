/**
 * ExpensesPage.jsx — Expense Reports
 * Odoo 19.0 model: hr.expense.sheet
 * Route base: /erp/expenses
 * Sub-nav: ['My Expenses', 'My Expense Reports', 'All Expense Reports']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Draft',color:'var(--text3)',bg:'var(--surface3)'},
  'submit':{label:'Submitted',color:'var(--info)',bg:'rgba(52,152,219,0.15)'},
  'approve':{label:'Approved',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'post':{label:'Posted',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'done':{label:'Paid',color:'var(--success)',bg:'rgba(46,204,113,0.20)'},
  'refused':{label:'Refused',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Expense Report',width:'24%'},
  {key:'employee_id',label:'Employee',width:'18%',render:(v) => <PartnerCell id={v}/>},
  {key:'date',label:'Date',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'total_amount',label:'Total',width:'13%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'payment_mode',label:'Paid By',width:'15%'},
  {key:'state',label:'Status',width:'12%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Draft'},
  {value:'submit',label:'Submitted'},
  {value:'approve',label:'Approved'},
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
export function ExpensesPage() {
  return (
    <GenericList
      model="hr.expense.sheet"
      title="Expense Reports"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/expenses/new"
      formPath="/erp/expenses/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🧾"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function ExpensesForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="hr.expense.sheet" id={id}
      defaults={DEFAULTS}
      title="Expense Report"
      backPath="/erp/expenses" backLabel="Expense Reports"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Expense Report'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)} placeholder='e.g. Q1 Travel Expenses'/></FieldRow>
          <FieldRow label='Payment By'><select className='o-input' value={record?.payment_mode||''} onChange={e=>setField('payment_mode',e.target.value)}><option value='own_account'>Employee (to reimburse)</option><option value='company_account'>Company</option></select></FieldRow>
          <FieldRow label='Total'><input type='number' className='o-input' value={record?.total_amount||0} onChange={e=>setField('total_amount',parseFloat(e.target.value)||0)}/></FieldRow>
          <FieldRow label='Expense Date'><input type='date' className='o-input' value={(record?.date||'').slice(0,10)} onChange={e=>setField('date',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default ExpensesPage
