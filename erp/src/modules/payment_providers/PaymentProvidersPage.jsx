/**
 * PaymentProvidersPage.jsx — Payment Providers
 * Odoo 19.0 model: payment.provider
 * Route base: /erp/payment-providers
 * Sub-nav: ['Payment Providers', 'Configuration']
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GenericList, GenericForm, StateBadge, PriorityStars, FieldRow } from '../ModuleFactory.jsx'
import ActionBar from '@shell/ActionBar.jsx'

const STATE_MAP = {
  'enabled':{label:'Enabled',color:'var(--success)',bg:'rgba(46,204,113,0.15)'},
  'disabled':{label:'Disabled',color:'var(--text3)',bg:'var(--surface3)'},
  'test':{label:'Test Mode',color:'var(--warning)',bg:'rgba(240,173,78,0.15)'},
}

const COLUMNS = [
  {key:'name',label:'Provider',width:'25%'},
  {key:'code',label:'Technical Name',width:'20%'},
  {key:'state',label:'Status',width:'15%',render:(v) => <StateBadge value={v} map={STATE_MAP}/>},
  {key:'company_id',label:'Company',width:'20%'},
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
export function PaymentProvidersPage() {
  return (
    <GenericList
      model="payment.provider"
      title="Payment Providers"
      columns={COLUMNS}
      sortKey="__createdAt" sortDir="desc"
      newPath="/erp/payment-providers/new"
      formPath="/erp/payment-providers/:id"
      searchFields={['name','subject','title']}
      emptyIcon="💳"
      views={['list','kanban','activity']}
    />
  )
}

// ── Form view ─────────────────────────────────────────────────────
export function PaymentProvidersForm() {
  const { id } = useParams()
  return (
    <GenericForm
      model="payment.provider" id={id}
      defaults={DEFAULTS}
      title="Payment Provider"
      backPath="/erp/payment-providers" backLabel="Payment Providers"
      stages={STAGES}
    >
      {({ record, setField }) => (
        <div style={{ maxWidth:820 }}>
          <FieldRow label='Provider Name'><input className='o-input' value={record?.name||''} onChange={e=>setField('name',e.target.value)}/></FieldRow>
          <FieldRow label='Code'><input className='o-input' value={record?.code||''} onChange={e=>setField('code',e.target.value)}/></FieldRow>
          <FieldRow label='State'><select className='o-input' value={record?.state||''} onChange={e=>setField('state',e.target.value)}><option value='enabled'>Enabled</option><option value='test'>Test Mode</option><option value='disabled'>Disabled</option></select></FieldRow>
        </div>
      )}
    </GenericForm>
  )
}

export default PaymentProvidersPage
