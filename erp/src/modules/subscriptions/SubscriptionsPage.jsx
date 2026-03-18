/**
 * SubscriptionsPage.jsx — Subscriptions
 * Odoo 19.0 model: sale.subscription
 * Route base: /erp/subscriptions
 * Sub-nav: ['Subscriptions', 'Reporting', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'draft':{label:'Quotation',color:'var(--text3)',bg:'var(--surface3)'},
  'in_progress':{label:'In Progress',color:'var(--teal)',bg:'rgba(0,181,181,0.15)'},
  'paused':{label:'Paused',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
  'closed':{label:'Closed',color:'var(--text2)',bg:'var(--surface3)'},
  'cancelled':{label:'Cancelled',color:'var(--danger)',bg:'rgba(231,76,60,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Subscription',width:'18%'},
  {key:'partner_id',label:'Customer',width:'18%',render:(v) => <PartnerCell id={v}/>},
  {key:'date_start',label:'Start',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'recurring_monthly',label:'Monthly Rev.',width:'13%',render:(v) => v!=null ? `${Number(v).toFixed(3)} د.ا` : '—'},
  {key:'next_invoice_date',label:'Next Invoice',width:'13%',render:(v) => v ? new Date(v).toLocaleDateString() : '—'},
  {key:'stage_id',label:'Stage',width:'12%'},
  {key:'state',label:'Status',width:'10%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
]

const STAGES = [
  {value:'draft',label:'Quotation'},
  {value:'in_progress',label:'In Progress'},
  {value:'paused',label:'Paused'},
  {value:'closed',label:'Closed'}
]

const DEFAULTS = { state:'draft', active:true }

// ── Lazy partner name cell ────────────────────────────────────────
function PartnerCell({ id }) {
  const [n, setN] = useState(null)
  if (!n && id) import('@data/db.js').then(db => db.getRecord('res.partner', id).then(p => p && setN(p.name)))
  return <span>{n||id||'—'}</span>
}

// ── List view ─────────────────────────────────────────────────────
export function SubscriptionsPage() {
  return (
    <GenericList
      model="sale.subscription"
      title="Subscriptions"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/subscriptions/new"
      formPath="/erp/subscriptions/:id"
      searchFields={['name','subject','title']}
      emptyIcon="🔄"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function SubscriptionsForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="sale.subscription" id={id}
      defaults={DEFAULTS}
      title="Subscription"
      backPath="/erp/subscriptions" backLabel="Subscriptions"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Subscription Ref'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Customer'><input className='o-input' value={record?.partner_id||''} onChange={e=>setField('partner_id',e.target.value)} placeholder='Search...'/></FieldRow>
          <FieldRow label='Start Date'><input type='date' className='o-input' value={(record?.date_start||'').slice(0,10)} onChange={e=>setField('date_start',e.target.value)} style={{colorScheme:'dark'}}/></FieldRow>
          <FieldRow label='Monthly Revenue'><input type='number' className='o-input' value={record?.recurring_monthly||0} onChange={e=>setField('recurring_monthly',parseFloat(e.target.value)||0)}/></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default SubscriptionsPage
